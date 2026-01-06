import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticlesListClient from "./ArticlesListClient";

export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch all articles
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return <ArticlesListClient user={user} initialArticles={articles || []} />;
}
