import { createClient } from "@/lib/supabase/server";

/**
 * Fetch all published articles
 */
export async function getPublishedArticles(options = {}) {
  const supabase = await createClient();
  const { category, limit } = options;

  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  // Transform to match existing frontend format
  return data.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    slug: article.slug,
    category: article.category,
    readTime: article.read_time,
    phone: article.phone_name,
    image: article.image_url,
    date: article.published_at || article.created_at,
    author: article.author,
  }));
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug, includePreview = false) {
  const supabase = await createClient();

  let query = supabase.from("articles").select("*").eq("slug", slug);

  if (includePreview) {
    query = query.in("status", ["published", "preview"]);
  } else {
    query = query.eq("status", "published");
  }

  const { data: article, error } = await query.single();

  if (error || !article) {
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    slug: article.slug,
    category: article.category,
    readTime: article.read_time,
    phone: article.phone_name,
    image: article.image_url,
    date: article.published_at || article.created_at,
    author: article.author,
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
  };
}

/**
 * Get article categories
 */
export const categories = ["All", "Review", "News", "Guide", "Comparison"];
