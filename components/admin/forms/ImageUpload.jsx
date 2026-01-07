"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

/**
 * ImageUpload - Upload images to Supabase Storage
 * @param {string} value - Current image URL
 * @param {function} onChange - Callback when image URL changes
 * @param {string} bucket - Supabase storage bucket name (default: "phone-images")
 * @param {string} folder - Folder path within bucket (optional)
 */
export default function ImageUpload({ 
  value, 
  onChange, 
  bucket = "phone-images",
  folder = "",
  label = "Phone Image"
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async () => {
    // Optionally delete from storage
    if (value && value.includes(bucket)) {
      try {
        // Extract file path from URL
        const url = new URL(value);
        const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
        if (pathParts[1]) {
          await supabase.storage.from(bucket).remove([pathParts[1]]);
        }
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    onChange("");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      {value ? (
        // Preview uploaded image
        <div className="relative group">
          <div className="w-full h-48 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Phone preview"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="mt-1.5 text-xs text-gray-500 truncate" title={value}>
            {value.length > 50 ? `...${value.slice(-50)}` : value}
          </p>
        </div>
      ) : (
        // Upload area
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
            flex flex-col items-center justify-center gap-2 transition-colors
            ${dragOver 
              ? "border-teal-500 bg-teal-50" 
              : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"
            }
            ${uploading ? "pointer-events-none" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="w-6 h-6 text-gray-500" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-teal-600">
                  Click to upload
                </span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <span className="text-xs text-gray-400">
                PNG, JPG, WebP or GIF (max 5MB)
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
