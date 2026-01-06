"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import {
  Save,
  Eye,
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Default empty article data
const defaultArticle = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "Review",
  read_time: "",
  phone_name: "",
  phone_id: "",
  image_url: "/mobile1.jpg",
  author: "Tech Team",
  meta_title: "",
  meta_description: "",
  status: "draft",
};

export default function ArticleFormClient({ user, phones, article }) {
  const isEdit = !!article;
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    ...defaultArticle,
    ...article,
  });

  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ["Review", "News", "Guide", "Comparison"];

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title) => {
    updateField("title", title);
    if (!isEdit || !formData.slug) {
      updateField("slug", generateSlug(title));
    }
  };

  // Validate form
  const validate = () => {
    const errs = {};
    if (!formData.title) errs.title = "Title is required";
    if (!formData.slug) errs.slug = "Slug is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save article
  const handleSave = async (status = null) => {
    if (!validate()) return;

    setSaving(true);

    const articleData = {
      ...formData,
      status: status || formData.status,
      phone_id: formData.phone_id || null,
      published_at:
        status === "published" && !article?.published_at
          ? new Date().toISOString()
          : article?.published_at,
    };

    try {
      if (isEdit) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert(articleData);
        if (error) throw error;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Error saving article: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayoutWrapper
      user={user}
      title={isEdit ? `Edit: ${article.title}` : "Add New Article"}
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          href="/admin/articles"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </Link>
        <div className="flex-1" />
        <div className="flex gap-3">
          {formData.slug && (
            <Link
              href={`/blogs/${formData.slug}?preview=true`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Preview
            </Link>
          )}
          <button
            onClick={() => handleSave("preview")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50"
          >
            <Eye className="w-5 h-5" />
            Save as Preview
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="iPhone 16 Pro Max Review"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/blogs/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    errors.slug ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="iphone-16-pro-max-review"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt || ""}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="A brief summary of the article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Markdown/HTML)
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
                placeholder="Write your article content here..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meta Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Article Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={formData.read_time || ""}
                onChange={(e) => updateField("read_time", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="8 min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) => updateField("author", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Tech Team"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Phone
              </label>
              <select
                value={formData.phone_id || ""}
                onChange={(e) => {
                  updateField("phone_id", e.target.value);
                  const phone = phones.find((p) => p.id === e.target.value);
                  if (phone) {
                    updateField("phone_name", phone.name);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="">None</option>
                {phones.map((phone) => (
                  <option key={phone.id} value={phone.id}>
                    {phone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Featured Image</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={formData.image_url || ""}
                onChange={(e) => updateField("image_url", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="/mobile1.jpg"
              />
            </div>

            {formData.image_url && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">SEO</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title || ""}
                onChange={(e) => updateField("meta_title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Leave empty to use article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description || ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Leave empty to use excerpt"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
