"use client";

import { Search } from "lucide-react";

export default function FiltersPanel({
  searchQuery,
  setSearchQuery,
  activeBrand,
  setActiveBrand,
  activeBudget,
  setActiveBudget,
  activeGoal,
  setActiveGoal,
  displayBrands,
  budgetRanges,
  goalFilters,
}) {
  return (
    <section className="py-4 md:py-5 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl border border-border p-4 md:p-5">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">
              Brand:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {displayBrands.map((brand) => {
                const isActive =
                  activeBrand.toLowerCase() === brand.toLowerCase();
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setActiveBrand(isActive ? "" : brand)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 hover:bg-muted text-foreground"
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">
              Budget:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {budgetRanges.slice(1).map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() =>
                    setActiveBudget(
                      activeBudget.label === range.label
                        ? budgetRanges[0]
                        : range
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeBudget.label === range.label
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 hover:bg-muted text-foreground"
                  }`}
                >
                  {range.short}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">
              For:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {goalFilters.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() =>
                    setActiveGoal(activeGoal === goal.id ? "" : goal.id)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeGoal === goal.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 hover:bg-muted text-foreground"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
