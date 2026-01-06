import { NextResponse } from "next/server";
import { getPublishedArticles, categories } from "@/lib/data/articles";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");

  try {
    const articles = await getPublishedArticles({
      category: category && category !== "All" ? category : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return NextResponse.json({ articles, categories });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ articles: [], categories, error: error.message }, { status: 500 });
  }
}
