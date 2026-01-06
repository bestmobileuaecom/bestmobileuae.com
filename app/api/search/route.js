import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query || query.length < 2) {
      return NextResponse.json({ phones: [], articles: [] });
    }

    const supabase = await createClient();
    const searchLower = query.toLowerCase();

    // Search phones
    const { data: phones } = await supabase
      .from("phones")
      .select("id, name, slug, image_url, price, price_range, overall_score_rating")
      .eq("status", "published")
      .or(`name.ilike.%${searchLower}%,identity.ilike.%${searchLower}%`)
      .limit(5);

    // Search articles
    const { data: articles } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, category, image_url")
      .eq("status", "published")
      .or(`title.ilike.%${searchLower}%,excerpt.ilike.%${searchLower}%`)
      .limit(3);

    return NextResponse.json({
      phones: phones?.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.image_url,
        price: p.price_range,
        score: p.overall_score_rating,
      })) || [],
      articles: articles?.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        category: a.category,
        image: a.image_url,
      })) || [],
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ phones: [], articles: [], error: error.message }, { status: 500 });
  }
}
