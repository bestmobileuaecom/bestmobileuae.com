/**
 * Phone Form Utilities
 * Helper functions for phone admin form
 */

/**
 * Generate URL slug from phone name
 */
export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Calculate lowest price from store prices array
 */
export function getLowestStorePrice(prices) {
  const activePrices = prices?.filter(p => p.price_value > 0) || [];
  return activePrices.length > 0 
    ? Math.min(...activePrices.map(p => Number(p.price_value))) 
    : null;
}

/**
 * Clean array by removing empty items
 */
export function cleanArray(arr) {
  return arr?.filter((item) => {
    if (typeof item === "string") return item.trim();
    if (typeof item === "object") return Object.values(item).some((v) => v);
    return false;
  }) || [];
}

/**
 * Prepare phone data for database save
 */
export function preparePhoneData(formData, specsText, status, existingPhone) {
  let parsedSpecs = {};
  try { 
    parsedSpecs = JSON.parse(specsText); 
  } catch { 
    parsedSpecs = formData.specs; 
  }

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
    overall_score_rating: formData.overall_score_rating 
      ? parseFloat(Number(formData.overall_score_rating).toFixed(1)) 
      : null,
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
    published_at: status === "published" && !existingPhone?.published_at 
      ? new Date().toISOString() 
      : existingPhone?.published_at,
  };
}

/**
 * Get initial form state from existing phone or defaults
 */
export function getInitialFormState(phone) {
  return {
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

    // Section 4: Buy/Skip
    buy_reasons: phone?.buy_reasons?.length ? phone.buy_reasons : ["", "", ""],
    skip_reasons: phone?.skip_reasons?.length ? phone.skip_reasons : ["", "", ""],

    // Section 5: Score Strip
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
  };
}
