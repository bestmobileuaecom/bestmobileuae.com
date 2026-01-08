"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin";
import { ImageUpload } from "@/components/admin/forms";
import { createClient } from "@/lib/supabase/client";
import {
  Save,
  Eye,
  ArrowLeft,
  ExternalLink,
  Loader2,
  EyeOff,
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
  const [showPreview, setShowPreview] = useState(true);

  const categories = ["Review", "News", "Guide", "Comparison"];

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 underline">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Tables (basic support)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^-+$/))) return '';
        return '<tr>' + cells.map(c => `<td class="border px-2 py-1">${c.trim()}</td>`).join('') + '</tr>';
      })
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>');
  };

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
      <div className="space-y-6">
        {/* Top Row: Basic Info + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-6">
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
          </div>

          {/* Sidebar - Article Details, Image, SEO */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Article Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={formData.read_time || ""}
                    onChange={(e) => updateField("read_time", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="8 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => updateField("author", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tech Team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Phone</label>
                  <select
                    value={formData.phone_id || ""}
                    onChange={(e) => {
                      updateField("phone_id", e.target.value);
                      const phone = phones.find((p) => p.id === e.target.value);
                      if (phone) updateField("phone_name", phone.name);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">None</option>
                    {phones.map((phone) => (
                      <option key={phone.id} value={phone.id}>{phone.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Image + SEO in row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => updateField("image_url", url)}
                  bucket="phone-images"
                  folder="articles"
                  label="Featured Image"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">SEO</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title || ""}
                    onChange={(e) => updateField("meta_title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Leave empty to use article title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    value={formData.meta_description || ""}
                    onChange={(e) => updateField("meta_description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Leave empty to use excerpt"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Editor */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-lg font-semibold text-gray-900">
              Content (Markdown/HTML)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
          
          <div className={`grid gap-6 ${showPreview ? "grid-cols-2" : "grid-cols-1"}`}>
            {/* Editor */}
            <textarea
              value={formData.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              rows={30}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
              placeholder="Write your article content here using Markdown..."
            />
            
            {/* Live Preview */}
            {showPreview && (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 overflow-auto max-h-[800px]">
                <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-medium">Preview</div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${renderMarkdown(formData.content)}</p>` }}
                />
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Supports Markdown: **bold**, *italic*, ## headings, - lists, [links](url), | tables |
          </p>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
