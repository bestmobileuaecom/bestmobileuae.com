/**
 * Score Strip - Horizontal card ratings with stars
 * Score out of 10 with micro-justifications for trust
 */
import {
  Star,
  BadgeDollarSign,
  Smartphone,
  Camera,
  Gamepad2,
  BatteryCharging,
  Zap,
} from "lucide-react";

export default function ScoreStrip({ scores }) {
  const getCategoryConfig = (label) => {
    switch (label) {
      case "Value":
        return {
          icon: BadgeDollarSign,
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          iconColor: "text-emerald-600",
          hint: "Price vs features balance",
        };
      case "Daily Use":
        return {
          icon: Smartphone,
          bg: "bg-blue-50",
          border: "border-blue-100",
          iconColor: "text-blue-600",
          hint: "Apps, calls, browsing speed",
        };
      case "Camera":
        return {
          icon: Camera,
          bg: "bg-purple-50",
          border: "border-purple-100",
          iconColor: "text-purple-600",
          hint: "Photo quality, day & night",
        };
      case "Gaming":
        return {
          icon: Gamepad2,
          bg: "bg-rose-50",
          border: "border-rose-100",
          iconColor: "text-rose-600",
          hint: "Heavy games performance",
        };
      case "Battery":
        return {
          icon: BatteryCharging,
          bg: "bg-amber-50",
          border: "border-amber-100",
          iconColor: "text-amber-600",
          hint: "Screen-on time, charging",
        };
      default:
        return {
          icon: Zap,
          bg: "bg-gray-50",
          border: "border-gray-100",
          iconColor: "text-gray-600",
          hint: "Overall performance",
        };
    }
  };

  const getScoreColor = (rating) => {
    if (rating >= 8) return "text-emerald-600";
    if (rating >= 6) return "text-blue-600";
    return "text-amber-600";
  };

  // Convert 5-point to 10-point scale, cap at 9.5 for realism
  const getScore10 = (rating) => {
    let score = rating <= 5 ? rating * 2 : rating;
    // Cap at 9.5 to avoid "too perfect" feeling
    if (score >= 10) score = 9.5;
    return score;
  };

  // Get stars count (1-5) from score
  const getStars = (rating) => {
    const score10 = getScore10(rating);
    return Math.round(score10 / 2);
  };

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Our Verdict
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on real-world usage, specs & price in UAE
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scores.map((score) => {
            const config = getCategoryConfig(score.label);
            const IconComponent = config.icon;
            const score10 = getScore10(score.rating);
            const starCount = getStars(score.rating);

            return (
              <div
                key={score.label}
                className="group flex items-center gap-3 bg-secondary/50 border border-border rounded-xl p-3 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                {/* Icon */}
                <span
                  className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${config.bg} ${config.border} border transition-transform duration-200 group-hover:scale-105`}
                >
                  <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {score.label}
                  </div>

                  {/* Micro-justification */}
                  <div className="text-[10px] text-muted-foreground mb-1">
                    {config.hint}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= starCount
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className={`text-lg font-bold ${getScoreColor(score10)}`}>
                  {score10}
                  <span className="text-muted-foreground text-xs font-medium">
                    /10
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
