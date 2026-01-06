"use client";

import { useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import { Save, Plus, Trash2, Loader2, GripVertical } from "lucide-react";

export default function SettingsClient({ user, initialSettings, initialBrands }) {
  const [settings, setSettings] = useState(initialSettings);
  const [brands, setBrands] = useState(initialBrands);
  const [activeTab, setActiveTab] = useState("brands");
  const [loading, setSaving] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", slug: "" });
  const supabase = createClient();

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Add new brand
  const handleAddBrand = async () => {
    if (!newBrand.name) return;

    setSaving(true);
    const brandData = {
      name: newBrand.name,
      slug: newBrand.slug || generateSlug(newBrand.name),
      sort_order: brands.length + 1,
    };

    const { data, error } = await supabase
      .from("brands")
      .insert(brandData)
      .select()
      .single();

    if (!error && data) {
      setBrands([...brands, data]);
      setNewBrand({ name: "", slug: "" });
    }
    setSaving(false);
  };

  // Delete brand
  const handleDeleteBrand = async (brandId) => {
    if (!confirm("Are you sure? This will remove the brand from all phones.")) return;

    const { error } = await supabase.from("brands").delete().eq("id", brandId);

    if (!error) {
      setBrands(brands.filter((b) => b.id !== brandId));
    }
  };

  // Toggle brand active status
  const handleToggleBrand = async (brandId, isActive) => {
    const { error } = await supabase
      .from("brands")
      .update({ is_active: !isActive })
      .eq("id", brandId);

    if (!error) {
      setBrands(
        brands.map((b) =>
          b.id === brandId ? { ...b, is_active: !isActive } : b
        )
      );
    }
  };

  // Save setting
  const handleSaveSetting = async (key, value) => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ value })
      .eq("key", key);

    if (!error) {
      setSettings(
        settings.map((s) => (s.key === key ? { ...s, value } : s))
      );
    }
    setSaving(false);
  };

  const tabs = [
    { id: "brands", label: "Brands" },
    { id: "general", label: "General Settings" },
  ];

  return (
    <AdminLayoutWrapper user={user} title="Settings">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Brands Tab */}
      {activeTab === "brands" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phone Brands
          </h3>

          {/* Add New Brand */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Brand Name"
              value={newBrand.name}
              onChange={(e) => {
                setNewBrand({
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Slug"
              value={newBrand.slug}
              onChange={(e) =>
                setNewBrand({ ...newBrand, slug: e.target.value })
              }
              className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <button
              onClick={handleAddBrand}
              disabled={loading || !newBrand.name}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add Brand
            </button>
          </div>

          {/* Brands List */}
          <div className="space-y-2">
            {brands.map((brand, index) => (
              <div
                key={brand.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  brand.is_active
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500 w-8">{index + 1}</span>
                <span
                  className={`flex-1 font-medium ${
                    brand.is_active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {brand.name}
                </span>
                <span className="text-sm text-gray-500">/{brand.slug}</span>
                <button
                  onClick={() => handleToggleBrand(brand.id, brand.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    brand.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {brand.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleDeleteBrand(brand.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.key} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                {setting.key.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{setting.description}</p>
              <textarea
                value={JSON.stringify(setting.value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setSettings(
                      settings.map((s) =>
                        s.key === setting.key ? { ...s, value: parsed } : s
                      )
                    );
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
              />
              <button
                onClick={() => handleSaveSetting(setting.key, setting.value)}
                disabled={loading}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
