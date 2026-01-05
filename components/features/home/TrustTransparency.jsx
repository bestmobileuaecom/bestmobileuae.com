import { Shield, CheckCircle2, TrendingUp, Heart } from "lucide-react";

const trustPoints = [
  { icon: CheckCircle2, text: "Verified specs" },
  { icon: TrendingUp, text: "Real-world scores" },
  { icon: Shield, text: "No paid rankings" },
  { icon: Heart, text: "Made for UAE" },
];

export default function TrustTransparency() {
  return (
    <section className="py-4 md:py-6 pb-8 md:pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Minimal inline trust badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <span className="text-sm text-muted-foreground">Why trust us?</span>
            <div className="flex flex-wrap justify-center gap-3">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 text-muted-foreground"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{point.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
