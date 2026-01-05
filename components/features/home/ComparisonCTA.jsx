import { GitCompare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ComparisonCTA() {
  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Soft CTA Card */}
          <div className="bg-muted/30 border border-border/40 rounded-xl p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-lg">
                  <GitCompare className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Can't decide between two phones?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Try: Samsung Galaxy A55 vs Xiaomi Redmi Note 13
                  </p>
                </div>
              </div>

              {/* Right: Button */}
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                Compare Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
