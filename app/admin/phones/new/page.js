import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhoneFormClient from "../PhoneFormClient";

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

  return <PhoneFormClient user={user} brands={brands || []} phone={null} />;
}
