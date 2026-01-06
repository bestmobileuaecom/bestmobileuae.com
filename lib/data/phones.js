import { createClient } from "@/lib/supabase/server";

/**
 * Fetch all published phones for listing
 */
export async function getPublishedPhones(options = {}) {
  const supabase = await createClient();
  const { category, brand, minPrice, maxPrice, sortBy = "created_at" } = options;

  let query = supabase
    .from("phones")
    .select(`
      id,
      slug,
      name,
      brand_id,
      image_url,
      price,
      price_range,
      category,
      badge,
      badge_color,
      why_pick,
      verdict,
      overall_score_rating,
      overall_score_label,
      score_camera,
      score_battery,
      score_performance,
      score_display,
      score_value,
      highlights,
      pros,
      cons,
      tags,
      specs,
      best_for,
      brands (
        name,
        slug
      ),
      phone_store_prices (
        price_value,
        is_active
      )
    `)
    .eq("status", "published");

  // Apply filters
  if (category) {
    query = query.eq("category", category);
  }
  if (brand) {
    query = query.eq("brands.slug", brand);
  }
  if (minPrice) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice) {
    query = query.lte("price", maxPrice);
  }

  // Apply sorting
  if (sortBy === "price_low") {
    query = query.order("price", { ascending: true });
  } else if (sortBy === "price_high") {
    query = query.order("price", { ascending: false });
  } else if (sortBy === "score") {
    query = query.order("overall_score_rating", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching phones:", error);
    return [];
  }

  // Transform data to match existing frontend format
  return data.map((phone) => {
    // Calculate lowest price from store prices
    const activeStorePrices = phone.phone_store_prices?.filter(sp => sp.is_active && sp.price_value > 0) || [];
    const lowestPrice = activeStorePrices.length > 0
      ? Math.min(...activeStorePrices.map(sp => sp.price_value))
      : phone.price;
    const priceRange = lowestPrice
      ? `AED ${lowestPrice.toLocaleString()}`
      : phone.price_range || "Check retailers";

    return {
      id: phone.id,
      slug: phone.slug,
      name: phone.name,
      brand: phone.brands?.name || "",
      image: phone.image_url,
      price: lowestPrice,
      priceRange: priceRange,
      category: phone.category,
      badge: phone.badge,
      badgeColor: phone.badge_color,
      whyPick: phone.why_pick,
      verdict: phone.verdict,
      overallScore: {
        rating: phone.overall_score_rating,
        label: phone.overall_score_label,
      },
      scores: {
        camera: phone.score_camera,
        battery: phone.score_battery,
        performance: phone.score_performance,
        display: phone.score_display,
        value: phone.score_value,
      },
      highlights: phone.highlights || [],
      pros: phone.pros || [],
      cons: phone.cons || [],
      tags: phone.tags || [],
      specs: phone.specs || {},
      bestFor: phone.best_for || [],
    };
  });
}

/**
 * Fetch a single phone by slug (for detail page)
 */
export async function getPhoneBySlug(slug, includePreview = false) {
  const supabase = await createClient();

  let query = supabase
    .from("phones")
    .select(`
      *,
      brands (
        name,
        slug
      )
    `)
    .eq("slug", slug);

  // Include preview content or only published
  if (includePreview) {
    query = query.in("status", ["published", "preview"]);
  } else {
    query = query.eq("status", "published");
  }

  const { data: phone, error } = await query.single();

  if (error || !phone) {
    return null;
  }

  // Fetch store prices
  const { data: storePrices } = await supabase
    .from("phone_store_prices")
    .select("*")
    .eq("phone_id", phone.id)
    .eq("is_active", true)
    .order("price_value");

  // Calculate lowest price from store prices
  const lowestPrice = storePrices?.length > 0 
    ? Math.min(...storePrices.map(sp => sp.price_value).filter(p => p > 0))
    : null;
  const priceRange = lowestPrice 
    ? `AED ${lowestPrice.toLocaleString()}`
    : phone.price_range || "Check retailers";

  // Transform to match existing frontend format
  return {
    id: phone.id,
    slug: phone.slug,
    name: phone.name,
    brand: phone.brands?.name || "",
    image: phone.image_url,
    priceRange: priceRange,
    price: lowestPrice || phone.price, // For price alert comparisons
    storageOptions: phone.storage_options || [],
    colorOptions: phone.color_options || [],
    overallScore: {
      rating: phone.overall_score_rating,
      outOf: 10,
      label: phone.overall_score_label,
      summary: phone.why_pick,
    },
    identity: phone.identity,
    trustSignals: phone.trust_signals || [],
    storePrices: storePrices?.map((sp) => ({
      store: sp.store_name,
      price: sp.price,
      region: sp.region,
    })) || [],
    verdict: phone.verdict,
    // Auto-calculate 1-5 scores from 0-10 scores (divide by 2)
    scores: [
      { label: "Value", icon: "💰", rating: Math.round((phone.score_value || 0) / 2) },
      { label: "Daily Use", icon: "📱", rating: Math.round((phone.score_performance || 0) / 2) },
      { label: "Camera", icon: "📸", rating: Math.round((phone.score_camera || 0) / 2) },
      { label: "Gaming", icon: "🎮", rating: Math.round((phone.score_performance || 0) / 2) },
      { label: "Battery", icon: "🔋", rating: Math.round((phone.score_battery || 0) / 2) },
    ],
    priceComparison: phone.price_comparison || [],
    buyReasons: phone.buy_reasons || [],
    skipReasons: phone.skip_reasons || [],
    keyDifferences: phone.key_differences || [],
    finalRecommendation: phone.final_recommendation,
    relatedLinks: phone.related_links || [],
    alternatives: phone.alternatives || [],
    // Pass specs as-is - QuickSpecs component now handles extracting values
    specs: phone.specs || {},
    faqs: phone.faqs || [],
  };
}

/**
 * Fetch phones for comparison
 */
export async function getPhonesForComparison(slugs) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("phones")
    .select(`
      *,
      brands (
        name,
        slug
      )
    `)
    .in("slug", slugs)
    .eq("status", "published");

  if (error) {
    console.error("Error fetching phones for comparison:", error);
    return [];
  }

  return data.map((phone) => ({
    id: phone.id,
    slug: phone.slug,
    name: phone.name,
    brand: phone.brands?.name || "",
    image: phone.image_url,
    price: phone.price,
    priceRange: phone.price_range,
    overallScore: {
      rating: phone.overall_score_rating,
      label: phone.overall_score_label,
    },
    scores: {
      camera: phone.score_camera,
      battery: phone.score_battery,
      performance: phone.score_performance,
      display: phone.score_display,
      value: phone.score_value,
    },
    specs: phone.specs || {},
    pros: phone.pros || [],
    cons: phone.cons || [],
  }));
}

/**
 * Fetch all brands
 */
export async function getBrands() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data;
}
