import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  // Fetch dashboard stats
  const [
    { count: phonesCount },
    { count: publishedPhonesCount },
    { count: articlesCount },
    { count: publishedArticlesCount },
  ] = await Promise.all([
    supabase.from("phones").select("*", { count: "exact", head: true }),
    supabase.from("phones").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const stats = {
    phones: phonesCount || 0,
    publishedPhones: publishedPhonesCount || 0,
    articles: articlesCount || 0,
    publishedArticles: publishedArticlesCount || 0,
  };

  return <AdminDashboard user={user} stats={stats} />;
}
