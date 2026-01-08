"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, ExternalLink, Save, Loader2, Search, Sparkles, GitCompare } from "lucide-react";
import { 
  AdminLayoutWrapper,
  SectionCard,
  InputField,
  TextareaField,
  SelectField,
  ImageUpload
} from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/admin/phoneFormUtils";

/**
 * PhoneFormClient - Simplified phone editor
 * 
 * MVP Structure (mentor-recommended):
 * 0. Basic Info (name, brand, category, image)
 * 1. Header (identity, overall score, why pick)
 * 2. Should You Buy? (single buy_reason + skip_reason)
 * 3. Store Prices (affiliate links)
 * 4. Verdict Scores (5 metrics)
 * 5. Similar Phones (dropdown from database)
 * 6. Specifications (with GSMArena scrape)
 * 7. FAQs (template-based)
 * 
 * NO AUTO-SAVE - Single Save button at top
 */
export default function PhoneFormClient({ user, brands, stores = [], phone }) {
  const isEdit = !!phone;
  const router = useRouter();
  const supabase = createClient();

  // All phones for alternatives dropdown
  const [allPhones, setAllPhones] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);

  // Comparisons state - which comparisons to show on this phone's detail page
  const [phoneComparisons, setPhoneComparisons] = useState([]);
  const [loadingComparisons, setLoadingComparisons] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: phone?.name || "",
    slug: phone?.slug || "",
    brand_id: phone?.brand_id || "",
    category: phone?.category || "mid-range",
    image_url: phone?.image_url || "/mobile1.jpg",
    status: phone?.status || "draft",
    
    // Header
    identity: phone?.identity || "",
    overall_score_rating: phone?.overall_score_rating || "",
    overall_score_label: phone?.overall_score_label || "",
    why_pick: phone?.why_pick || "",
    
    // Should You Buy? (simplified - single reason each)
    buy_reason: phone?.buy_reason || "",
    skip_reason: phone?.skip_reason || "",
    
    // Verdict Scores (5 metrics, 0-10)
    score_design: phone?.score_design || "",
    score_performance: phone?.score_performance || "",
    score_camera: phone?.score_camera || "",
    score_connectivity: phone?.score_connectivity || "",
    score_battery: phone?.score_battery || "",
    
    // Hero section data
    trust_signals: phone?.trust_signals?.length
      ? phone.trust_signals
      : [{ icon: "⚡", label: "" }],
    storage_options: phone?.storage_options || [],
    color_options: phone?.color_options || [],
    
    // Alternatives
    alternatives: phone?.alternatives || [],
    
    // FAQs
    faqs: phone?.faqs || [],
    
    // Hidden/auto fields
    price: phone?.price || 0,
    price_range: phone?.price_range || "",
  });

  const [storePrices, setStorePrices] = useState(
    phone?.storePrices || [{ store_id: "", store_name: "", price_value: "", url: "" }]
  );

  // Helper to format price as AED X,XXX.XX (2 decimals)
  const formatPrice = (value) => {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return "";
    return `AED ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const [specsText, setSpecsText] = useState(
    typeof phone?.specs === "object" ? JSON.stringify(phone?.specs, null, 2) : "{}"
  );

  // Scraping state
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  // UI State
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all phones for alternatives dropdown
  useEffect(() => {
    const fetchPhones = async () => {
      const { data } = await supabase
        .from("phones")
        .select("id, name, slug, image_url, why_pick")
        .order("name");
      setAllPhones(data || []);
      setLoadingPhones(false);
    };
    fetchPhones();
  }, [supabase]);

  // Fetch existing comparisons for this phone (if editing)
  useEffect(() => {
    const fetchComparisons = async () => {
      if (!phone?.id) {
        setLoadingComparisons(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("featured_comparisons")
        .select(`
          id,
          phone1_id,
          phone2_id,
          title,
          show_on_homepage,
          phone1:phones!phone1_id(id, name, slug, image_url),
          phone2:phones!phone2_id(id, name, slug, image_url)
        `)
        .or(`phone1_id.eq.${phone.id},phone2_id.eq.${phone.id}`)
        .eq("is_active", true);
      
      if (!error && data) {
        setPhoneComparisons(data.map(c => ({
          id: c.id,
          phone1_id: c.phone1_id,
          phone2_id: c.phone2_id,
          title: c.title,
          showOnHomepage: c.show_on_homepage,
          otherPhone: c.phone1_id === phone.id ? c.phone2 : c.phone1,
        })));
      }
      setLoadingComparisons(false);
    };
    fetchComparisons();
  }, [supabase, phone?.id]);

  // Update field helper
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Auto-calculate overall score from verdict scores
  const calculateOverallScore = useCallback(() => {
    const scores = [
      formData.score_design,
      formData.score_performance,
      formData.score_camera,
      formData.score_connectivity,
      formData.score_battery,
    ].filter(s => s !== "" && s !== null && s !== undefined).map(Number);
    
    if (scores.length === 0) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg * 10) / 10; // Round to 1 decimal
  }, [formData.score_design, formData.score_performance, formData.score_camera, formData.score_connectivity, formData.score_battery]);

  // Get score label based on overall score
  const getScoreLabelFromScore = (score) => {
    if (score === null || score === undefined) return "";
    if (score >= 9.0) return "Flagship";
    if (score >= 8.5) return "Excellent";
    if (score >= 8.0) return "Very Good";
    if (score >= 7.0) return "Good";
    if (score >= 6.0) return "Average";
    return "Below Average";
  };

  // Score label options
  const scoreLabelOptions = [
    { value: "", label: "Auto-select based on score" },
    { value: "Flagship", label: "Flagship (9.0+)" },
    { value: "Excellent", label: "Excellent (8.5+)" },
    { value: "Very Good", label: "Very Good (8.0+)" },
    { value: "Good", label: "Good (7.0+)" },
    { value: "Average", label: "Average (6.0+)" },
    { value: "Below Average", label: "Below Average (<6.0)" },
  ];

  // Why Pick options (common selling points)
  const whyPickOptions = [
    { value: "", label: "Select a reason..." },
    { value: "Best camera under AED 2000", label: "Best camera under AED 2000" },
    { value: "Best camera under AED 3000", label: "Best camera under AED 3000" },
    { value: "Best camera under AED 4000", label: "Best camera under AED 4000" },
    { value: "Best budget phone in UAE", label: "Best budget phone in UAE" },
    { value: "Best mid-range phone in UAE", label: "Best mid-range phone in UAE" },
    { value: "Best flagship value in UAE", label: "Best flagship value in UAE" },
    { value: "Best iPhone value with flagship camera", label: "Best iPhone value with flagship camera" },
    { value: "Best Samsung for the price", label: "Best Samsung for the price" },
    { value: "Best battery life in its class", label: "Best battery life in its class" },
    { value: "Best gaming phone under AED 3000", label: "Best gaming phone under AED 3000" },
    { value: "Best compact flagship phone", label: "Best compact flagship phone" },
    { value: "Best big-screen phone for media", label: "Best big-screen phone for media" },
    { value: "Best 5G phone under AED 1500", label: "Best 5G phone under AED 1500" },
    { value: "Best all-rounder for everyday use", label: "Best all-rounder for everyday use" },
  ];

  // Auto-update overall score and label when verdict scores change
  useEffect(() => {
    const calculatedScore = calculateOverallScore();
    if (calculatedScore !== null) {
      const newLabel = getScoreLabelFromScore(calculatedScore);
      setFormData(prev => ({
        ...prev,
        overall_score_rating: calculatedScore,
        overall_score_label: newLabel, // Always update label to match score
      }));
    }
  }, [calculateOverallScore]);

  // Handle name change (auto-generates slug)
  const handleNameChange = (name) => {
    updateField("name", name);
    if (!isEdit || !formData.slug) {
      updateField("slug", generateSlug(name));
    }
  };

  // Calculate lowest price from store prices
  const calculateLowestPrice = () => {
    const activePrices = storePrices.filter(sp => sp.price_value && Number(sp.price_value) > 0);
    if (activePrices.length > 0) {
      return Math.min(...activePrices.map(sp => Number(sp.price_value)));
    }
    return 0;
  };

  // Save store prices
  const saveStorePrices = async (phoneId) => {
    await supabase.from("phone_store_prices").delete().eq("phone_id", phoneId);
    const validPrices = storePrices.filter((p) => p.store_name && p.price_value);
    if (validPrices.length > 0) {
      await supabase.from("phone_store_prices").insert(
        validPrices.map((p) => {
          // Find store_id from stores array
          const store = stores.find(s => s.name === p.store_name);
          return { 
            phone_id: phoneId, 
            store_id: store?.id || null,
            store_name: p.store_name, 
            price: formatPrice(p.price_value),  // Auto-format price
            price_value: Number(p.price_value) || 0, 
            url: p.url 
          };
        })
      );
    }
  };

  // Parse specs JSON safely
  const parseSpecs = () => {
    try { 
      return JSON.parse(specsText); 
    } catch { 
      return {}; 
    }
  };

  // Scrape specs from GSMArena
  const handleScrapeSpecs = async () => {
    if (!scrapeUrl) {
      alert("Please enter a GSMArena URL");
      return;
    }
    
    setScraping(true);
    try {
      const response = await fetch("/api/scrape-specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });

      const result = await response.json();
      console.log("Scrape result:", result);

      if (result.error) {
        alert("Error: " + result.error);
      } else if (result.specs && Object.keys(result.specs).length > 0) {
        const formattedSpecs = JSON.stringify(result.specs, null, 2);
        console.log("Setting specs:", formattedSpecs);
        setSpecsText(formattedSpecs);
        alert("✅ Specs scraped successfully! Review and edit as needed.");
      } else {
        alert("⚠️ No specs found. The page structure may have changed or the phone doesn't exist on GSMArena.");
      }
    } catch (err) {
      console.error("Scrape error:", err);
      alert("Failed to scrape: " + err.message);
    } finally {
      setScraping(false);
    }
  };

  // Add alternative from dropdown
  const addAlternative = (phoneId) => {
    const selectedPhone = allPhones.find(p => p.id === phoneId);
    if (selectedPhone && !formData.alternatives.some(a => a.slug === selectedPhone.slug)) {
      updateField("alternatives", [
        ...formData.alternatives,
        { 
          name: selectedPhone.name, 
          slug: selectedPhone.slug, 
          reason: selectedPhone.why_pick || "",  // Auto-fill from Why Pick
          image: selectedPhone.image_url || "/mobile1.jpg"
        }
      ]);
    }
  };

  // Remove a comparison from this phone's detail page
  const removeComparison = async (comparisonId) => {
    if (!confirm("Remove this comparison from this phone's detail page?")) return;
    
    const { error } = await supabase
      .from("featured_comparisons")
      .delete()
      .eq("id", comparisonId);
    
    if (error) {
      alert("Failed to remove comparison: " + error.message);
    } else {
      setPhoneComparisons(prev => prev.filter(c => c.id !== comparisonId));
    }
  };

  // Add new comparison for this phone
  const addComparison = async (otherPhoneId) => {
    if (!phone?.id || !otherPhoneId) return;
    
    // Check if comparison already exists
    const existingComparison = phoneComparisons.find(
      c => c.otherPhone?.id === otherPhoneId
    );
    if (existingComparison) {
      alert("This comparison already exists!");
      return;
    }
    
    const { data, error } = await supabase
      .from("featured_comparisons")
      .insert({
        phone1_id: phone.id,
        phone2_id: otherPhoneId,
        is_active: true,
        show_on_homepage: false,
      })
      .select(`
        id,
        phone1_id,
        phone2_id,
        title,
        show_on_homepage,
        phone1:phones!phone1_id(id, name, slug, image_url),
        phone2:phones!phone2_id(id, name, slug, image_url)
      `)
      .single();
    
    if (error) {
      // Handle unique constraint violation (comparison might exist in reverse order)
      if (error.code === "23505") {
        alert("This comparison already exists (possibly in reverse order).");
      } else {
        alert("Failed to add comparison: " + error.message);
      }
    } else if (data) {
      setPhoneComparisons(prev => [...prev, {
        id: data.id,
        phone1_id: data.phone1_id,
        phone2_id: data.phone2_id,
        title: data.title,
        showOnHomepage: data.show_on_homepage,
        otherPhone: data.phone1_id === phone.id ? data.phone2 : data.phone1,
      }]);
    }
  };

  // Main save function
  const handleSave = async (status) => {
    // Validation
    const errs = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.slug) errs.slug = "Slug is required";
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }

    setSaving(true);
    
    const lowestPrice = calculateLowestPrice();
    
    // Store old price for price drop detection
    const oldPrice = phone?.price || phone?.last_price || null;
    
    const phoneData = {
      slug: formData.slug,
      name: formData.name,
      brand_id: formData.brand_id || null,
      category: formData.category,
      image_url: formData.image_url,
      price: lowestPrice,
      price_range: lowestPrice ? `AED ${lowestPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "",
      
      // Header
      identity: formData.identity,
      overall_score_rating: formData.overall_score_rating 
        ? parseFloat(Number(formData.overall_score_rating).toFixed(1)) 
        : null,
      overall_score_label: formData.overall_score_label,
      why_pick: formData.why_pick,
      
      // Should You Buy (simplified)
      buy_reason: formData.buy_reason,
      skip_reason: formData.skip_reason,
      
      // Verdict Scores (5 metrics) - allow decimals like 6.9, 7.5
      score_design: formData.score_design ? Number(formData.score_design) : null,
      score_performance: formData.score_performance ? Number(formData.score_performance) : null,
      score_camera: formData.score_camera ? Number(formData.score_camera) : null,
      score_connectivity: formData.score_connectivity ? Number(formData.score_connectivity) : null,
      score_battery: formData.score_battery ? Number(formData.score_battery) : null,
      
      // Hero section data
      trust_signals: formData.trust_signals.filter((s) => s.label),
      storage_options: formData.storage_options || [],
      color_options: formData.color_options.filter((c) => c.name),
      
      // Alternatives & FAQs
      alternatives: formData.alternatives.filter((a) => a.name),
      faqs: formData.faqs.filter((f) => f.question),
      specs: parseSpecs(),
      
      // Status
      status: status,
      published_at: status === "published" && !phone?.published_at 
        ? new Date().toISOString() 
        : phone?.published_at,
    };

    try {
      let savedId = phone?.id;
      
      if (savedId) {
        // Update existing
        const { error } = await supabase.from("phones").update(phoneData).eq("id", savedId);
        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase.from("phones").insert(phoneData).select("id").single();
        if (error) throw error;
        savedId = data.id;
      }

      await saveStorePrices(savedId);

      // Check for price drop and send notifications
      if (lowestPrice > 0 && oldPrice && lowestPrice < oldPrice) {
        try {
          const notifyResponse = await fetch("/api/price-alert/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneId: savedId,
              newPrice: lowestPrice,
              oldPrice: oldPrice,
              phoneName: formData.name,
              phoneSlug: formData.slug,
              imageUrl: formData.image_url,
            }),
          });
          const notifyResult = await notifyResponse.json();
          if (notifyResult.notified > 0) {
            console.log(`✅ Price drop alert sent to ${notifyResult.notified} subscribers`);
          }
        } catch (notifyError) {
          console.error("Price alert notification failed:", notifyError);
          // Don't block save on notification failure
        }
      }

      // Only redirect on publish, stay on page for draft
      if (status === "published") {
        router.push("/admin/phones");
        router.refresh();
      } else {
        // For draft: refresh data and show success message
        router.refresh();
        alert("Draft saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter phones for dropdown (exclude current phone)
  const availablePhones = allPhones.filter(p => p.id !== phone?.id);

  return (
    <AdminLayoutWrapper user={user} title={isEdit ? `Edit: ${phone.name}` : "Add New Phone"}>
      {/* Sticky Header with Save Button */}
      <div className="sticky top-0 z-10 bg-gray-100 -mx-6 px-6 py-4 mb-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/phones" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm text-gray-500">
              {isEdit ? "Editing phone" : "New phone"}
            </span>
          </div>
          
          <div className="flex gap-2">
            {formData.slug && (
              <Link 
                href={`/phones/${formData.slug}?preview=true`} 
                target="_blank" 
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                Preview
              </Link>
            )}
            
            <button 
              onClick={() => handleSave("draft")} 
              disabled={saving} 
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            
            <button 
              onClick={() => handleSave("published")} 
              disabled={saving} 
              className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Section 0: Basic Info */}
        <SectionCard number="0" title="Basic Info" subtitle="Name, brand, category">
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Phone Name *" 
                value={formData.name} 
                onChange={handleNameChange}
                error={errors.name}
                placeholder="iPhone 16 Pro Max"
              />
              <InputField 
                label="URL Slug *" 
                value={formData.slug} 
                onChange={(v) => updateField("slug", v)}
                error={errors.slug}
                placeholder="iphone-16-pro-max"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField 
                label="Brand" 
                value={formData.brand_id} 
                onChange={(v) => updateField("brand_id", v)}
                options={[
                  { value: "", label: "Select brand" },
                  ...brands.map(b => ({ value: b.id, label: b.name }))
                ]}
              />
              <SelectField 
                label="Category" 
                value={formData.category} 
                onChange={(v) => updateField("category", v)}
                options={[
                  { value: "budget", label: "Budget" },
                  { value: "mid-range", label: "Mid-Range" },
                  { value: "flagship", label: "Flagship" },
                  { value: "premium", label: "Premium" },
                ]}
              />
            </div>
            <ImageUpload 
              label="Phone Image"
              value={formData.image_url}
              onChange={(v) => updateField("image_url", v)}
              folder="phones"
            />
          </div>
        </SectionCard>

        {/* Section 1: Header */}
        <SectionCard number="1" title="Header" subtitle="Score and identity">
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Overall Score (0-10)
                </label>
                <input
                  type="text"
                  value={formData.overall_score_rating || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                  title="Auto-calculated from verdict scores"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated from verdict scores</p>
              </div>
              <SelectField 
                label="Score Label" 
                value={formData.overall_score_label} 
                onChange={(v) => {
                  // If empty, auto-select based on score
                  if (!v && formData.overall_score_rating) {
                    updateField("overall_score_label", getScoreLabelFromScore(formData.overall_score_rating));
                  } else {
                    updateField("overall_score_label", v);
                  }
                }}
                options={scoreLabelOptions}
              />
              <SelectField 
                label="Why Pick" 
                value={formData.why_pick} 
                onChange={(v) => updateField("why_pick", v)}
                options={whyPickOptions}
              />
            </div>
            <TextareaField 
              label="Identity" 
              value={formData.identity} 
              onChange={(v) => updateField("identity", v)}
              placeholder="A flagship phone with exceptional camera capabilities..."
              rows={2}
            />

            {/* Trust Signals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trust Signals (badges shown in hero)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    updateField("trust_signals", [
                      ...formData.trust_signals,
                      { icon: "✨", label: "" }
                    ]);
                  }}
                  className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Signal
                </button>
              </div>
              <div className="space-y-2">
                {formData.trust_signals.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={s.icon || ""}
                      onChange={(e) => {
                        const u = [...formData.trust_signals];
                        u[i] = { ...u[i], icon: e.target.value };
                        updateField("trust_signals", u);
                      }}
                      className="w-12 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm"
                      placeholder="⚡"
                    />
                    <input
                      type="text"
                      value={s.label || ""}
                      onChange={(e) => {
                        const u = [...formData.trust_signals];
                        u[i] = { ...u[i], label: e.target.value };
                        updateField("trust_signals", u);
                      }}
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Fast performance"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateField("trust_signals", formData.trust_signals.filter((_, idx) => idx !== i));
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove signal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {formData.trust_signals.length === 0 && (
                <p className="text-sm text-gray-500 py-2">No trust signals. Click "Add Signal" to add one.</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Example: ⚡ Fast performance, 📸 Pro-grade cameras</p>
            </div>

            {/* Storage & Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Storage Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Storage Options
                </label>
                <input
                  type="text"
                  value={(formData.storage_options || []).join(", ")}
                  onChange={(e) => {
                    const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                    updateField("storage_options", arr);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="128GB, 256GB, 512GB, 1TB"
                />
                <p className="text-xs text-gray-500 mt-1">Comma separated</p>
              </div>

              {/* Color Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Color Options
                </label>
                <div className="space-y-1.5">
                  {formData.color_options.map((c, i) => (
                    <div key={i} className="flex gap-1.5 items-center">
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: c.hex || "#ccc" }}
                      />
                      <input
                        type="text"
                        value={c.hex || ""}
                        onChange={(e) => {
                          const u = [...formData.color_options];
                          u[i] = { ...u[i], hex: e.target.value };
                          updateField("color_options", u);
                        }}
                        className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="#FF6B00"
                      />
                      <input
                        type="text"
                        value={c.name || ""}
                        onChange={(e) => {
                          const u = [...formData.color_options];
                          u[i] = { ...u[i], name: e.target.value };
                          updateField("color_options", u);
                        }}
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Cosmic Orange"
                      />
                      <button
                        type="button"
                        onClick={() => updateField("color_options", formData.color_options.filter((_, idx) => idx !== i))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updateField("color_options", [...formData.color_options, { name: "", hex: "" }])}
                  className="mt-1.5 text-sm text-emerald-600 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  Add Color
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Should You Buy? (SIMPLIFIED) */}
        <SectionCard number="2" title="Should You Buy?" subtitle="2 bullets only - Yes if / No if">
          <div className="pt-4 space-y-4">
            <InputField 
              label="Yes, if you want..." 
              value={formData.buy_reason} 
              onChange={(v) => updateField("buy_reason", v)}
              placeholder="smooth everyday performance with long software support"
              hint="One reason only. Don't repeat yourself."
            />
            <InputField 
              label="No, if you want..." 
              value={formData.skip_reason} 
              onChange={(v) => updateField("skip_reason", v)}
              placeholder="a 120Hz display or telephoto camera"
              hint="One reason only. Be direct."
            />
          </div>
        </SectionCard>

        {/* Section 3: Store Prices */}
        <SectionCard number="3" title="Where to Buy" subtitle="Affiliate links (💰 money section)">
          <div className="pt-4 space-y-3">
            {storePrices.map((sp, i) => (
              <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                {/* Store Dropdown */}
                <select
                  value={sp.store_name}
                  onChange={(e) => {
                    const selectedStore = stores.find(s => s.name === e.target.value);
                    const u = [...storePrices]; 
                    u[i] = { 
                      ...u[i], 
                      store_name: e.target.value,
                      store_logo: selectedStore?.logo_url || "",
                    }; 
                    setStorePrices(u);
                  }}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Select Store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {/* Store Logo Preview */}
                {sp.store_name && stores.find(s => s.name === sp.store_name)?.logo_url && (
                  <img 
                    src={stores.find(s => s.name === sp.store_name)?.logo_url} 
                    alt={sp.store_name}
                    className="w-8 h-8 object-contain rounded"
                  />
                )}
                <input 
                  type="number" 
                  value={sp.price_value} 
                  onChange={(e) => {
                    const u = [...storePrices]; 
                    u[i] = { ...u[i], price_value: e.target.value }; 
                    setStorePrices(u);
                  }}
                  className="w-28 px-3 py-2 border rounded-lg text-sm"
                  placeholder="1199"
                />
                {/* Auto-formatted price display */}
                <div className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm min-w-24">
                  {formatPrice(sp.price_value) || "AED 0"}
                </div>
                <input 
                  type="url" 
                  value={sp.url} 
                  onChange={(e) => {
                    const u = [...storePrices]; 
                    u[i] = { ...u[i], url: e.target.value }; 
                    setStorePrices(u);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://amazon.ae/..."
                />
                <button 
                  type="button" 
                  onClick={() => setStorePrices(storePrices.filter((_, idx) => idx !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setStorePrices([...storePrices, { store_id: "", store_name: "", price_value: "", url: "" }])}
              className="text-sm text-emerald-600 flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Store
            </button>
            {stores.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ No stores configured. <Link href="/admin/settings" className="underline">Add stores in Settings</Link>
              </p>
            )}
          </div>
        </SectionCard>

        {/* Section 4: Verdict Scores (5 METRICS) */}
        <SectionCard number="4" title="Verdict Scores" subtitle="5 metrics only (0-10 scale)">
          <div className="pt-4">
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: "score_design", label: "Design & Materials 📱" },
                { key: "score_performance", label: "Performance 🚀" },
                { key: "score_camera", label: "Camera 📸" },
                { key: "score_connectivity", label: "Connectivity 📶" },
                { key: "score_battery", label: "Battery 🔋" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-600 mb-1">{field.label}</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={formData[field.key] || ""} 
                    onChange={(e) => updateField(field.key, e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center" 
                    placeholder="8.0" 
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tip: Be consistent across phones. 8+ = great, 6-7 = average, &lt;6 = weak
            </p>
          </div>
        </SectionCard>

        {/* Section 5: Similar Phones (DROPDOWN) */}
        <SectionCard number="5" title="Similar Phones" subtitle="Select from database">
          <div className="pt-4 space-y-3">
            {/* Dropdown to add phones */}
            <div className="flex gap-2 items-center">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addAlternative(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled={loadingPhones}
              >
                <option value="">
                  {loadingPhones ? "Loading phones..." : "Select a phone to add..."}
                </option>
                {availablePhones.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Selected alternatives */}
            {formData.alternatives.length > 0 && (
              <div className="space-y-2">
                {formData.alternatives.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 w-48 truncate">
                      {a.name}
                    </span>
                    <input 
                      type="text" 
                      value={a.reason || ""} 
                      onChange={(e) => { 
                        const u = [...formData.alternatives]; 
                        u[i] = { ...u[i], reason: e.target.value }; 
                        updateField("alternatives", u); 
                      }} 
                      className="flex-1 px-3 py-2 border rounded-lg text-sm" 
                      placeholder="Why is this a good alternative?" 
                    />
                    <button 
                      type="button" 
                      onClick={() => updateField("alternatives", formData.alternatives.filter((_, idx) => idx !== i))} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.alternatives.length === 0 && (
              <p className="text-sm text-gray-500 py-2">
                No alternatives added yet. Use the dropdown above to add similar phones.
              </p>
            )}
          </div>
        </SectionCard>

        {/* Section 6: Compare With (control which comparisons show on detail page) */}
        {isEdit && (
          <SectionCard number="6" title="Compare With" subtitle="Control comparisons on detail page">
            <div className="pt-4 space-y-3">
              {/* Info banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  <GitCompare className="w-4 h-4 inline mr-1" />
                  These comparisons appear in the "Compare" section on this phone's detail page.
                  Add or remove to control what users see.
                </p>
              </div>

              {/* Dropdown to add comparison */}
              <div className="flex gap-2 items-center">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addComparison(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={loadingPhones}
                >
                  <option value="">
                    {loadingPhones ? "Loading phones..." : "Add comparison with..."}
                  </option>
                  {allPhones
                    .filter(p => p.id !== phone?.id && !phoneComparisons.some(c => c.otherPhone?.id === p.id))
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))
                  }
                </select>
              </div>

              {/* Current comparisons */}
              {loadingComparisons ? (
                <div className="flex items-center gap-2 py-4 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading comparisons...</span>
                </div>
              ) : phoneComparisons.length > 0 ? (
                <div className="space-y-2">
                  {phoneComparisons.map((comp) => (
                    <div key={comp.id} className="flex gap-2 items-center bg-purple-50 p-3 rounded-lg">
                      <GitCompare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                        vs {comp.otherPhone?.name || "Unknown Phone"}
                      </span>
                      {comp.showOnHomepage && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Homepage
                        </span>
                      )}
                      <button 
                        type="button" 
                        onClick={() => removeComparison(comp.id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Remove comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">
                  No comparisons yet. Add phones to compare against above.
                </p>
              )}

              <p className="text-xs text-gray-500">
                💡 To feature comparisons on homepage, use the <Link href="/admin/comparisons" className="text-purple-600 hover:underline">Comparisons</Link> page.
              </p>
            </div>
          </SectionCard>
        )}

        {/* Section 7: Specifications (with GSMArena scrape) */}
        <SectionCard number="7" title="Specifications" subtitle="Scrape from GSMArena or edit JSON">
          <div className="pt-4 space-y-4">
            {/* GSMArena Scraper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Auto-fill from GSMArena
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://www.gsmarena.com/apple_iphone_16-12920.php"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleScrapeSpecs}
                  disabled={scraping}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {scraping ? "Scraping..." : "Scrape"}
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Paste the GSMArena phone URL and click "Scrape" to auto-fill specifications
              </p>
            </div>

            {/* Manual JSON Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specifications JSON
              </label>
              <textarea
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder='{"Display": {"Size": "6.7 inch", "Type": "AMOLED"}, ...}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Categories: Display, Performance, Camera, Battery, Build, Network, Software
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Section 7: FAQs (Template-based) */}
        <SectionCard number="8" title="FAQs" subtitle="Auto-generated + add custom">
          <div className="pt-4 space-y-3">
            {/* Auto-generate button */}
            {formData.faqs.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  const phoneName = formData.name || "This phone";
                  const lowestPrice = calculateLowestPrice();
                  const priceStr = lowestPrice ? `AED ${lowestPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "competitive price";
                  
                  const autoFaqs = [
                    {
                      question: `What is the price of ${phoneName} in UAE?`,
                      answer: `The ${phoneName} is available in UAE starting from ${priceStr}. Prices may vary across different retailers like Amazon.ae, Noon, and Sharaf DG.`
                    },
                    {
                      question: `Does ${phoneName} support UAE 5G networks?`,
                      answer: `Yes, the ${phoneName} supports 5G connectivity and is compatible with major UAE carriers including Etisalat and du. Please verify specific band compatibility with your carrier.`
                    },
                    {
                      question: `Is ${phoneName} worth buying in 2026?`,
                      answer: formData.buy_reason 
                        ? `Yes, if ${formData.buy_reason.toLowerCase()}. However, ${formData.skip_reason ? `skip if ${formData.skip_reason.toLowerCase()}` : 'consider your specific needs before purchasing'}.`
                        : `The ${phoneName} offers great value with its features. Check our detailed review above to see if it fits your needs.`
                    },
                  ];
                  updateField("faqs", autoFaqs);
                }}
                className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Auto-Generate 3 FAQs from Phone Data
              </button>
            )}

            {formData.faqs.map((f, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Q{i + 1}</span>
                  <button 
                    type="button" 
                    onClick={() => updateField("faqs", formData.faqs.filter((_, idx) => idx !== i))} 
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={f.question || ""} 
                  onChange={(e) => { 
                    const u = [...formData.faqs]; 
                    u[i] = { ...u[i], question: e.target.value }; 
                    updateField("faqs", u); 
                  }} 
                  className="w-full px-2 py-2 border rounded text-sm mb-2" 
                  placeholder="Does it support UAE 5G networks?" 
                />
                <textarea 
                  value={f.answer || ""} 
                  onChange={(e) => { 
                    const u = [...formData.faqs]; 
                    u[i] = { ...u[i], answer: e.target.value }; 
                    updateField("faqs", u); 
                  }} 
                  rows={2} 
                  className="w-full px-2 py-2 border rounded text-sm" 
                  placeholder="Yes, the phone supports all UAE 5G bands..." 
                />
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => updateField("faqs", [...formData.faqs, { question: "", answer: "" }])} 
              className="text-sm text-emerald-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />Add FAQ
            </button>
            {formData.faqs.length > 0 && (
              <p className="text-xs text-gray-500">
                Tip: Edit the auto-generated FAQs or add more as needed.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </AdminLayoutWrapper>
  );
}
