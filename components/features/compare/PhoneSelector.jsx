"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Smartphone, Star, X } from "lucide-react";

export default function PhoneSelector({
  isOpen,
  onClose,
  onSelect,
  excludeSlugs = [],
  phones = [],
}) {
  const [search, setSearch] = useState("");

  const filteredPhones = useMemo(() => {
    return phones
      .filter((phone) => !excludeSlugs.includes(phone.slug))
      .filter(
        (phone) =>
          phone.name.toLowerCase().includes(search.toLowerCase()) ||
          (phone.brand && phone.brand.toLowerCase().includes(search.toLowerCase()))
      );
  }, [phones, search, excludeSlugs]);

  if (!isOpen) return null;

  const titleId = "compare-phone-selector-title";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-2 top-[5%] sm:inset-x-4 sm:top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-xl sm:rounded-2xl shadow-2xl z-50 max-h-[90vh] sm:max-h-[80vh] flex flex-col border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30">
          <h3 id={titleId} className="text-base sm:text-lg font-semibold text-foreground">
            Select a Phone
          </h3>
          <button
            type="button"
            aria-label="Close phone selector"
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 sm:p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-muted/50 border border-border rounded-lg sm:rounded-xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Phone List */}
        <div className="flex-1 overflow-y-auto p-2 overscroll-contain">
          {filteredPhones.length > 0 ? (
            <div className="space-y-0.5 sm:space-y-1">
              {filteredPhones.map((phone) => (
                <button
                  type="button"
                  key={phone.id}
                  onClick={() => {
                    onSelect(phone);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted/50 active:bg-muted/70 transition-colors text-left"
                >
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                    {phone.image ? (
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        fill
                        className="object-contain p-0.5 sm:p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate">
                      {phone.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {phone.brand} • {phone.priceRange}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">
                      {phone.overallScore?.rating || "N/A"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No phones found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
