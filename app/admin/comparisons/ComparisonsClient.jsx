"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  EyeOff,
  GitCompare,
  GripVertical,
  Home,
} from "lucide-react";

export default function ComparisonsClient({ user, initialComparisons, phones }) {
  const [comparisons, setComparisons] = useState(initialComparisons);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComparison, setNewComparison] = useState({
    phone1Id: "",
    phone2Id: "",
    title: "",
    showOnHomepage: true,
  });
  const router = useRouter();
  const supabase = createClient();

  const filteredComparisons = comparisons.filter((c) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      c.phone1?.name?.toLowerCase().includes(searchLower) ||
      c.phone2?.name?.toLowerCase().includes(searchLower) ||
      c.title?.toLowerCase().includes(searchLower)
    );
  });

  const handleAdd = async () => {
    if (!newComparison.phone1Id || !newComparison.phone2Id) {
      alert("Please select both phones");
      return;
    }
    if (newComparison.phone1Id === newComparison.phone2Id) {
      alert("Please select two different phones");
      return;
    }

    const { data, error } = await supabase
      .from("featured_comparisons")
      .insert({
        phone1_id: newComparison.phone1Id,
        phone2_id: newComparison.phone2Id,
        title: newComparison.title || null,
        show_on_homepage: newComparison.showOnHomepage,
        homepage_order: comparisons.length,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding comparison:", error);
      alert("Failed to add comparison. It may already exist.");
      return;
    }

    // Add to local state with phone details
    const phone1 = phones.find((p) => p.id === newComparison.phone1Id);
    const phone2 = phones.find((p) => p.id === newComparison.phone2Id);
    
    setComparisons([
      ...comparisons,
      {
        id: data.id,
        title: newComparison.title,
        showOnHomepage: newComparison.showOnHomepage,
        homepageOrder: comparisons.length,
        isActive: true,
        phone1: phone1 ? { id: phone1.id, name: phone1.name, slug: phone1.slug } : null,
        phone2: phone2 ? { id: phone2.id, name: phone2.name, slug: phone2.slug } : null,
      },
    ]);

    setNewComparison({ phone1Id: "", phone2Id: "", title: "", showOnHomepage: true });
    setShowAddModal(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comparison?")) return;

    const { error } = await supabase
      .from("featured_comparisons")
      .delete()
      .eq("id", id);

    if (!error) {
      setComparisons(comparisons.filter((c) => c.id !== id));
    }
  };

  const handleToggleHomepage = async (id, currentValue) => {
    const { error } = await supabase
      .from("featured_comparisons")
      .update({ show_on_homepage: !currentValue })
      .eq("id", id);

    if (!error) {
      setComparisons(
        comparisons.map((c) =>
          c.id === id ? { ...c, showOnHomepage: !currentValue } : c
        )
      );
    }
  };

  const handleToggleActive = async (id, currentValue) => {
    const { error } = await supabase
      .from("featured_comparisons")
      .update({ is_active: !currentValue })
      .eq("id", id);

    if (!error) {
      setComparisons(
        comparisons.map((c) =>
          c.id === id ? { ...c, isActive: !currentValue } : c
        )
      );
    }
  };

  return (
    <AdminLayoutWrapper user={user} title="Comparisons">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Featured Comparisons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage phone comparison pairs shown on homepage and phone pages
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Comparison
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search comparisons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Comparisons List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredComparisons.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comparisons found</p>
            <p className="text-sm mt-1">Add your first comparison pair</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Phone 1
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  VS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Phone 2
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Title
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Homepage
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredComparisons.map((comparison) => (
                <tr key={comparison.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {comparison.phone1?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-xs font-bold text-primary">
                      VS
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {comparison.phone2?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {comparison.title || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleHomepage(comparison.id, comparison.showOnHomepage)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        comparison.showOnHomepage
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      title={comparison.showOnHomepage ? "Visible on homepage" : "Hidden from homepage"}
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(comparison.id, comparison.isActive)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        comparison.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      title={comparison.isActive ? "Active" : "Inactive"}
                    >
                      {comparison.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(comparison.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Add Comparison</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Phone 1
                </label>
                <select
                  value={newComparison.phone1Id}
                  onChange={(e) => setNewComparison({ ...newComparison, phone1Id: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select phone...</option>
                  {phones.map((phone) => (
                    <option key={phone.id} value={phone.id}>
                      {phone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Phone 2
                </label>
                <select
                  value={newComparison.phone2Id}
                  onChange={(e) => setNewComparison({ ...newComparison, phone2Id: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select phone...</option>
                  {phones.map((phone) => (
                    <option key={phone.id} value={phone.id}>
                      {phone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={newComparison.title}
                  onChange={(e) => setNewComparison({ ...newComparison, title: e.target.value })}
                  placeholder="e.g., Budget Battle"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showOnHomepage"
                  checked={newComparison.showOnHomepage}
                  onChange={(e) => setNewComparison({ ...newComparison, showOnHomepage: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="showOnHomepage" className="text-sm text-foreground">
                  Show on homepage
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Add Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
