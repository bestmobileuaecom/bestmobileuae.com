"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { 
  AdminLayoutWrapper,
  SectionCard,
  TextareaField,
  FormHeader,
  BasicInfoSection,
  HeaderSection,
  StorePricesSection,
  BuySkipSection,
  ScoresSection,
  SpecsSection
} from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import { 
  generateSlug, 
  getLowestStorePrice, 
  getInitialFormState,
  preparePhoneData 
} from "@/lib/admin/phoneFormUtils";

export default function PhoneFormClient({ user, brands, phone }) {
  const isEdit = !!phone;
  const router = useRouter();
  const supabase = createClient();
  const saveTimeoutRef = useRef(null);
  const [phoneId, setPhoneId] = useState(phone?.id || null);
  const originalLowestPrice = useRef(getLowestStorePrice(phone?.storePrices));

  // Form state
  const [formData, setFormData] = useState(getInitialFormState(phone));
  const [storePrices, setStorePrices] = useState(
    phone?.storePrices || [{ store_name: "", price: "", price_value: "", url: "" }]
  );
  const [specsText, setSpecsText] = useState(
    typeof phone?.specs === "object" ? JSON.stringify(phone?.specs, null, 2) : "{}"
  );

  // UI State
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update field helper
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Handle name change (auto-generates slug)
  const handleNameChange = (name) => {
    updateField("name", name);
    if (!isEdit || !formData.slug) {
      updateField("slug", generateSlug(name));
    }
  };

  // Auto-update price from lowest store price
  useEffect(() => {
    const activePrices = storePrices.filter(sp => sp.price_value && Number(sp.price_value) > 0);
    if (activePrices.length > 0) {
      const lowestPrice = Math.min(...activePrices.map(sp => Number(sp.price_value)));
      if (lowestPrice !== Number(formData.price)) {
        setFormData(prev => ({ 
          ...prev, 
          price: lowestPrice,
          price_range: `AED ${lowestPrice.toLocaleString()}`
        }));
      }
    }
  }, [storePrices]);

  // Auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges || !formData.name) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => handleAutoSave(), 3000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, storePrices, hasUnsavedChanges]);

  // Auto-save function
  const handleAutoSave = async () => {
    if (!formData.name || !formData.slug) return;
    setSaving(true);
    const phoneData = preparePhoneData(formData, specsText, null, phone);

    try {
      let savedId = phoneId;
      if (savedId) {
        const { error } = await supabase.from("phones").update(phoneData).eq("id", savedId);
        if (error) throw error;
      } else {
        phoneData.status = "draft";
        const { data, error } = await supabase.from("phones").insert(phoneData).select("id").single();
        if (error) throw error;
        savedId = data.id;
        setPhoneId(savedId);
        window.history.replaceState({}, "", `/admin/phones/${savedId}`);
      }

      await saveStorePrices(savedId);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setSaving(false);
    }
  };

  // Save store prices
  const saveStorePrices = async (savedId) => {
    await supabase.from("phone_store_prices").delete().eq("phone_id", savedId);
    const validPrices = storePrices.filter((p) => p.store_name && p.price);
    if (validPrices.length > 0) {
      await supabase.from("phone_store_prices").insert(
        validPrices.map((p) => ({ 
          phone_id: savedId, 
          store_name: p.store_name, 
          price: p.price, 
          price_value: Number(p.price_value) || 0, 
          url: p.url 
        }))
      );
    }
  };

  // Main save function
  const handleSave = async (status) => {
    const errs = {};
    if (!formData.name) errs.name = "Required";
    if (!formData.slug) errs.slug = "Required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    const phoneData = preparePhoneData(formData, specsText, status, phone);
    
    // Calculate for price alerts
    const validPricesForCheck = storePrices.filter(p => p.store_name && p.price_value > 0);
    const newLowestPrice = validPricesForCheck.length > 0 
      ? Math.min(...validPricesForCheck.map(p => Number(p.price_value)))
      : null;
    const oldLowestPrice = originalLowestPrice.current;

    try {
      let savedId = phoneId;
      if (savedId) {
        const { error } = await supabase.from("phones").update(phoneData).eq("id", savedId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("phones").insert(phoneData).select("id").single();
        if (error) throw error;
        savedId = data.id;
      }

      await saveStorePrices(savedId);

      // Send price drop notifications
      if (oldLowestPrice && newLowestPrice && newLowestPrice < oldLowestPrice && status === "published") {
        await sendPriceDropNotifications(savedId, newLowestPrice, oldLowestPrice);
        originalLowestPrice.current = newLowestPrice;
      }

      router.push("/admin/phones");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Send price drop notifications
  const sendPriceDropNotifications = async (savedId, newPrice, oldPrice) => {
    try {
      const response = await fetch("/api/price-alert/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneId: savedId,
          newPrice,
          oldPrice,
          phoneName: formData.name,
          phoneSlug: formData.slug,
          imageUrl: formData.image_url,
        }),
      });
      const result = await response.json();
      if (result.notified > 0) {
        console.log(`Price drop notifications sent to ${result.notified} subscribers`);
      }
    } catch (error) {
      console.error("Failed to send price drop notifications:", error);
    }
  };

  return (
    <AdminLayoutWrapper user={user} title={isEdit ? `Edit: ${phone.name}` : "Add New Phone"}>
      <FormHeader
        slug={formData.slug}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        onSaveDraft={() => handleSave("draft")}
        onPublish={() => handleSave("published")}
      />

      <div className="space-y-4">
        {/* Section 0: Basic Info */}
        <BasicInfoSection 
          formData={formData}
          updateField={updateField}
          brands={brands}
          errors={errors}
          handleNameChange={handleNameChange}
        />

        {/* Section 1: Header */}
        <HeaderSection formData={formData} updateField={updateField} />

        {/* Section 2: Quick Verdict */}
        <SectionCard number="2" title="Quick Verdict" subtitle="Should You Buy This Phone?">
          <div className="pt-4">
            <TextareaField 
              label="Verdict" 
              value={formData.verdict} 
              onChange={(v) => updateField("verdict", v)} 
              placeholder="Yes, if you want... No, if camera quality matters..." 
              rows={2} 
              hint="Start with 'Yes, if...' and 'No, if...'" 
            />
          </div>
        </SectionCard>

        {/* Section 3: Store Prices */}
        <StorePricesSection 
          storePrices={storePrices}
          setStorePrices={setStorePrices}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />

        {/* Section 4: Buy/Skip */}
        <BuySkipSection formData={formData} updateField={updateField} />

        {/* Section 5: Scores */}
        <ScoresSection formData={formData} updateField={updateField} />

        {/* Section 6: Key Differences */}
        <KeyDifferencesSection formData={formData} updateField={updateField} />

        {/* Section 7: Price Comparison */}
        <PriceComparisonSection formData={formData} updateField={updateField} />

        {/* Section 8: Final Recommendation */}
        <SectionCard number="8" title="Final Recommendation" subtitle="Decision closure">
          <div className="pt-4">
            <TextareaField 
              label="Recommendation" 
              value={formData.final_recommendation} 
              onChange={(v) => updateField("final_recommendation", v)} 
              placeholder="Buy the Samsung Galaxy A35 if your priority is battery life..." 
              rows={2} 
            />
          </div>
        </SectionCard>

        {/* Section 9: Alternatives */}
        <AlternativesSection formData={formData} updateField={updateField} />

        {/* Section 10: Specifications */}
        <SpecsSection 
          specsText={specsText}
          setSpecsText={setSpecsText}
          setHasUnsavedChanges={setHasUnsavedChanges}
          updateField={updateField}
        />

        {/* Section 11: FAQs */}
        <FAQsSection formData={formData} updateField={updateField} />

        {/* Section 12: Related Links */}
        <RelatedLinksSection formData={formData} updateField={updateField} />
      </div>
    </AdminLayoutWrapper>
  );
}

