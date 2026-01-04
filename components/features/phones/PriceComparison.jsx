/**
 * Price Comparison Section - THE DECISION ANCHOR
 * Explains trade-offs clearly without clutter
 * Answers: "Why THIS phone over similar ones at this price?"
 */
import { ThumbsUp, Minus, ThumbsDown } from "lucide-react";

export default function PriceComparison({ comparisons, pricePoint }) {
  const getIcon = (type) => {
    const iconClass = "w-4 h-4";
    const icons = {
      better: <ThumbsUp className={iconClass} />,
      average: <Minus className={iconClass} />,
      worse: <ThumbsDown className={iconClass} />,
    };
    return icons[type] || <Minus className={iconClass} />;
  };

  const getTextColor = (type) => {
    const colors = {
      better: "text-emerald-700",
      average: "text-amber-700",
      worse: "text-rose-700",
    };
    return colors[type] || "text-gray-700";
  };

  const getIconBg = (type) => {
    const colors = {
      better: "bg-emerald-50 border-emerald-100 text-emerald-600",
      average: "bg-amber-50 border-amber-100 text-amber-600",
      worse: "bg-rose-50 border-rose-100 text-rose-600",
    };
    return colors[type] || "bg-gray-50 border-gray-100 text-gray-600";
  };

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          How This Phone Compares at This Price
        </h2>
        <div className="space-y-2">
          {comparisons.map((comparison, index) => (
            <div key={index} className="flex items-center gap-4 py-2">
              <span
                className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border ${getIconBg(
                  comparison.type
                )}`}
              >
                {getIcon(comparison.type)}
              </span>
              <div className="text-sm leading-relaxed pt-1">
                <span
                  className={`font-semibold ${getTextColor(comparison.type)}`}
                >
                  {comparison.label}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {comparison.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
