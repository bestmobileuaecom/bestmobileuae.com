/**
 * Compare Page Utilities
 * Helper functions for phone comparison logic
 */

/**
 * Generate comparison verdict based on phone scores
 */
export function generateComparisonVerdict(phones) {
  if (phones.length < 2) return null;

  const categories = ["camera", "battery", "performance", "display", "value"];
  const verdict = {};

  for (const category of categories) {
    let winnerPhone = null;
    let maxScore = -1;

    for (const phone of phones) {
      const score = phone.scores?.[category] || 0;
      if (score > maxScore) {
        maxScore = score;
        winnerPhone = phone;
      }
    }

    verdict[category] = { 
      winner: winnerPhone?.name || winnerPhone?.slug, 
      winnerSlug: winnerPhone?.slug,
      score: maxScore 
    };
  }

  // Overall winner by total score
  let overallWinnerPhone = null;
  let maxTotal = -1;

  for (const phone of phones) {
    const total = categories.reduce(
      (sum, cat) => sum + (phone.scores?.[cat] || 0),
      0
    );
    if (total > maxTotal) {
      maxTotal = total;
      overallWinnerPhone = phone;
    }
  }

  // Generate reason based on category wins
  const categoryWinCount = categories.filter(
    cat => verdict[cat]?.winnerSlug === overallWinnerPhone?.slug
  ).length;
  
  let reason = "";
  if (categoryWinCount >= 4) {
    reason = "Dominates in almost every category";
  } else if (categoryWinCount >= 3) {
    reason = "Wins in most key categories";
  } else {
    reason = "Best overall balance of features and value";
  }

  verdict.overall = { 
    winnerSlug: overallWinnerPhone?.slug,
    winner: overallWinnerPhone?.name,
    reason,
    totalScore: maxTotal
  };

  return verdict;
}

/**
 * Get spec value from phone specs object
 */
export function getSpecValue(phone, ...keys) {
  if (!phone?.specs) return null;
  const specs = phone.specs;
  
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    const upperKey = key.charAt(0).toUpperCase() + key.slice(1);
    
    if (specs[key]) {
      if (typeof specs[key] === "object") {
        return Object.values(specs[key])[0];
      }
      return specs[key];
    }
    if (specs[lowerKey]) {
      return typeof specs[lowerKey] === "object" 
        ? Object.values(specs[lowerKey])[0] 
        : specs[lowerKey];
    }
    if (specs[upperKey]) {
      return typeof specs[upperKey] === "object" 
        ? Object.values(specs[upperKey])[0] 
        : specs[upperKey];
    }
  }
  return null;
}

/**
 * Find winner index in phones array
 */
export function findWinnerIndex(phones, verdict) {
  if (!verdict?.overall?.winnerSlug) return -1;
  return phones.findIndex(p => p.slug === verdict.overall.winnerSlug);
}

/**
 * Get comparison icon config
 */
export const COMPARISON_ICONS = {
  camera: { icon: "Camera", label: "Camera" },
  battery: { icon: "Battery", label: "Battery" },
  performance: { icon: "Cpu", label: "Performance" },
  display: { icon: "Monitor", label: "Display" },
  value: { icon: "Star", label: "Value" },
};
