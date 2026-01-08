/**
 * CompareWith - Phone comparison suggestions on detail page
 * Shows curated comparisons for this phone (from admin) or auto-generated suggestions
 */
import Link from "next/link";
import Image from "next/image";
import { GitCompare, ArrowRight, ChevronRight } from "lucide-react";

export default function CompareWith({ comparisons = [], currentPhone }) {
  if (!comparisons || comparisons.length === 0) return null;

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Compare {currentPhone?.name || "This Phone"}
          </h2>
          <Link
            href="/compare"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            Compare any
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-3">
          {comparisons.map((comparison, idx) => {
            // Determine which phone is the "other" phone in the comparison
            const isPhone1Current = comparison.phone1 === currentPhone?.name;
            const otherPhone = isPhone1Current ? comparison.phone2 : comparison.phone1;
            const otherPhoneImage = isPhone1Current ? comparison.phone2Image : comparison.phone1Image;
            const otherPhonePrice = isPhone1Current ? comparison.phone2Price : comparison.phone1Price;

            return (
              <Link
                key={idx}
                href={`/compare?phones=${comparison.slug}`}
                className="group flex items-center justify-between p-3 md:p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  {/* Other Phone Image */}
                  <div className="w-12 h-12 md:w-14 md:h-14 relative bg-background rounded-lg overflow-hidden flex-shrink-0 border border-border">
                    <Image
                      src={otherPhoneImage || "/placeholder-phone.png"}
                      alt={otherPhone}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Comparison Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {otherPhone}
                      </span>
                    </div>
                    {otherPhonePrice && (
                      <p className="text-xs text-muted-foreground">
                        {otherPhonePrice}
                      </p>
                    )}
                    {comparison.title && (
                      <p className="text-xs text-primary mt-1">
                        {comparison.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* VS Badge + Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full">
                    <GitCompare className="w-4 h-4 text-primary" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA for custom comparison */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={`/compare?phones=${currentPhone?.slug || ""}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            Compare with any other phone
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
