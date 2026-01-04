/**
 * Final Recommendation - Decision Closure
 * Gives user mental closure before showing alternatives
 * Short, confident, actionable
 */
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function FinalRecommendation({ recommendation }) {
  if (!recommendation) return null;

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Final Recommendation
        </h2>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {recommendation}
            </p>
            <a
              href="#prices"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              <span>Check best prices</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