// --- Inline Section Components (to keep file simpler) ---

function KeyDifferencesSection({ formData, updateField }) {
  return (
    <SectionCard number="6" title="Real-World Experience" subtitle="Key Differences (4 cards)">
      <div className="pt-4 space-y-3">
        {formData.key_differences.map((d, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex gap-2 mb-2">
              <input type="text" value={d.icon || ""} onChange={(e) => { const u = [...formData.key_differences]; u[i] = { ...u[i], icon: e.target.value }; updateField("key_differences", u); }} className="w-10 px-2 py-1 border rounded text-center text-sm" placeholder="⚡" />
              <input type="text" value={d.title || ""} onChange={(e) => { const u = [...formData.key_differences]; u[i] = { ...u[i], title: e.target.value }; updateField("key_differences", u); }} className="flex-1 px-2 py-1 border rounded text-sm" placeholder="Performance" />
              <button type="button" onClick={() => updateField("key_differences", formData.key_differences.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            {(d.points || ["", "", ""]).map((p, pi) => (
              <input key={pi} type="text" value={p} onChange={(e) => { const u = [...formData.key_differences]; const pts = [...(u[i].points || ["", "", ""])]; pts[pi] = e.target.value; u[i] = { ...u[i], points: pts }; updateField("key_differences", u); }} className="w-full px-2 py-1 border rounded text-sm mb-1" placeholder={`Point ${pi + 1}`} />
            ))}
          </div>
        ))}
        <button type="button" onClick={() => updateField("key_differences", [...formData.key_differences, { icon: "", title: "", points: ["", "", ""] }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add Card</button>
      </div>
    </SectionCard>
  );
}

function PriceComparisonSection({ formData, updateField }) {
  return (
    <SectionCard number="7" title="How This Phone Compares" subtitle="Price comparison points">
      <div className="pt-4 space-y-2">
        {formData.price_comparison.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select value={c.type || "better"} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], type: e.target.value }; updateField("price_comparison", u); }} className="w-24 px-2 py-2 border rounded text-sm">
              <option value="better">✓ Better</option>
              <option value="average">○ Average</option>
              <option value="worse">✗ Worse</option>
            </select>
            <input type="text" value={c.label || ""} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], label: e.target.value }; updateField("price_comparison", u); }} className="w-36 px-2 py-2 border rounded text-sm" placeholder="Better battery" />
            <input type="text" value={c.text || ""} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], text: e.target.value }; updateField("price_comparison", u); }} className="flex-1 px-2 py-2 border rounded text-sm" placeholder="than most phones" />
            <button type="button" onClick={() => updateField("price_comparison", formData.price_comparison.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => updateField("price_comparison", [...formData.price_comparison, { type: "better", label: "", text: "" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
      </div>
    </SectionCard>
  );
}

function AlternativesSection({ formData, updateField }) {
  return (
    <SectionCard number="9" title="Similar Phones to Consider" subtitle="Best alternatives">
      <div className="pt-4 space-y-2">
        {formData.alternatives.map((a, i) => (
          <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
            <input type="text" value={a.name || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], name: e.target.value }; updateField("alternatives", u); }} className="w-40 px-2 py-2 border rounded text-sm" placeholder="Xiaomi Redmi Note 13" />
            <input type="text" value={a.slug || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], slug: e.target.value }; updateField("alternatives", u); }} className="w-40 px-2 py-2 border rounded text-sm" placeholder="xiaomi-redmi-note-13" />
            <input type="text" value={a.reason || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], reason: e.target.value }; updateField("alternatives", u); }} className="flex-1 px-2 py-2 border rounded text-sm" placeholder="Better camera for less" />
            <button type="button" onClick={() => updateField("alternatives", formData.alternatives.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => updateField("alternatives", [...formData.alternatives, { name: "", slug: "", reason: "", image: "/mobile1.jpg" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
      </div>
    </SectionCard>
  );
}

function FAQsSection({ formData, updateField }) {
  return (
    <SectionCard number="11" title="Common Questions" subtitle="FAQs">
      <div className="pt-4 space-y-3">
        {formData.faqs.map((f, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Q{i + 1}</span>
              <button type="button" onClick={() => updateField("faqs", formData.faqs.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <input type="text" value={f.question || ""} onChange={(e) => { const u = [...formData.faqs]; u[i] = { ...u[i], question: e.target.value }; updateField("faqs", u); }} className="w-full px-2 py-2 border rounded text-sm mb-2" placeholder="Does it support UAE 5G?" />
            <textarea value={f.answer || ""} onChange={(e) => { const u = [...formData.faqs]; u[i] = { ...u[i], answer: e.target.value }; updateField("faqs", u); }} rows={2} className="w-full px-2 py-2 border rounded text-sm" placeholder="Yes, the phone supports..." />
          </div>
        ))}
        <button type="button" onClick={() => updateField("faqs", [...formData.faqs, { question: "", answer: "" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add FAQ</button>
      </div>
    </SectionCard>
  );
}

function RelatedLinksSection({ formData, updateField }) {
  return (
    <SectionCard number="12" title="You May Also Like" subtitle="Internal links for SEO">
      <div className="pt-4 space-y-2">
        {formData.related_links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={l.href || ""} onChange={(e) => { const u = [...formData.related_links]; u[i] = { ...u[i], href: e.target.value }; updateField("related_links", u); }} className="w-1/3 px-2 py-2 border rounded text-sm" placeholder="/phones?brand=samsung" />
            <input type="text" value={l.label || ""} onChange={(e) => { const u = [...formData.related_links]; u[i] = { ...u[i], label: e.target.value }; updateField("related_links", u); }} className="flex-1 px-2 py-2 border rounded text-sm" placeholder="All Samsung Phones" />
            <button type="button" onClick={() => updateField("related_links", formData.related_links.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => updateField("related_links", [...formData.related_links, { href: "", label: "" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add Link</button>
      </div>
    </SectionCard>
  );
}
