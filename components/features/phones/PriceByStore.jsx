/**
 * Price by Store - Simple price comparison
 * Shows where to buy and current prices with store logos from database
 */
import Image from "next/image";
import { ExternalLink, TrendingDown, Clock } from "lucide-react";

export default function PriceByStore({ storePrices, phoneName = "this phone" }) {
  if (!storePrices || storePrices.length === 0) return null;

  // Find the lowest price to mark as "Best Price"
  const prices = storePrices.map((item) => {
    const numericPrice = parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0");
    return { ...item, numericPrice };
  });
  const lowestPrice = Math.min(...prices.map((p) => p.numericPrice));

  return (
    <section className="mb-6 md:mb-8" id="prices">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Where to Buy {phoneName} in UAE
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Last updated: January 2026 · Prices checked daily in UAE
          </span>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-6 -mt-2">
          {prices.map((item, index) => {
            const isBestPrice = item.numericPrice === lowestPrice;
            // Use logo_url from database (from stores table)
            const logo = item.logo_url;

            return (
              <a
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className={`group flex items-center justify-between px-3 md:px-4 py-3 rounded-xl transition-colors ${
                  index !== storePrices.length - 1 ? "mb-2" : ""
                } ${
                  isBestPrice
                    ? "bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100"
                    : "bg-secondary/50 hover:bg-secondary border border-border"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Store Logo */}
                  <div className="w-16 h-10 md:w-20 md:h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={item.store}
                        fill
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {item.store}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-foreground">
                      {item.store}
                    </span>
                    {isBestPrice && (
                      <span className="inline-flex items-center gap-1 text-[10px] md:text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium w-fit">
                        <TrendingDown className="w-3 h-3" />
                        Best Price
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-right">
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      from{" "}
                    </span>
                    <span
                      className={`text-base md:text-lg font-bold ${
                        isBestPrice ? "text-emerald-700" : "text-foreground"
                      }`}
                    >
                      {item.price}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>💡</span> Prices shown are for base variant. Higher storage
            options may cost more.
          </p>
        </div>
      </div>
    </section>
  );
}
