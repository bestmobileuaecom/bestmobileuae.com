import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhonesListClient from "./PhonesListClient";

export default async function AdminPhonesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch all phones with brand info
  const { data: phones, error } = await supabase
    .from("phones")
    .select(`
      id,
      slug,
      name,
      brand_id,
      image_url,
      price,
      category,
      status,
      overall_score_rating,
      created_at,
      updated_at,
      brands (
        name
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch brands for filter
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <PhonesListClient
      user={user}
      initialPhones={phones || []}
      brands={brands || []}
    />
  );
}
