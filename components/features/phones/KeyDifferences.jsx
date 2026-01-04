/**
 * Key Differences - The ONLY explanation area
 * 2x2 grid (desktop), vertical stack (mobile)
 * Talk about experience, not specs
 * Plain English heading: "How This Phone Feels in Real Use"
 */
import { BatteryCharging, Camera, Monitor, Zap } from "lucide-react";

export default function KeyDifferences({ differences }) {
  const getDiffConfig = (title) => {
    switch (title) {
      case "Performance":
        return {
          icon: Zap,
          bg: "bg-amber-50",
          border: "border-amber-100",
          iconColor: "text-amber-600",
        };
      case "Camera":
        return {
          icon: Camera,
          bg: "bg-purple-50",
          border: "border-purple-100",
          iconColor: "text-purple-600",
        };
      case "Battery Life":
        return {
          icon: BatteryCharging,
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          iconColor: "text-emerald-600",
        };
      case "Display":
        return {
          icon: Monitor,
          bg: "bg-blue-50",
          border: "border-blue-100",
          iconColor: "text-blue-600",
        };
      default:
        return {
          icon: Zap,
          bg: "bg-gray-50",
          border: "border-gray-100",
          iconColor: "text-gray-600",
        };
    }
  };

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Real-World Experience
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {differences.map((diff, index) => {
            const config = getDiffConfig(diff.title);
            const IconComponent = config.icon;
            return (
              <div
                key={index}
                className="group bg-secondary/50 border border-border rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${config.bg} ${config.border} border transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                  </span>
                  <h3 className="font-semibold text-foreground pt-1.5">
                    {diff.title}
                  </h3>
                </div>
                <ul className="space-y-2 ml-1">
                  {diff.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/60 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
