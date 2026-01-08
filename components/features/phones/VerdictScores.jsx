/**
 * VerdictScores - Colorful score cards matching page design
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
  BatteryCharging,
  Sparkles
} from "lucide-react";

const SCORE_CONFIG = [
  { 
    key: "design", 
    label: "Design & Materials", 
    icon: Smartphone,
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    barColor: "bg-gradient-to-r from-violet-500 to-purple-500",
    goodAt: "premium build quality",
  },
  { 
    key: "performance", 
    label: "Performance", 
    icon: Cpu,
    gradient: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    barColor: "bg-gradient-to-r from-orange-500 to-red-500",
    goodAt: "smooth multitasking & gaming",
  },
  { 
    key: "camera", 
    label: "Camera", 
    icon: Camera,
    gradient: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    barColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    goodAt: "great photos & videos",
  },
  { 
    key: "connectivity", 
    label: "Connectivity", 
    icon: Wifi,
    gradient: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-500",
    barColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
    goodAt: "fast 5G & WiFi 6",
  },
  { 
    key: "battery", 
    label: "Battery", 
    icon: BatteryCharging,
    gradient: "from-emerald-500 to-green-500",
    bgLight: "bg-emerald-50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
    barColor: "bg-gradient-to-r from-emerald-500 to-green-500",
    goodAt: "all-day power",
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

export default function VerdictScores({ scores }) {
  if (!scores) return null;

  // Calculate overall average
  const validScores = Object.values(scores).filter(s => s !== null && s !== undefined);
  const avgScore = validScores.length > 0 
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : 0;

  return (
    <section className="mb-6 md:mb-8">
      {/* Card Container */}
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Our Verdict</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall</span>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full">
                <span className="text-lg font-bold">{avgScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Cards Grid */}
        <div className="p-4 md:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {SCORE_CONFIG.map((config) => {
              const score = scores[config.key] || 0;
              const Icon = config.icon;
              const percentage = (score / 10) * 100;
              const label = getScoreLabel(score);
              
              return (
                <div 
                  key={config.key} 
                  className={`${config.bgLight} rounded-xl p-4 border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Icon & Score Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {Number(score).toFixed(1)}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                        {label}
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-semibold text-foreground mb-2">
                    {config.label}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 bg-white/80 rounded-full overflow-hidden mb-2 shadow-inner">
                    <div 
                      className={`h-full ${config.barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {/* Context */}
                  {score >= 7 && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      {config.goodAt}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Legend */}
        <div className="px-5 py-3 border-t border-border bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm"></span>
              8+ Excellent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></span>
              7-8 Good
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm"></span>
              6-7 Average
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-sm"></span>
              &lt;6 Weak
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
