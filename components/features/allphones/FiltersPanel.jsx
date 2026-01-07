"use client";

import { Search, ChevronDown, X } from "lucide-react";
import { useState } from "react";

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
  const [expandedFilter, setExpandedFilter] = useState(null);
  
  // Count active filters
  const activeFilterCount = [
    activeBrand ? 1 : 0,
    activeBudget.label !== "Any Budget" ? 1 : 0,
    activeGoal ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const toggleFilter = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  return (
    <section className="py-4 md:py-5 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl border border-border p-3 md:p-5">
          {/* Search - Always visible */}
          <div className="relative mb-3 md:mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile: Collapsible filter chips */}
          <div className="md:hidden">
            {/* Active filters summary */}
            <div className="flex flex-wrap gap-2 mb-3">
              {activeBrand && (
                <button
                  type="button"
                  onClick={() => setActiveBrand("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {activeBrand}
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeBudget.label !== "Any Budget" && (
                <button
                  type="button"
                  onClick={() => setActiveBudget(budgetRanges[0])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {activeBudget.short}
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeGoal && (
                <button
                  type="button"
                  onClick={() => setActiveGoal("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {goalFilters.find(g => g.id === activeGoal)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
              <button
                type="button"
                onClick={() => toggleFilter("brand")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  expandedFilter === "brand" || activeBrand
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                Brand
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedFilter === "brand" ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => toggleFilter("budget")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  expandedFilter === "budget" || activeBudget.label !== "Any Budget"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                Budget
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedFilter === "budget" ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => toggleFilter("goal")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  expandedFilter === "goal" || activeGoal
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                For
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedFilter === "goal" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Expanded filter options */}
            {expandedFilter === "brand" && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex flex-wrap gap-1.5">
                  {displayBrands.map((brand) => {
                    const isActive = activeBrand.toLowerCase() === brand.toLowerCase();
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setActiveBrand(isActive ? "" : brand);
                          setExpandedFilter(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {expandedFilter === "budget" && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex flex-wrap gap-1.5">
                  {budgetRanges.slice(1).map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        setActiveBudget(activeBudget.label === range.label ? budgetRanges[0] : range);
                        setExpandedFilter(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeBudget.label === range.label
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {range.short}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {expandedFilter === "goal" && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex flex-wrap gap-1.5">
                  {goalFilters.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        setActiveGoal(activeGoal === goal.id ? "" : goal.id);
                        setExpandedFilter(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeGoal === goal.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Full filter rows */}
          <div className="hidden md:block space-y-3">
            <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-3">
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
      </div>
    </section>
  );
}
