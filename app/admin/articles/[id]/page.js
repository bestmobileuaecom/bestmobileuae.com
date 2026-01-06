import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleFormClient from "../ArticleFormClient";

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch article data
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  // Fetch phones for linking
  const { data: phones } = await supabase
    .from("phones")
    .select("id, name, slug")
    .eq("status", "published")
    .order("name");

  return (
    <ArticleFormClient user={user} phones={phones || []} article={article} />
  );
}
