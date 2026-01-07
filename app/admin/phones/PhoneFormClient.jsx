"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin";
import { ImageUpload } from "@/components/admin/forms";
import { createClient } from "@/lib/supabase/client";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Section Card with number badge to show order
function SectionCard({ number, title, subtitle, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
            {number}
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// Input components
function InputField({ label, value, onChange, placeholder, type = "text", required, error, hint, className = "", disabled = false }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function PhoneFormClient({ user, brands, stores = [], phone }) {
  const isEdit = !!phone;
  const router = useRouter();
  const supabase = createClient();
  const saveTimeoutRef = useRef(null);
  const [phoneId, setPhoneId] = useState(phone?.id || null);
  
  // Calculate original lowest store price for price drop detection
  const getLowestStorePrice = (prices) => {
    const activePrices = prices?.filter(p => p.price_value > 0) || [];
    return activePrices.length > 0 ? Math.min(...activePrices.map(p => p.price_value)) : null;
  };
  const originalLowestPrice = useRef(getLowestStorePrice(phone?.storePrices));

  // Form state - organized by frontend section order
  const [formData, setFormData] = useState({
    // Basic (required)
    name: phone?.name || "",
    slug: phone?.slug || "",
    brand_id: phone?.brand_id || "",
    price: phone?.price || "",
    price_range: phone?.price_range || "",
    image_url: phone?.image_url || "/mobile1.jpg",
    category: phone?.category || "mid-range",
    status: phone?.status || "draft",

    // Section 1: Header
    identity: phone?.identity || "",
    overall_score_rating: phone?.overall_score_rating || "",
    overall_score_label: phone?.overall_score_label || "",
    why_pick: phone?.why_pick || "",
    trust_signals: phone?.trust_signals?.length ? phone.trust_signals : [
      { icon: "🔋", label: "" },
      { icon: "🔄", label: "" },
      { icon: "📱", label: "" },
      { icon: "📶", label: "" },
    ],
    storage_options: phone?.storage_options || [],
    color_options: phone?.color_options || [],

    // Section 2: Quick Verdict
    verdict: phone?.verdict || "",

    // Section 3: Store Prices (handled separately)

    // Section 4: Buy/Skip
    buy_reasons: phone?.buy_reasons?.length ? phone.buy_reasons : ["", "", ""],
    skip_reasons: phone?.skip_reasons?.length ? phone.skip_reasons : ["", "", ""],

    // Section 5: Score Strip (auto-calculated from these)
    score_value: phone?.score_value || "",
    score_performance: phone?.score_performance || "",
    score_camera: phone?.score_camera || "",
    score_battery: phone?.score_battery || "",
    score_display: phone?.score_display || "",

    // Section 6: Key Differences
    key_differences: phone?.key_differences || [],

    // Section 7: Price Comparison
    price_comparison: phone?.price_comparison || [],

    // Section 8: Final Recommendation
    final_recommendation: phone?.final_recommendation || "",

    // Section 9: Alternatives
    alternatives: phone?.alternatives || [],

    // Section 10: Specifications
    specs: phone?.specs || {},

    // Section 11: FAQs
    faqs: phone?.faqs || [],

    // Section 12: Related Links
    related_links: phone?.related_links || [],

    // Extra
    badge: phone?.badge || "",
    badge_color: phone?.badge_color || "emerald",
    release_date: phone?.release_date || "",
    tags: phone?.tags || [],
    best_for: phone?.best_for || [],
  });

  // Store prices (separate state) - now uses store_id reference
  const [storePrices, setStorePrices] = useState(
    phone?.storePrices?.length 
      ? phone.storePrices.map(p => ({
          store_id: p.store_id || "",
          store_name: p.store_name || "",
          price_value: p.price_value || "",
          url: p.url || ""
        }))
      : [{ store_id: "", store_name: "", price_value: "", url: "" }]
  );

  // Helper to format price as AED X,XXX
  const formatPrice = (value) => {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return "";
    return `AED ${num.toLocaleString()}`;
  };

  // Helper to get store by id
  const getStoreById = (storeId) => stores.find(s => s.id === storeId);

  // Specs as text for easy editing
  const [specsText, setSpecsText] = useState(
    typeof phone?.specs === "object" ? JSON.stringify(phone?.specs, null, 2) : "{}"
  );

  // UI State
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleNameChange = (name) => {
    updateField("name", name);
    if (!isEdit || !formData.slug) {
      updateField("slug", generateSlug(name));
    }
  };

  // Auto-update fallback price from lowest store price
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

  const handlePriceChange = (price) => {
    updateField("price", price);
    if (price) {
      updateField("price_range", `AED ${Number(price).toLocaleString()}`);
    }
  };

  // Auto-save
  useEffect(() => {
    if (!hasUnsavedChanges || !formData.name) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => handleAutoSave(), 3000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, storePrices, hasUnsavedChanges]);

  const prepareDataForSave = (status = null) => {
    const cleanArray = (arr) => arr?.filter((item) => {
      if (typeof item === "string") return item.trim();
      if (typeof item === "object") return Object.values(item).some((v) => v);
      return false;
    }) || [];

    let parsedSpecs = {};
    try { parsedSpecs = JSON.parse(specsText); } catch { parsedSpecs = formData.specs; }

    return {
      slug: formData.slug,
      name: formData.name,
      brand_id: formData.brand_id || null,
      category: formData.category,
      price: Math.round(Number(formData.price)) || 0,
      price_range: formData.price_range,
      release_date: formData.release_date || null,
      image_url: formData.image_url,
      identity: formData.identity,
      badge: formData.badge,
      badge_color: formData.badge_color,
      why_pick: formData.why_pick,
      overall_score_rating: formData.overall_score_rating ? parseFloat(Number(formData.overall_score_rating).toFixed(1)) : null,
      overall_score_label: formData.overall_score_label,
      score_camera: formData.score_camera ? Math.round(Number(formData.score_camera)) : null,
      score_battery: formData.score_battery ? Math.round(Number(formData.score_battery)) : null,
      score_performance: formData.score_performance ? Math.round(Number(formData.score_performance)) : null,
      score_display: formData.score_display ? Math.round(Number(formData.score_display)) : null,
      score_value: formData.score_value ? Math.round(Number(formData.score_value)) : null,
      verdict: formData.verdict,
      final_recommendation: formData.final_recommendation,
      buy_reasons: cleanArray(formData.buy_reasons),
      skip_reasons: cleanArray(formData.skip_reasons),
      trust_signals: formData.trust_signals.filter((s) => s.label),
      storage_options: cleanArray(formData.storage_options),
      color_options: formData.color_options.filter((c) => c.name),
      key_differences: formData.key_differences.filter((k) => k.title),
      price_comparison: formData.price_comparison.filter((p) => p.label),
      tags: cleanArray(formData.tags),
      best_for: cleanArray(formData.best_for),
      related_links: formData.related_links.filter((l) => l.href),
      alternatives: formData.alternatives.filter((a) => a.name),
      specs: parsedSpecs,
      faqs: formData.faqs.filter((f) => f.question),
      status: status || formData.status,
      published_at: status === "published" && !phone?.published_at ? new Date().toISOString() : phone?.published_at,
    };
  };

  const handleAutoSave = async () => {
    if (!formData.name || !formData.slug) return;
    setSaving(true);
    const phoneData = prepareDataForSave();

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

      if (savedId) {
        await supabase.from("phone_store_prices").delete().eq("phone_id", savedId);
        const validPrices = storePrices.filter((p) => (p.store_id || p.store_name) && p.price_value);
        if (validPrices.length > 0) {
          await supabase.from("phone_store_prices").insert(
            validPrices.map((p) => {
              const store = p.store_id ? getStoreById(p.store_id) : null;
              return { 
                phone_id: savedId, 
                store_id: p.store_id || null,
                store_name: store?.name || p.store_name, 
                price: formatPrice(p.price_value),
                price_value: Number(p.price_value) || 0, 
                url: p.url 
              };
            })
          );
        }
      }
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (status) => {
    const errs = {};
    if (!formData.name) errs.name = "Required";
    if (!formData.slug) errs.slug = "Required";
    // Price is now optional - calculated from store prices
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    const phoneData = prepareDataForSave(status);
    
    // Calculate lowest store price for price alert comparison
    const validPricesForCheck = storePrices.filter(p => (p.store_id || p.store_name) && p.price_value > 0);
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

      await supabase.from("phone_store_prices").delete().eq("phone_id", savedId);
      const validPrices = storePrices.filter((p) => (p.store_id || p.store_name) && p.price_value);
      if (validPrices.length > 0) {
        await supabase.from("phone_store_prices").insert(
          validPrices.map((p) => {
            const store = p.store_id ? getStoreById(p.store_id) : null;
            return { 
              phone_id: savedId, 
              store_id: p.store_id || null,
              store_name: store?.name || p.store_name, 
              price: formatPrice(p.price_value),
              price_value: Number(p.price_value) || 0, 
              url: p.url 
            };
          })
        );
      }

      // Check for price drop and send notifications (based on lowest store price)
      if (oldLowestPrice && newLowestPrice && newLowestPrice < oldLowestPrice && status === "published") {
        try {
          const notifyResponse = await fetch("/api/price-alert/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneId: savedId,
              newPrice: newLowestPrice,
              oldPrice: oldLowestPrice,
              phoneName: formData.name,
              phoneSlug: formData.slug,
              imageUrl: formData.image_url,
            }),
          });
          const notifyResult = await notifyResponse.json();
          if (notifyResult.notified > 0) {
            console.log(`Price drop notifications sent to ${notifyResult.notified} subscribers (${oldLowestPrice} → ${newLowestPrice})`);
          }
        } catch (notifyError) {
          console.error("Failed to send price drop notifications:", notifyError);
          // Don't block the save operation if notifications fail
        }
        // Update the reference so subsequent saves don't re-trigger
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

  return (
    <AdminLayoutWrapper user={user} title={isEdit ? `Edit: ${phone.name}` : "Add New Phone"}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-100 -mx-6 px-6 py-4 mb-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/phones" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-sm">
              {saving ? (
                <span className="flex items-center gap-1 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span>
              ) : hasUnsavedChanges ? (
                <span className="flex items-center gap-1 text-amber-600"><AlertCircle className="w-4 h-4" />Unsaved</span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1 text-emerald-600"><Check className="w-4 h-4" />Saved</span>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            {formData.slug && (
              <Link href={`/phones/${formData.slug}?preview=true`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <ExternalLink className="w-4 h-4" />Preview
              </Link>
            )}
            <button onClick={() => handleSave("draft")} disabled={saving} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <Save className="w-4 h-4" />Draft
            </button>
            <button onClick={() => handleSave("published")} disabled={saving} className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">
              <Check className="w-4 h-4" />Publish
            </button>
          </div>
        </div>
      </div>

      {/* Form sections in SAME ORDER as phone detail page */}
      <div className="space-y-4">

        {/* 0. Basic Info (Required) */}
        <SectionCard number="0" title="Basic Info" subtitle="Required fields">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <InputField label="Phone Name" value={formData.name} onChange={handleNameChange} placeholder="Samsung Galaxy A35 5G" required error={errors.name} />
            <InputField label="URL Slug" value={formData.slug} onChange={(v) => updateField("slug", v)} placeholder="samsung-galaxy-a35-5g" required error={errors.slug} />
            <InputField label="Display Price (AED)" value={formData.price} onChange={handlePriceChange} placeholder="Auto from store prices" type="number" disabled={true} hint="Auto-calculated from lowest store price" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
              <select value={formData.brand_id || ""} onChange={(e) => updateField("brand_id", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Select</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={formData.category} onChange={(e) => updateField("category", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-Range</option>
                <option value="flagship">Flagship</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <ImageUpload 
              label="Phone Image" 
              value={formData.image_url} 
              onChange={(v) => updateField("image_url", v)}
              bucket="phone-images"
            />
          </div>
        </SectionCard>

        {/* 1. Header Section */}
        <SectionCard number="1" title="Header Section" subtitle="Phone identity, score, trust signals, options">
          <div className="space-y-4 pt-4">
            <TextareaField label="Identity (Description below phone name)" value={formData.identity} onChange={(v) => updateField("identity", v)} placeholder="The Samsung Galaxy A35 5G is a popular mid-range smartphone..." rows={2} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Overall Score (0-10)" value={formData.overall_score_rating} onChange={(v) => updateField("overall_score_rating", v)} placeholder="8.1" type="number" hint="e.g., 8.1" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Score Label</label>
                <select value={formData.overall_score_label || ""} onChange={(e) => updateField("overall_score_label", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                </select>
              </div>
              <InputField label="Why Pick (Score summary)" value={formData.why_pick} onChange={(v) => updateField("why_pick", v)} placeholder="Perfect everyday phone at this price" />
            </div>

            {/* Trust Signals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trust Signals (4 badges below price)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.trust_signals.map((s, i) => (
                  <div key={i} className="flex gap-1">
                    <input type="text" value={s.icon} onChange={(e) => { const u = [...formData.trust_signals]; u[i] = { ...u[i], icon: e.target.value }; updateField("trust_signals", u); }} className="w-12 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm" placeholder="🔋" />
                    <input type="text" value={s.label} onChange={(e) => { const u = [...formData.trust_signals]; u[i] = { ...u[i], label: e.target.value }; updateField("trust_signals", u); }} className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm" placeholder="All-day battery" />
                  </div>
                ))}
              </div>
            </div>

            {/* Storage & Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Storage Options" value={formData.storage_options?.join(", ")} onChange={(v) => updateField("storage_options", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="128GB, 256GB" hint="Comma separated" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Color Options</label>
                <div className="space-y-1">
                  {formData.color_options.map((c, i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <input type="color" value={c.hex || "#000"} onChange={(e) => { const u = [...formData.color_options]; u[i] = { ...u[i], hex: e.target.value }; updateField("color_options", u); }} className="w-8 h-8 rounded border cursor-pointer" />
                      <input type="text" value={c.name || ""} onChange={(e) => { const u = [...formData.color_options]; u[i] = { ...u[i], name: e.target.value }; updateField("color_options", u); }} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Awesome Navy" />
                      <button type="button" onClick={() => updateField("color_options", formData.color_options.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => updateField("color_options", [...formData.color_options, { name: "", hex: "#000" }])} className="mt-1 text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 2. Quick Verdict */}
        <SectionCard number="2" title="Quick Verdict" subtitle="Should You Buy This Phone?">
          <div className="pt-4">
            <TextareaField label="Verdict" value={formData.verdict} onChange={(v) => updateField("verdict", v)} placeholder="Yes, if you want... No, if camera quality matters..." rows={2} hint="Start with 'Yes, if...' and 'No, if...'" />
          </div>
        </SectionCard>

        {/* 3. Store Prices */}
        <SectionCard number="3" title="Store Prices" subtitle="Where to Buy in UAE">
          <div className="pt-4 space-y-3">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2">
              <div className="col-span-3">Store</div>
              <div className="col-span-2">Price (AED)</div>
              <div className="col-span-2">Formatted</div>
              <div className="col-span-4">Buy Link</div>
              <div className="col-span-1"></div>
            </div>
            {storePrices.map((sp, i) => {
              const selectedStore = sp.store_id ? getStoreById(sp.store_id) : null;
              return (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg">
                  {/* Store Dropdown with Logo */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      {selectedStore?.logo_url && (
                        <img src={selectedStore.logo_url} alt={selectedStore.name} className="w-6 h-6 object-contain" />
                      )}
                      <select 
                        value={sp.store_id || ""} 
                        onChange={(e) => { 
                          const u = [...storePrices]; 
                          const store = stores.find(s => s.id === e.target.value);
                          u[i] = { 
                            ...u[i], 
                            store_id: e.target.value,
                            store_name: store?.name || "",
                            url: store?.website_url || u[i].url
                          }; 
                          setStorePrices(u); 
                          setHasUnsavedChanges(true); 
                        }} 
                        className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="">Select store...</option>
                        {stores.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Price Value - Single input */}
                  <input 
                    type="number" 
                    value={sp.price_value} 
                    onChange={(e) => { 
                      const u = [...storePrices]; 
                      u[i] = { ...u[i], price_value: e.target.value }; 
                      setStorePrices(u); 
                      setHasUnsavedChanges(true); 
                    }} 
                    className="col-span-2 px-2 py-2 border border-gray-300 rounded text-sm" 
                    placeholder="2159" 
                  />
                  {/* Auto-formatted price display */}
                  <div className="col-span-2 px-2 py-2 text-sm text-gray-600 bg-gray-100 rounded">
                    {formatPrice(sp.price_value) || "AED 0"}
                  </div>
                  {/* URL */}
                  <input 
                    type="text" 
                    value={sp.url || ""} 
                    onChange={(e) => { 
                      const u = [...storePrices]; 
                      u[i] = { ...u[i], url: e.target.value }; 
                      setStorePrices(u); 
                      setHasUnsavedChanges(true); 
                    }} 
                    className="col-span-4 px-2 py-2 border border-gray-300 rounded text-sm" 
                    placeholder="https://www.noon.com/product/..." 
                  />
                  {/* Delete */}
                  <button 
                    type="button" 
                    onClick={() => { setStorePrices(storePrices.filter((_, idx) => idx !== i)); setHasUnsavedChanges(true); }} 
                    className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            <button 
              type="button" 
              onClick={() => { 
                setStorePrices([...storePrices, { store_id: "", store_name: "", price_value: "", url: "" }]); 
                setHasUnsavedChanges(true); 
              }} 
              className="text-sm text-emerald-600 flex items-center gap-1 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />Add Store
            </button>
            {stores.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                💡 No stores found. Add stores in Settings → Stores tab first.
              </p>
            )}
          </div>
        </SectionCard>

        {/* 4. Buy/Skip */}
        <SectionCard number="4" title="Buy or Skip" subtitle="Is This Phone Right for You?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">✓ Good for you if</label>
              {formData.buy_reasons.map((r, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input type="text" value={r} onChange={(e) => { const u = [...formData.buy_reasons]; u[i] = e.target.value; updateField("buy_reasons", u); }} className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm" placeholder="All-day battery that lasts 1.5 days..." />
                  <button type="button" onClick={() => updateField("buy_reasons", formData.buy_reasons.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => updateField("buy_reasons", [...formData.buy_reasons, ""])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">✗ Avoid if</label>
              {formData.skip_reasons.map((r, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input type="text" value={r} onChange={(e) => { const u = [...formData.skip_reasons]; u[i] = e.target.value; updateField("skip_reasons", u); }} className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm" placeholder="Heavy games like Genshin will struggle..." />
                  <button type="button" onClick={() => updateField("skip_reasons", formData.skip_reasons.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => updateField("skip_reasons", [...formData.skip_reasons, ""])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
            </div>
          </div>
        </SectionCard>

        {/* 5. Scores */}
        <SectionCard number="5" title="Our Verdict Scores" subtitle="Rate 0-10, shows as 1-5 stars on frontend">
          <div className="pt-4">
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: "score_value", label: "Value 💰" },
                { key: "score_performance", label: "Daily Use 📱" },
                { key: "score_camera", label: "Camera 📸" },
                { key: "score_performance", label: "Gaming 🎮", hint: "(uses performance)" },
                { key: "score_battery", label: "Battery 🔋" },
              ].map((s, i) => (
                <div key={i}>
                  <label className="block text-xs text-gray-600 mb-1">{s.label}</label>
                  <input type="number" min="0" max="10" value={formData[s.key] || ""} onChange={(e) => updateField(s.key, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center" placeholder="8" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Score ÷ 2 = stars (e.g., 8 → 4 stars)</p>
          </div>
        </SectionCard>

        {/* 6. Key Differences */}
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

        {/* 7. Price Comparison */}
        <SectionCard number="7" title="How This Phone Compares" subtitle="Price comparison points">
          <div className="pt-4 space-y-2">
            {formData.price_comparison.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select value={c.type || "better"} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], type: e.target.value }; updateField("price_comparison", u); }} className="w-24 px-2 py-2 border rounded text-sm">
                  <option value="better">✓ Better</option>
                  <option value="average">○ Average</option>
                  <option value="worse">✗ Worse</option>
                </select>
                <input type="text" value={c.label || ""} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], label: e.target.value }; updateField("price_comparison", u); }} className="w-36 px-2 py-2 border rounded text-sm" placeholder="Better battery life" />
                <input type="text" value={c.text || ""} onChange={(e) => { const u = [...formData.price_comparison]; u[i] = { ...u[i], text: e.target.value }; updateField("price_comparison", u); }} className="flex-1 px-2 py-2 border rounded text-sm" placeholder="than most phones in this range" />
                <button type="button" onClick={() => updateField("price_comparison", formData.price_comparison.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => updateField("price_comparison", [...formData.price_comparison, { type: "better", label: "", text: "" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
          </div>
        </SectionCard>

        {/* 8. Final Recommendation */}
        <SectionCard number="8" title="Final Recommendation" subtitle="Decision closure">
          <div className="pt-4">
            <TextareaField label="Recommendation" value={formData.final_recommendation} onChange={(v) => updateField("final_recommendation", v)} placeholder="Buy the Samsung Galaxy A35 if your priority is battery life..." rows={2} />
          </div>
        </SectionCard>

        {/* 9. Alternatives */}
        <SectionCard number="9" title="Similar Phones to Consider" subtitle="Best alternatives">
          <div className="pt-4 space-y-2">
            {formData.alternatives.map((a, i) => (
              <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                <input type="text" value={a.name || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], name: e.target.value }; updateField("alternatives", u); }} className="w-40 px-2 py-2 border rounded text-sm" placeholder="Xiaomi Redmi Note 13 Pro" />
                <input type="text" value={a.slug || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], slug: e.target.value }; updateField("alternatives", u); }} className="w-40 px-2 py-2 border rounded text-sm" placeholder="xiaomi-redmi-note-13-pro" />
                <input type="text" value={a.reason || ""} onChange={(e) => { const u = [...formData.alternatives]; u[i] = { ...u[i], reason: e.target.value }; updateField("alternatives", u); }} className="flex-1 px-2 py-2 border rounded text-sm" placeholder="Better camera for AED 200 less" />
                <button type="button" onClick={() => updateField("alternatives", formData.alternatives.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => updateField("alternatives", [...formData.alternatives, { name: "", slug: "", reason: "", image: "/mobile1.jpg" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
          </div>
        </SectionCard>

        {/* 10. Specifications */}
        <SectionCard number="10" title="Specifications" subtitle="Full specs (JSON format)">
          <div className="pt-4 space-y-4">
            {/* GSMArena Scraper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                🔍 Auto-fill from GSMArena
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="gsmarena-url"
                  placeholder="https://www.gsmarena.com/apple_iphone_16-12920.php"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const urlInput = document.getElementById("gsmarena-url");
                    const url = urlInput?.value;
                    if (!url) {
                      alert("Please enter a GSMArena URL");
                      return;
                    }
                    
                    const btn = document.getElementById("scrape-btn");
                    btn.disabled = true;
                    btn.textContent = "Scraping...";
                    
                    try {
                      const response = await fetch("/api/scrape-specs", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url }),
                      });
                      
                      const result = await response.json();
                      
                      if (result.error) {
                        alert("Error: " + result.error);
                      } else if (result.specs) {
                        const formattedSpecs = JSON.stringify(result.specs, null, 2);
                        setSpecsText(formattedSpecs);
                        try {
                          updateField("specs", result.specs);
                        } catch {}
                        setHasUnsavedChanges(true);
                        alert("✅ Specs scraped successfully! Review and edit as needed.");
                      }
                    } catch (err) {
                      alert("Failed to scrape: " + err.message);
                    } finally {
                      btn.disabled = false;
                      btn.textContent = "Scrape Specs";
                    }
                  }}
                  id="scrape-btn"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Scrape Specs
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Paste the GSMArena phone URL and click "Scrape Specs" to auto-fill specifications
              </p>
            </div>

            {/* Manual JSON Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specifications JSON
              </label>
              <textarea 
                value={specsText} 
                onChange={(e) => { 
                  setSpecsText(e.target.value); 
                  setHasUnsavedChanges(true); 
                  try { updateField("specs", JSON.parse(e.target.value)); } catch {} 
                }} 
                rows={16} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs" 
                placeholder='{"Display": {"Size": "6.6 inches", "Type": "Super AMOLED"}, ...}' 
              />
              <p className="text-xs text-gray-500 mt-1">
                Use categories: Display, Performance, Camera, Battery, Network, Build, Software
              </p>
            </div>
          </div>
        </SectionCard>

        {/* 11. FAQs */}
        <SectionCard number="11" title="Common Questions" subtitle="FAQs">
          <div className="pt-4 space-y-3">
            {formData.faqs.map((f, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Q{i + 1}</span>
                  <button type="button" onClick={() => updateField("faqs", formData.faqs.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <input type="text" value={f.question || ""} onChange={(e) => { const u = [...formData.faqs]; u[i] = { ...u[i], question: e.target.value }; updateField("faqs", u); }} className="w-full px-2 py-2 border rounded text-sm mb-2" placeholder="Does it support UAE 5G networks?" />
                <textarea value={f.answer || ""} onChange={(e) => { const u = [...formData.faqs]; u[i] = { ...u[i], answer: e.target.value }; updateField("faqs", u); }} rows={2} className="w-full px-2 py-2 border rounded text-sm" placeholder="Yes, the Samsung Galaxy A35 5G supports..." />
              </div>
            ))}
            <button type="button" onClick={() => updateField("faqs", [...formData.faqs, { question: "", answer: "" }])} className="text-sm text-emerald-600 flex items-center gap-1"><Plus className="w-4 h-4" />Add FAQ</button>
          </div>
        </SectionCard>

        {/* 12. Related Links */}
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

      </div>
    </AdminLayoutWrapper>
  );
}
