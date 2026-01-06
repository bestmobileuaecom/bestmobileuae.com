import { GitCompare, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ComparisonCTA({ comparisons = [] }) {
  // If no comparisons from Supabase, don't render the popular comparisons section
  const hasComparisons = comparisons.length > 0;

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <GitCompare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Compare Phones</h2>
                    <p className="text-sm text-muted-foreground">Can't decide? Compare specs side-by-side</p>
                  </div>
                </div>
                <Link
                  href="/compare"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Compare any phones
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Popular Comparisons Grid - only if we have comparisons */}
              {hasComparisons ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisons.map((comparison, idx) => (
                    <Link
                      key={idx}
                      href={`/compare?phones=${comparison.slug}`}
                      className="group relative flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-muted/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Phone 1 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {comparison.phone1}
                          </p>
                        </div>
                        
                        {/* VS Badge */}
                        <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full">
                          <span className="text-[10px] font-bold text-primary">VS</span>
                        </div>
                        
                        {/* Phone 2 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {comparison.phone2}
                          </p>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="shrink-0 ml-3">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Select any two phones to compare their specs, features, and prices.</p>
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl transition-colors"
                  >
                    Start Comparing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Mobile CTA */}
              {hasComparisons && (
                <div className="sm:hidden mt-5 pt-4 border-t border-border/50 text-center">
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl transition-colors"
                  >
                    Start Comparing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
