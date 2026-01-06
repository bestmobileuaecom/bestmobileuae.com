"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  FileText,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";

export default function ArticlesListClient({ user, initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const categories = ["Review", "News", "Guide", "Comparison"];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = async (articleId, newStatus) => {
    const updateData = {
      status: newStatus,
    };

    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", articleId);

    if (!error) {
      setArticles(
        articles.map((a) =>
          a.id === articleId ? { ...a, status: newStatus } : a
        )
      );
    }
    setMenuOpen(null);
  };

  const handleDelete = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (!error) {
      setArticles(articles.filter((a) => a.id !== articleId));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-700",
      preview: "bg-yellow-100 text-yellow-700",
      published: "bg-emerald-100 text-emerald-700",
    };
    const icons = {
      draft: FileText,
      preview: Eye,
      published: Check,
    };
    const Icon = icons[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const colors = {
      Review: "bg-blue-100 text-blue-700",
      News: "bg-purple-100 text-purple-700",
      Guide: "bg-orange-100 text-orange-700",
      Comparison: "bg-cyan-100 text-cyan-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[category] || "bg-gray-100 text-gray-700"
        }`}
      >
        {category}
      </span>
    );
  };

  return (
    <AdminLayoutWrapper user={user} title="Articles">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="preview">Preview</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Article</span>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Article
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Read Time
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No articles found</p>
                      <p className="text-sm">
                        {articles.length === 0
                          ? "Add your first article to get started"
                          : "Try adjusting your filters"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {article.image_url ? (
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500">/{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(article.category)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.read_time || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blogs/${article.slug}?preview=true`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpen(
                                menuOpen === article.id ? null : article.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {menuOpen === article.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {article.status !== "published" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(article.id, "published")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  Publish
                                </button>
                              )}
                              {article.status !== "preview" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(article.id, "preview")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4 text-yellow-600" />
                                  Set to Preview
                                </button>
                              )}
                              {article.status !== "draft" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(article.id, "draft")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  Unpublish (Draft)
                                </button>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
