import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllComparisons } from "@/lib/data/comparisons";
import ComparisonsClient from "./ComparisonsClient";

export default async function ComparisonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch all comparisons
  const comparisons = await getAllComparisons();

  // Fetch all published phones for the dropdown
  const { data: phones } = await supabase
    .from("phones")
    .select("id, name, slug")
    .eq("status", "published")
    .order("name");

  return (
    <ComparisonsClient
      user={user}
      initialComparisons={comparisons}
      phones={phones || []}
    />
  );
}
