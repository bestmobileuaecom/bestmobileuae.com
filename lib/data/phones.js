import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

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
      score_design,
      score_performance,
      score_camera,
      score_connectivity,
      score_battery,
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
      ? `AED ${formatPrice(lowestPrice)}`
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
        design: phone.score_design,
        performance: phone.score_performance,
        camera: phone.score_camera,
        connectivity: phone.score_connectivity,
        battery: phone.score_battery,
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

  // Include draft/preview content or only published
  if (includePreview) {
    query = query.in("status", ["published", "preview", "draft"]);
  } else {
    query = query.eq("status", "published");
  }

  const { data: phone, error } = await query.single();

  if (error || !phone) {
    return null;
  }

  // Fetch store prices with store logo
  const { data: storePrices } = await supabase
    .from("phone_store_prices")
    .select(`
      *,
      stores (
        id,
        name,
        logo_url,
        website_url
      )
    `)
    .eq("phone_id", phone.id)
    .eq("is_active", true)
    .order("price_value");

  // Also fetch all stores for fallback matching by name
  const { data: allStores } = await supabase
    .from("stores")
    .select("id, name, logo_url")
    .eq("is_active", true);

  // Calculate lowest price from store prices
  const lowestPrice = storePrices?.length > 0 
    ? Math.min(...storePrices.map(sp => sp.price_value).filter(p => p > 0))
    : null;
  const priceRange = lowestPrice 
    ? `AED ${formatPrice(lowestPrice)}`
    : phone.price_range || "Check retailers";

  // Transform to match simplified frontend format
  return {
    id: phone.id,
    slug: phone.slug,
    name: phone.name,
    brand: phone.brands?.name || "",
    image: phone.image_url,
    priceRange: priceRange,
    price: lowestPrice || phone.price,
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
    storePrices: storePrices?.map((sp) => {
      // Try to get logo from joined stores, or fallback to matching by name
      let logoUrl = sp.stores?.logo_url;
      if (!logoUrl && sp.store_name && allStores) {
        const matchedStore = allStores.find(s => 
          s.name.toLowerCase() === sp.store_name.toLowerCase()
        );
        logoUrl = matchedStore?.logo_url || null;
      }
      return {
        store: sp.store_name,
        // Format price with 2 decimals from price_value, fallback to stored price string
        price: sp.price_value ? `AED ${formatPrice(sp.price_value)}` : sp.price,
        url: sp.url,
        region: sp.region,
        logo_url: logoUrl,
      };
    }) || [],
    
    // Simplified "Should You Buy" - single reason each
    buyReason: phone.buy_reason || (phone.buy_reasons?.[0] || null),
    skipReason: phone.skip_reason || (phone.skip_reasons?.[0] || null),
    
    // New 5-metric scores (0-10 scale)
    scores: {
      design: phone.score_design || phone.score_display || 0,
      performance: phone.score_performance || 0,
      camera: phone.score_camera || 0,
      connectivity: phone.score_connectivity || 7,
      battery: phone.score_battery || 0,
    },
    
    alternatives: phone.alternatives || [],
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
