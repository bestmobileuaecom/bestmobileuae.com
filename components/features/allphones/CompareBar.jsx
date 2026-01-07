"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GitCompare, Smartphone, X } from "lucide-react";

export default function CompareBar({ phones, onRemove, onClear }) {
  if (phones.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left section with count and phones */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-foreground shrink-0">
              <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden xs:inline">Compare</span>
              <span className="text-primary">({phones.length}/3)</span>
            </div>

            {/* Phone thumbnails - visible on all screens */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {phones.map((phone) => (
                <div
                  key={phone.id}
                  className="relative group shrink-0"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg overflow-hidden border border-border">
                    {phone.image ? (
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${phone.name} from compare`}
                    onClick={() => onRemove(phone.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right section with actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClear}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Clear
            </button>
            <Link
              href={`/compare?phones=${phones.map((p) => p.slug).join(",")}`}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                phones.length >= 2
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              aria-disabled={phones.length < 2}
              tabIndex={phones.length < 2 ? -1 : 0}
            >
              <span className="hidden xs:inline">Compare</span>
              <span className="xs:hidden">Go</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
