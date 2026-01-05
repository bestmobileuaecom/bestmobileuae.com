"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Smartphone, Star, X } from "lucide-react";
import { allPhones } from "@/lib/phones-data";

export default function PhoneSelector({
  isOpen,
  onClose,
  onSelect,
  excludeSlugs = [],
}) {
  const [search, setSearch] = useState("");

  const filteredPhones = useMemo(() => {
    return allPhones
      .filter((phone) => !excludeSlugs.includes(phone.slug))
      .filter(
        (phone) =>
          phone.name.toLowerCase().includes(search.toLowerCase()) ||
          phone.brand.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, excludeSlugs]);

  if (!isOpen) return null;

  const titleId = "compare-phone-selector-title";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col border border-border"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 id={titleId} className="text-lg font-semibold text-foreground">
            Select a Phone
          </h3>
          <button
            type="button"
            aria-label="Close phone selector"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredPhones.length > 0 ? (
            <div className="space-y-1">
              {filteredPhones.map((phone) => (
                <button
                  type="button"
                  key={phone.id}
                  onClick={() => {
                    onSelect(phone);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                    {phone.image ? (
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {phone.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {phone.brand} • {phone.priceRange}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">
                      {phone.overallScore?.rating || "N/A"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No phones found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
