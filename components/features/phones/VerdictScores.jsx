/**
 * VerdictScores - Clean score cards matching page design
 * 
 * Fixed categories:
 * 1. Design & Materials
 * 2. Performance & Hardware
 * 3. Camera
 * 4. Connectivity
 * 5. Battery
 */
import { 
  Smartphone, 
  Cpu, 
  Camera, 
  Wifi, 
  BatteryCharging
} from "lucide-react";

const SCORE_CONFIG = [
  { 
    key: "design", 
    label: "Design & Materials", 
    icon: Smartphone,
  },
  { 
    key: "performance", 
    label: "Performance", 
    icon: Cpu,
  },
  { 
    key: "camera", 
    label: "Camera", 
    icon: Camera,
  },
  { 
    key: "connectivity", 
    label: "Connectivity", 
    icon: Wifi,
  },
  { 
    key: "battery", 
    label: "Battery", 
    icon: BatteryCharging,
  },
];

// Get score label
const getScoreLabel = (score) => {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 6) return "Average";
  return "Below Avg";
};

// Get dynamic feedback based on category and score
const getScoreFeedback = (key, score) => {
  const feedback = {
    design: {
      high: "premium build quality",
      mid: "decent build quality",
      low: "basic build quality",
    },
    performance: {
      high: "smooth multitasking & gaming",
      mid: "handles daily tasks well",
      low: "may lag with heavy apps",
    },
    camera: {
      high: "great photos & videos",
      mid: "decent photo quality",
      low: "basic camera performance",
    },
    connectivity: {
      high: "fast 5G & WiFi 6",
      mid: "reliable connectivity",
      low: "limited network options",
    },
    battery: {
      high: "all-day power",
      mid: "lasts most of the day",
      low: "needs frequent charging",
    },
  };

  const category = feedback[key];
  if (!category) return null;

  if (score >= 8) return category.high;
  if (score >= 6) return category.mid;
  return category.low;
};

export default function VerdictScores({ scores }) {
  if (!scores) return null;

  // Calculate overall average
  const validScores = Object.values(scores).filter(s => s !== null && s !== undefined);
  const avgScore = validScores.length > 0 
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : 0;

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Our Verdict
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall</span>
            <span className="text-base font-bold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-lg">
              {avgScore}
            </span>
          </div>
        </div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SCORE_CONFIG.map((config) => {
            const score = scores[config.key] || 0;
            const Icon = config.icon;
            const percentage = (score / 10) * 100;
            const label = getScoreLabel(score);
            
            return (
              <div 
                key={config.key} 
                className="bg-secondary/50 border border-border rounded-xl p-3 md:p-4"
              >
                {/* Icon & Score Row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center border border-border">
                    <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      {Number(score).toFixed(1)}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                      {label}
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <div className="text-xs font-medium text-foreground mb-2">
                  {config.label}
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 bg-border rounded-full overflow-hidden mb-1.5">
                  <div 
                    className="h-full bg-primary/60 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {/* Context */}
                {getScoreFeedback(config.key, score) && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className={score >= 7 ? "text-primary" : "text-muted-foreground"}>
                      {score >= 7 ? "✓" : "•"}
                    </span>
                    {getScoreFeedback(config.key, score)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
