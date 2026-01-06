/**
 * Price Section - Price display, best deal, and CTA buttons
 */
import Link from "next/link";
import { ExternalLink, Scale, ChevronRight, Zap, Bell } from "lucide-react";

// Helper to get best deal from store prices
export function getBestDeal(storePrices) {
  if (!Array.isArray(storePrices) || storePrices.length === 0) return null;

  const normalized = storePrices
    .map((item) => {
      const numericPrice = parseFloat(
        String(item.price || "").replace(/[^0-9.]/g, "")
      );
      return { ...item, numericPrice };
    })
    .filter((item) => Number.isFinite(item.numericPrice));

  if (normalized.length === 0) return null;

  return normalized.reduce((best, cur) =>
    cur.numericPrice < best.numericPrice ? cur : best
  );
}

export default function PriceSection({ priceRange, bestDeal, phoneSlug }) {
  // Build compare URL with phone slug pre-selected
  const compareUrl = phoneSlug ? `/compare?phones=${phoneSlug}` : "/compare";
  
  return (
    <>
      {/* Price Box */}
      <div className="bg-gradient-to-r from-foreground to-foreground/90 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4">
        <div className="flex flex-col gap-2 md:gap-4 md:flex-row md:items-center md:justify-between">
          {/* Price Info */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 md:gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-background">
                {priceRange}
              </span>
              <span className="text-[10px] md:text-xs text-background/60 uppercase font-medium">
                starting price
              </span>
            </div>

            {bestDeal && (
              <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium text-emerald-400 bg-emerald-500/20 px-1.5 md:px-2 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  Best Deal
                </span>
                <span className="text-xs md:text-sm font-semibold text-background">
                  {bestDeal.price}
                </span>
                <span className="text-[10px] md:text-xs text-background/60">
                  at {bestDeal.store}
                </span>
              </div>
            )}
          </div>

          {/* Price Alert - Desktop - Scrolls to alert form */}
          <Link
            href="#price-alert"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-background/90 bg-background/10 hover:bg-background/20 px-4 py-2.5 rounded-lg transition-colors border border-background/10"
          >
            <Bell className="w-4 h-4" />
            Set Price Alert
          </Link>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        <Link
          href="#prices"
          className="inline-flex items-center justify-center gap-1.5 md:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] group text-sm md:text-base"
        >
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Compare Prices</span>
          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href={compareUrl}
          className="inline-flex items-center justify-center gap-1.5 md:gap-2 text-muted-foreground hover:text-foreground font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] transition-all text-sm md:text-base"
        >
          <Scale className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Compare Phones</span>
        </Link>
      </div>

      {/* Mobile Price Alert - Scrolls to alert form */}
      <Link
        href="#price-alert"
        className="md:hidden mt-2 w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 active:scale-[0.98] px-3 py-2 rounded-lg transition-colors border border-border"
      >
        <Bell className="w-3.5 h-3.5" />
        Set Price Alert
      </Link>
    </>
  );
}
