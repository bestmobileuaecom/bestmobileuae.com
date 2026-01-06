import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhoneFormClient from "../PhoneFormClient";

export default async function EditPhonePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch phone data
  const { data: phone, error } = await supabase
    .from("phones")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !phone) {
    notFound();
  }

  // Fetch store prices
  const { data: storePrices } = await supabase
    .from("phone_store_prices")
    .select("*")
    .eq("phone_id", id)
    .order("price_value");

  // Fetch brands for dropdown
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <PhoneFormClient
      user={user}
      brands={brands || []}
      phone={{ ...phone, storePrices: storePrices || [] }}
    />
  );
}
