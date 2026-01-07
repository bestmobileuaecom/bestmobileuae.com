import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch all settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");

  // Fetch brands
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order");

  // Fetch stores
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .order("sort_order");

  return (
    <SettingsClient
      user={user}
      initialSettings={settings || []}
      initialBrands={brands || []}
      initialStores={stores || []}
    />
  );
}
