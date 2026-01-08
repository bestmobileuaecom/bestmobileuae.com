/**
 * ShouldYouBuy - Simple 2 bullet decision helper
 * 
 * Mentor rule: "One strong opinion per section"
 * Only 2 bullets: Yes if... No if...
 */
import { Check, X } from "lucide-react";

export default function ShouldYouBuy({ buyReason, skipReason }) {
  // If neither reason exists, don't render
  if (!buyReason && !skipReason) return null;

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Should You Buy This Phone?
        </h2>
        <div className="space-y-3">
          {buyReason && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-emerald-700">Yes</span>, if {buyReason}
              </p>
            </div>
          )}
          {skipReason && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-100 flex-shrink-0">
                <X className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-rose-700">No</span>, if {skipReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
