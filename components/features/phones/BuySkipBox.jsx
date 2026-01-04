/**
 * Buy/Skip Box - The trust section
 * Clear two-column layout with user-focused language
 * Max 3 bullets per side
 */
import { Check, X } from "lucide-react";

export default function BuySkipBox({ buyReasons, skipReasons }) {
  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Is This Phone Right for You?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Buy If */}
          <div className="bg-secondary/50 border border-emerald-100/80 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground">Good for you if</h3>
            </div>
            <ul className="space-y-3">
              {buyReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground text-sm"
                >
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skip If */}
          <div className="bg-secondary/50 border border-rose-100/80 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100">
                <X className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="font-semibold text-foreground">Avoid if</h3>
            </div>
            <ul className="space-y-3">
              {skipReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground text-sm"
                >
                  <X className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
