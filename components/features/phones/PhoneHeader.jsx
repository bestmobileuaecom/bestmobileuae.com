/**
 * Product Header - Modern Premium Design
 * Refactored into smaller, manageable components
 */
"use client";

import Link from "next/link";
import ProductImageSection from "./ProductImageSection";
import ScoreBadge from "./ScoreBadge";
import PriceSection, { getBestDeal } from "./PriceSection";
import {
  TrustSignals,
  QuickSpecs,
  StorageOptions,
  ColorOptions,
} from "./ProductSpecs";

export default function ProductHeader({ phone }) {
  const priceRange = phone.priceRange || "Check retailers";
  const score = phone.overallScore;
  const bestDeal = getBestDeal(phone.storePrices);

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* LEFT: Image Section */}
          <ProductImageSection phone={phone} />

          {/* RIGHT: Content Section */}
          <div className="flex-1 p-4 md:p-5 lg:p-6 flex flex-col">
            {/* Mobile: Score badge above title */}
            {score && (
              <div className="flex md:hidden items-center justify-between mb-3 pb-3 border-b border-border">
                <ScoreBadge
                  score={score}
                  size="sm"
                  gradientId="scoreGradientMobile"
                />
                <Link
                  href="#prices"
                  className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                >
                  See Prices
                </Link>
              </div>
            )}

            {/* Header Row: Title + Score (desktop) */}
            <div className="flex items-start justify-between gap-4 mb-3 md:mb-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-1 md:mb-2">
                  {phone.name}
                </h1>
                {phone.identity && (
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-none">
                    {phone.identity}
                  </p>
                )}
              </div>

              {/* Animated Score Badge - Desktop only */}
              {score && (
                <div className="hidden md:flex flex-shrink-0 bg-secondary/80 rounded-2xl px-3 py-2.5 border border-border">
                  <ScoreBadge
                    score={score}
                    size="md"
                    gradientId="scoreGradient"
                  />
                </div>
              )}
            </div>

            {/* Trust Signals */}
            <TrustSignals signals={phone.trustSignals} />

            {/* Quick Specs */}
            <QuickSpecs specs={phone.specs} />

            {/* Storage Options */}
            <StorageOptions options={phone.storageOptions} />

            {/* Color Options */}
            <ColorOptions options={phone.colorOptions} />

            {/* Spacer to push price box to bottom */}
            <div className="flex-1 min-h-1 md:min-h-2" />

            {/* Price Section with CTAs */}
            <PriceSection priceRange={priceRange} bestDeal={bestDeal} phoneSlug={phone.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
