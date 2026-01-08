/**
 * Featured Comparisons Data Functions
 * Fetches comparison pairs for homepage and phone detail pages
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Get featured comparisons for homepage
 * @returns {Promise<Array>} Array of comparison pairs
 */
export async function getHomepageComparisons() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("comparison_pairs")
    .select("*")
    .eq("show_on_homepage", true)
    .order("homepage_order", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error fetching homepage comparisons:", error);
    return [];
  }

  return data.map(transformComparison);
}

/**
 * Get comparisons for a specific phone
 * @param {string} phoneId - The phone UUID
 * @returns {Promise<Array>} Array of comparison pairs involving this phone
 */
export async function getPhoneComparisons(phoneId) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("comparison_pairs")
    .select("*")
    .or(`phone1_id.eq.${phoneId},phone2_id.eq.${phoneId}`)
    .limit(3);

  if (error) {
    console.error("Error fetching phone comparisons:", error);
    return [];
  }

  return data.map(transformComparison);
}

/**
 * Get all comparisons for admin
 * @returns {Promise<Array>} All comparisons
 */
export async function getAllComparisons() {
  const supabase = await createClient();
  
  // Query from the base table with joins for admin view
  const { data, error } = await supabase
    .from("featured_comparisons")
    .select(`
      id,
      title,
      description,
      show_on_homepage,
      homepage_order,
      is_active,
      created_at,
      phone1:phones!phone1_id(id, name, slug, image_url),
      phone2:phones!phone2_id(id, name, slug, image_url)
    `)
    .order("homepage_order", { ascending: true });

  if (error) {
    console.error("Error fetching all comparisons:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    showOnHomepage: item.show_on_homepage,
    homepageOrder: item.homepage_order,
    isActive: item.is_active,
    createdAt: item.created_at,
    phone1: item.phone1 ? {
      id: item.phone1.id,
      name: item.phone1.name,
      slug: item.phone1.slug,
      image: item.phone1.image_url,
    } : null,
    phone2: item.phone2 ? {
      id: item.phone2.id,
      name: item.phone2.name,
      slug: item.phone2.slug,
      image: item.phone2.image_url,
    } : null,
  }));
}

/**
 * Transform DB comparison to frontend format
 */
function transformComparison(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    phone1: item.phone1_name,
    phone2: item.phone2_name,
    slug: `${item.phone1_slug},${item.phone2_slug}`,
    phone1Image: item.phone1_image,
    phone2Image: item.phone2_image,
    phone1Price: item.phone1_price,
    phone2Price: item.phone2_price,
  };
}
