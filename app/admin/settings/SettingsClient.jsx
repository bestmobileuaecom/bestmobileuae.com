"use client";

import { useState, useRef } from "react";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import { Save, Plus, Trash2, Loader2, GripVertical, Upload, X, Store } from "lucide-react";

export default function SettingsClient({ user, initialSettings, initialBrands, initialStores = [] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [brands, setBrands] = useState(initialBrands);
  const [stores, setStores] = useState(initialStores);
  const [activeTab, setActiveTab] = useState("brands");
  const [loading, setSaving] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", slug: "" });
  const [newStore, setNewStore] = useState({ name: "", slug: "", website_url: "" });
  const supabase = createClient();

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // =====================================================
  // BRAND FUNCTIONS
  // =====================================================
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

  const handleDeleteBrand = async (brandId) => {
    if (!confirm("Are you sure? This will remove the brand from all phones.")) return;

    const { error } = await supabase.from("brands").delete().eq("id", brandId);

    if (!error) {
      setBrands(brands.filter((b) => b.id !== brandId));
    }
  };

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

  // =====================================================
  // STORE FUNCTIONS
  // =====================================================
  const handleAddStore = async () => {
    if (!newStore.name) return;

    setSaving(true);
    const storeData = {
      name: newStore.name,
      slug: newStore.slug || generateSlug(newStore.name),
      website_url: newStore.website_url || "",
      sort_order: stores.length + 1,
    };

    const { data, error } = await supabase
      .from("stores")
      .insert(storeData)
      .select()
      .single();

    if (!error && data) {
      setStores([...stores, data]);
      setNewStore({ name: "", slug: "", website_url: "" });
    }
    setSaving(false);
  };

  const handleDeleteStore = async (storeId) => {
    if (!confirm("Are you sure? This will remove the store from all phone prices.")) return;

    const store = stores.find(s => s.id === storeId);
    
    // Delete logo from storage if exists
    if (store?.logo_url && store.logo_url.includes("store-logos")) {
      try {
        const url = new URL(store.logo_url);
        const pathParts = url.pathname.split("/storage/v1/object/public/store-logos/");
        if (pathParts[1]) {
          await supabase.storage.from("store-logos").remove([pathParts[1]]);
        }
      } catch (err) {
        console.error("Failed to delete logo:", err);
      }
    }

    const { error } = await supabase.from("stores").delete().eq("id", storeId);

    if (!error) {
      setStores(stores.filter((s) => s.id !== storeId));
    }
  };

  const handleToggleStore = async (storeId, isActive) => {
    const { error } = await supabase
      .from("stores")
      .update({ is_active: !isActive })
      .eq("id", storeId);

    if (!error) {
      setStores(
        stores.map((s) =>
          s.id === storeId ? { ...s, is_active: !isActive } : s
        )
      );
    }
  };

  const handleUploadStoreLogo = async (storeId, file) => {
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, WebP, or SVG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo size must be less than 2MB");
      return;
    }

    setSaving(true);

    try {
      // Generate filename
      const fileExt = file.name.split(".").pop();
      const store = stores.find(s => s.id === storeId);
      const fileName = `${store.slug}-${Date.now()}.${fileExt}`;

      // Delete old logo if exists
      if (store?.logo_url && store.logo_url.includes("store-logos")) {
        try {
          const url = new URL(store.logo_url);
          const pathParts = url.pathname.split("/storage/v1/object/public/store-logos/");
          if (pathParts[1]) {
            await supabase.storage.from("store-logos").remove([pathParts[1]]);
          }
        } catch (err) {
          console.error("Failed to delete old logo:", err);
        }
      }

      // Upload new logo
      const { data, error: uploadError } = await supabase.storage
        .from("store-logos")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("store-logos")
        .getPublicUrl(fileName);

      // Update store record
      const { error: updateError } = await supabase
        .from("stores")
        .update({ logo_url: publicUrl })
        .eq("id", storeId);

      if (updateError) throw updateError;

      // Update local state
      setStores(stores.map(s => 
        s.id === storeId ? { ...s, logo_url: publicUrl } : s
      ));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload logo: " + err.message);
    }

    setSaving(false);
  };

  // =====================================================
  // SETTINGS FUNCTIONS
  // =====================================================
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
    { id: "stores", label: "Stores" },
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

      {/* Stores Tab */}
      {activeTab === "stores" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5" />
            UAE Stores
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Manage stores for phone price comparison. Upload logos here so they auto-appear when adding phones.
          </p>

          {/* Add New Store */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => {
                setNewStore({
                  ...newStore,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Website URL"
              value={newStore.website_url}
              onChange={(e) =>
                setNewStore({ ...newStore, website_url: e.target.value })
              }
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <button
              onClick={handleAddStore}
              disabled={loading || !newStore.name}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add Store
            </button>
          </div>

          {/* Stores List */}
          <div className="space-y-3">
            {stores.map((store, index) => (
              <StoreRow
                key={store.id}
                store={store}
                index={index}
                onToggle={handleToggleStore}
                onDelete={handleDeleteStore}
                onUploadLogo={handleUploadStoreLogo}
                loading={loading}
              />
            ))}
            {stores.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No stores yet. Add your first store above.
              </p>
            )}
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

// Store Row Component with Logo Upload
function StoreRow({ store, index, onToggle, onDelete, onUploadLogo, loading }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await onUploadLogo(store.id, file);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border ${
        store.is_active
          ? "bg-white border-gray-200"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <GripVertical className="w-5 h-5 text-gray-400" />
      <span className="text-sm text-gray-500 w-8">{index + 1}</span>
      
      {/* Logo */}
      <div className="relative group">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors overflow-hidden"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : store.logo_url ? (
            <img 
              src={store.logo_url} 
              alt={store.name} 
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <Upload className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex-1">
        <span className={`font-medium ${store.is_active ? "text-gray-900" : "text-gray-400"}`}>
          {store.name}
        </span>
        {store.website_url && (
          <a 
            href={store.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-xs text-gray-500 hover:text-emerald-600 truncate max-w-[200px]"
          >
            {store.website_url}
          </a>
        )}
      </div>

      <button
        onClick={() => onToggle(store.id, store.is_active)}
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          store.is_active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {store.is_active ? "Active" : "Inactive"}
      </button>
      <button
        onClick={() => onDelete(store.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
