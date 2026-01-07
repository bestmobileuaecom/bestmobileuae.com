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
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function PhonesListClient({ user, initialPhones, brands }) {
  const [phones, setPhones] = useState(initialPhones);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const filteredPhones = phones.filter((phone) => {
    const matchesSearch = phone.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || phone.status === statusFilter;
    const matchesBrand =
      brandFilter === "all" || phone.brand_id === brandFilter;
    return matchesSearch && matchesStatus && matchesBrand;
  });

  const handleStatusChange = async (phoneId, newStatus) => {
    const updateData = {
      status: newStatus,
    };

    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("phones")
      .update(updateData)
      .eq("id", phoneId);

    if (!error) {
      setPhones(
        phones.map((p) =>
          p.id === phoneId ? { ...p, status: newStatus } : p
        )
      );
    }
    setMenuOpen(null);
  };

  const handleDelete = async (phoneId) => {
    if (!confirm("Are you sure you want to delete this phone?")) return;

    const { error } = await supabase.from("phones").delete().eq("id", phoneId);

    if (!error) {
      setPhones(phones.filter((p) => p.id !== phoneId));
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

  return (
    <AdminLayoutWrapper user={user} title="Phones">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search phones..."
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
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <Link
            href="/admin/phones/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Phone</span>
          </Link>
        </div>
      </div>

      {/* Phones Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Brand
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Score
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
              {filteredPhones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No phones found</p>
                      <p className="text-sm">
                        {phones.length === 0
                          ? "Add your first phone to get started"
                          : "Try adjusting your filters"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPhones.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-1">
                          {phone.image_url ? (
                            <img
                              src={phone.image_url}
                              alt={phone.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {phone.name}
                          </p>
                          <p className="text-sm text-gray-500">/{phone.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {phone.brands?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {phone.price ? `AED ${phone.price.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {phone.overall_score_rating ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {phone.overall_score_rating}/10
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(phone.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/phones/${phone.slug}?preview=true`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/phones/${phone.id}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpen(menuOpen === phone.id ? null : phone.id)
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {menuOpen === phone.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {phone.status !== "published" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(phone.id, "published")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  Publish
                                </button>
                              )}
                              {phone.status !== "preview" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(phone.id, "preview")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4 text-yellow-600" />
                                  Set to Preview
                                </button>
                              )}
                              {phone.status !== "draft" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(phone.id, "draft")
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  Unpublish (Draft)
                                </button>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(phone.id)}
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
