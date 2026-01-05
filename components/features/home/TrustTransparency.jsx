import { Shield, CheckCircle2, TrendingUp, Heart, Award } from "lucide-react";

const trustPoints = [
  { 
    icon: CheckCircle2, 
    title: "Verified Specs",
    text: "Data from official sources"
  },
  { 
    icon: TrendingUp, 
    title: "Real-world Scores",
    text: "Based on actual performance"
  },
  { 
    icon: Shield, 
    title: "No Paid Rankings",
    text: "100% unbiased reviews"
  },
  { 
    icon: Heart, 
    title: "Made for UAE",
    text: "Local prices & availability"
  },
];

export default function TrustTransparency() {
  return (
    <section className="py-6 md:py-8 pb-10 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header - Left aligned like other sections */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Why Trust Us?</h2>
                    <p className="text-sm text-muted-foreground">Your trusted source for phone reviews in UAE</p>
                  </div>
                </div>
              </div>

              {/* Trust Points Grid - Horizontal layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground mb-0.5">{point.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{point.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
