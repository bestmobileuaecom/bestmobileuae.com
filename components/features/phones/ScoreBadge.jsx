/**
 * Score Badge - Animated ring component showing expert score
 */

export function getScoreTextColor(score) {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6) return "text-amber-600";
  return "text-gray-600";
}

export function getScoreLabel(score, customLabel) {
  if (customLabel) return customLabel;
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 6) return "Good";
  return "Average";
}

export default function ScoreBadge({
  score,
  size = "md",
  gradientId = "scoreGradient",
  className = "",
}) {
  const numScore = parseFloat(score?.rating || score?.overall || 0);
  const scoreLabel = getScoreLabel(numScore, score?.label);

  const sizes = {
    sm: {
      ring: "w-11 h-11",
      text: "text-base",
      label: "text-sm",
      sub: "text-[10px]",
    },
    md: {
      ring: "w-14 h-14",
      text: "text-lg",
      label: "text-sm",
      sub: "text-[11px]",
    },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      <div className="relative">
        <svg className={`${s.ring} -rotate-90`} viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(numScore / 10) * 126} 126`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                className={
                  numScore >= 8
                    ? "text-emerald-500"
                    : numScore >= 6
                    ? "text-amber-500"
                    : "text-gray-400"
                }
                stopColor="currentColor"
              />
              <stop
                offset="100%"
                className={
                  numScore >= 8
                    ? "text-teal-500"
                    : numScore >= 6
                    ? "text-orange-500"
                    : "text-gray-500"
                }
                stopColor="currentColor"
              />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${s.text} font-bold text-foreground`}>
            {numScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="leading-tight">
        <div
          className={`${s.label} font-semibold ${getScoreTextColor(numScore)}`}
        >
          {scoreLabel}
        </div>
        <div className={`${s.sub} text-muted-foreground`}>Expert Score</div>
      </div>
    </div>
  );
}
