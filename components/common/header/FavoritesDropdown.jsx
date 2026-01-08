"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLikedPhones, unlikePhone, onFavoritesChange } from "@/lib/favorites";
import { formatPrice } from "@/lib/utils";

export default function FavoritesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [likedSlugs, setLikedSlugs] = useState([]);
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Mark as mounted for client-side only operations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load liked phones from cookies on mount and listen for real-time changes
  useEffect(() => {
    if (!mounted) return;

    const loadLikedPhones = () => {
      const slugs = getLikedPhones();
      setLikedSlugs(slugs);
    };

    // Initial load
    loadLikedPhones();

    // Listen for real-time favorites changes from other components
    const unsubscribe = onFavoritesChange((slugs) => {
      setLikedSlugs(slugs);
    });

    // Listen for window focus (for cross-tab sync)
    window.addEventListener("focus", loadLikedPhones);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", loadLikedPhones);
    };
  }, [mounted]);

  // Fetch phone details when dropdown opens
  useEffect(() => {
    const fetchPhones = async () => {
      if (!isOpen || likedSlugs.length === 0) {
        setPhones([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/phones");
        const data = await response.json();
        
        // Filter to only liked phones
        const likedPhones = data.phones?.filter((phone) =>
          likedSlugs.includes(phone.slug)
        ) || [];
        
        setPhones(likedPhones);
      } catch (error) {
        console.error("Error fetching liked phones:", error);
        setPhones([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPhones();
    }
  }, [isOpen, likedSlugs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle remove from favorites
  const handleRemove = (slug, e) => {
    e.preventDefault();
    e.stopPropagation();
    unlikePhone(slug);
    setLikedSlugs((prev) => prev.filter((s) => s !== slug));
    setPhones((prev) => prev.filter((p) => p.slug !== slug));
  };

  // Refresh liked phones when opening dropdown
  const handleToggle = () => {
    if (!isOpen) {
      // Refresh the list when opening
      const slugs = getLikedPhones();
      setLikedSlugs(slugs);
    }
    setIsOpen(!isOpen);
  };

  // Show placeholder during SSR/hydration
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground relative transition-colors"
      >
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground relative transition-colors"
      >
        <Heart className={`h-5 w-5 ${likedSlugs.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
        {likedSlugs.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
            {likedSlugs.length > 9 ? "9+" : likedSlugs.length}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              My Favorites ({likedSlugs.length})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading...</p>
              </div>
            ) : phones.length === 0 ? (
              <div className="p-6 text-center">
                <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No favorites yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the heart icon on any phone to save it here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {phones.map((phone) => (
                  <Link
                    key={phone.slug}
                    href={`/phones/${phone.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted transition-colors group"
                  >
                    {/* Phone Image */}
                    <div className="relative h-14 w-14 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                      {phone.image ? (
                        <Image
                          src={phone.image}
                          alt={phone.name}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          📱
                        </div>
                      )}
                    </div>

                    {/* Phone Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {phone.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{phone.brand}</p>
                      {phone.price && (
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          AED {formatPrice(phone.price)}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(phone.slug, e)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {phones.length > 0 && (
            <div className="border-t border-border p-3 bg-muted">
              <Link
                href="/phones"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View All Phones →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
