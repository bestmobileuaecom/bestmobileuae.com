import { NextResponse } from "next/server";
import { getPublishedPhones, getBrands } from "@/lib/data/phones";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy");
  const search = searchParams.get("search");

  try {
    let phones = await getPublishedPhones({
      category,
      brand,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
    });

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      phones = phones.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.brand && p.brand.toLowerCase().includes(searchLower))
      );
    }

    const brands = await getBrands();

    return NextResponse.json({ phones, brands });
  } catch (error) {
    console.error("Error fetching phones:", error);
    return NextResponse.json({ phones: [], brands: [], error: error.message }, { status: 500 });
  }
}
