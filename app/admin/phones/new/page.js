import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhoneFormClient from "../PhoneFormClientNew";

export default async function NewPhonePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch brands for dropdown
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch stores for dropdown
  const { data: stores } = await supabase
    .from("stores")
    .select("id, name, slug, logo_url, website_url")
    .eq("is_active", true)
    .order("sort_order");

  return <PhoneFormClient user={user} brands={brands || []} stores={stores || []} phone={null} />;
}
