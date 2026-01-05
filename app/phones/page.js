"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Star,
  ArrowRight,
  X,
  Smartphone,
  RotateCcw,
  Check,
  Battery,
  Camera,
  Gamepad2,
  RefreshCw,
  BadgeDollarSign,
  GitCompare,
  Zap,
  Award,
  ChevronRight,
  Shield,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { allPhones, getBrands } from "@/lib/phones-data";

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const budgetRanges = [
  { label: "Any Budget", short: "Any", min: 0, max: 999999, title: "" },
  { label: "Under 1,500", short: "Budget", min: 0, max: 1500, title: "Best Budget Phones Under AED 1,500" },
  { label: "1,500 - 3,000", short: "Best Value", min: 1500, max: 3000, title: "Best Value Phones (AED 1,500 - 3,000)" },
  { label: "3,000 - 5,000", short: "Premium", min: 3000, max: 5000, title: "Best Premium Phones (AED 3,000 - 5,000)" },
  { label: "Above 5,000", short: "Flagship", min: 5000, max: 999999, title: "Best Flagship Phones (AED 5,000+)" },
];

const goalFilters = [
  { id: "camera", label: "📸 Best Camera", title: "Best Camera Phones in UAE", subtitle: "Ranked by photography & video quality" },
  { id: "battery", label: "🔋 Long Battery", title: "Best Battery Life Phones in UAE", subtitle: "All-day battery champions" },
  { id: "gaming", label: "🎮 Gaming", title: "Best Gaming Phones in UAE", subtitle: "Thermal + Performance Ranked" },
  { id: "value", label: "💰 Best Value", title: "Best Value Phones in UAE", subtitle: "Maximum specs for your money" },
  { id: "updates", label: "🔄 Long Updates", title: "Phones with Longest Software Support", subtitle: "5+ years of updates guaranteed" },
];

// Score to label mapping
const getScoreLabel = (score) => {
  if (score >= 9.0) return { label: "Best in Class", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" };
  if (score >= 8.0) return { label: "Excellent", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" };
  if (score >= 7.0) return { label: "Very Good", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" };
  return { label: "Good", color: "text-slate-600 bg-slate-50 dark:bg-slate-900/30" };
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Dynamic Page Header - Changes based on active filter (compact, left-aligned)
function DynamicHeader({ activeBrand, activeGoal, activeBudget, phoneCount }) {
  // Brand-specific header
  if (activeBrand) {
    return (
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">
          {activeBrand} Phones in UAE
        </h1>
        <p className="text-xs text-muted-foreground">
          {phoneCount} phones • Flagship to budget
        </p>
      </div>
    );
  }

  // Goal-specific header
  if (activeGoal) {
    const goal = goalFilters.find((g) => g.id === activeGoal);
    return (
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">
          {goal?.title || "Best Phones in UAE"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {phoneCount} phones • {goal?.subtitle || "Expert-ranked"}
        </p>
      </div>
    );
  }

  // Budget-specific header
  if (activeBudget && activeBudget.title) {
    return (
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">
          {activeBudget.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          {phoneCount} phones • Sorted by value
        </p>
      </div>
    );
  }

  // Default header
  return (
    <div>
      <h1 className="text-lg md:text-xl font-bold text-foreground">
        Find the Best Phone for You
      </h1>
      <p className="text-xs text-muted-foreground">
        Compare UAE prices • Expert scores • Honest verdicts
      </p>
    </div>
  );
}

// Active Filter Chips - Shows what's selected
function ActiveFilterChips({ activeBrand, setActiveBrand, activeGoal, setActiveGoal, activeBudget, setActiveBudget, defaultBudget }) {
  const hasFilters = activeBrand || activeGoal || (activeBudget && activeBudget.label !== "Any Budget");

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {activeBrand && (
        <button
          type="button"
          onClick={() => setActiveBrand("")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {activeBrand}
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      
      {activeGoal && (
        <button
          type="button"
          onClick={() => setActiveGoal("")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {goalFilters.find((g) => g.id === activeGoal)?.label}
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      
      {activeBudget && activeBudget.label !== "Any Budget" && (
        <button
          type="button"
          onClick={() => setActiveBudget(defaultBudget)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {activeBudget.label}
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// Phone Card - Decision-focused
function PhoneCard({ phone, onCompare, isInCompare, rank }) {
  const score = phone.overallScore?.rating || 8.0;
  const scoreInfo = getScoreLabel(score);

  return (
    <div className="group bg-card rounded-2xl border border-border/60 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Rank Badge (if ranked) */}
      {rank && (
        <div className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-xs font-bold shadow-md">
          #{rank}
        </div>
      )}

      {/* Top: Badge + Score */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${scoreInfo.color}`}>
          ⭐ {scoreInfo.label}
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-36 mx-auto mt-2">
        {phone.image ? (
          <Image
            src={phone.image}
            alt={phone.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Smartphone className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <p className="text-xs text-muted-foreground font-medium">{phone.brand}</p>
        <h3 className="font-bold text-foreground text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          {phone.name}
        </h3>

        {/* Why pick this */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-2 line-clamp-2">
          {phone.whyPick}
        </p>

        {/* Good for - 1 liner */}
        <p className="text-xs text-primary font-medium mb-3">
          Good for: {phone.bestFor?.slice(0, 2).map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(", ") || "Everyday use"}
        </p>

        {/* Pros */}
        <div className="space-y-1 mb-4">
          {phone.pros?.slice(0, 2).map((pro, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-muted-foreground">{pro}</span>
            </div>
          ))}
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-base font-semibold text-foreground">{phone.priceRange}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onCompare(phone);
              }}
              className={`p-2 rounded-lg border transition-colors ${
                isInCompare
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground"
              }`}
              title={isInCompare ? "Remove from compare" : "Add to compare"}
            >
              <GitCompare className="w-4 h-4" />
            </button>
            <Link
              href={`/phones/${phone.slug}`}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compare Bar
function CompareBar({ phones, onRemove, onClear }) {
  if (phones.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GitCompare className="w-5 h-5 text-primary" />
              <span>Compare ({phones.length}/3)</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {phones.map((phone) => (
                <div key={phone.id} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
                  <span className="font-medium truncate max-w-24">{phone.name}</span>
                  <button type="button" onClick={() => onRemove(phone.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground">
              Clear
            </button>
            <Link
              href={`/compare?phones=${phones.map((p) => p.slug).join(",")}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                phones.length >= 2
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Compare Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

export default function PhonesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const brands = getBrands();
  
  // Get initial brand from URL params
  const initialBrand = searchParams.get("brand") || "";
  
  const [activeBrand, setActiveBrand] = useState(initialBrand);
  const [activeGoal, setActiveGoal] = useState("");
  const [activeBudget, setActiveBudget] = useState(budgetRanges[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [comparePhones, setComparePhones] = useState([]);
  const [showAllPhones, setShowAllPhones] = useState(false);

  // Sync URL params with state when URL changes
  useEffect(() => {
    const brandFromUrl = searchParams.get("brand") || "";
    if (brandFromUrl !== activeBrand) {
      setActiveBrand(brandFromUrl);
    }
  }, [searchParams]);

  const toggleCompare = (phone) => {
    if (comparePhones.find((p) => p.id === phone.id)) {
      setComparePhones(comparePhones.filter((p) => p.id !== phone.id));
    } else if (comparePhones.length < 3) {
      setComparePhones([...comparePhones, phone]);
    }
  };

  // Filter and sort phones
  const filteredPhones = useMemo(() => {
    let result = [...allPhones];

    // Search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (phone) =>
          phone.name.toLowerCase().includes(searchLower) ||
          phone.brand.toLowerCase().includes(searchLower)
      );
    }

    // Brand filter (case-insensitive for URL params)
    if (activeBrand) {
      result = result.filter((phone) => phone.brand.toLowerCase() === activeBrand.toLowerCase());
    }

    // Goal filter
    if (activeGoal) {
      result = result.filter((phone) => phone.bestFor?.includes(activeGoal));
    }

    // Budget filter
    result = result.filter(
      (phone) => phone.price >= activeBudget.min && phone.price <= activeBudget.max
    );

    // Sort - If budget selected, sort by value; otherwise by overall rating
    if (activeBudget.label !== "Any Budget") {
      result.sort((a, b) => (b.scores?.value || 0) - (a.scores?.value || 0));
    } else {
      result.sort((a, b) => (b.overallScore?.rating || 0) - (a.overallScore?.rating || 0));
    }

    return result;
  }, [searchQuery, activeBrand, activeGoal, activeBudget]);

  // Determine if we're in a filtered state
  const hasActiveFilter = activeBrand || activeGoal || activeBudget.label !== "Any Budget";

  // Get brand list for filter
  const topBrands = ["Samsung", "Apple", "Xiaomi", "Google", "OnePlus", "OPPO"];
  const displayBrands = topBrands.filter((b) => brands.includes(b));

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-24">
      {/* Hero Section - SIMPLE VERTICAL: Search → Brand → Budget → For */}
      <section className="py-4 md:py-5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          {/* Clean Filter Card */}
          <div className="bg-card rounded-xl border border-border p-4 md:p-5">
            {/* Row 1: Search */}
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

            {/* Row 2: Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">Brand:</span>
              <div className="flex flex-wrap gap-1.5">
                {displayBrands.map((brand) => {
                  const isActive = activeBrand.toLowerCase() === brand.toLowerCase();
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

            {/* Row 3: Budget */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">Budget:</span>
              <div className="flex flex-wrap gap-1.5">
                {budgetRanges.slice(1).map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => setActiveBudget(activeBudget.label === range.label ? budgetRanges[0] : range)}
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

            {/* Row 4: For (Goals) */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">For:</span>
              <div className="flex flex-wrap gap-1.5">
                {goalFilters.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setActiveGoal(activeGoal === goal.id ? "" : goal.id)}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Phone Grid / Results */}
        <div className="mt-8">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">
              {hasActiveFilter ? `Showing ${filteredPhones.length} phones` : "Explore All Phones"}
            </h2>
            {!hasActiveFilter && filteredPhones.length > 6 && !showAllPhones && (
              <button
                type="button"
                onClick={() => setShowAllPhones(true)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all {filteredPhones.length} phones
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Phone Grid */}
          {filteredPhones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(hasActiveFilter || showAllPhones ? filteredPhones : filteredPhones.slice(0, 6)).map((phone, index) => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  onCompare={toggleCompare}
                  isInCompare={comparePhones.some((p) => p.id === phone.id)}
                  rank={hasActiveFilter ? index + 1 : null}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Smartphone className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No phones match your criteria</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveBrand("");
                  setActiveGoal("");
                  setActiveBudget(budgetRanges[0]);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}

          {/* Show All Button (if not filtered and not showing all) */}
          {!hasActiveFilter && !showAllPhones && filteredPhones.length > 6 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllPhones(true)}
                className="px-8"
              >
                Show All {filteredPhones.length} Phones
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      <CompareBar
        phones={comparePhones}
        onRemove={(id) => setComparePhones(comparePhones.filter((p) => p.id !== id))}
        onClear={() => setComparePhones([])}
      />
    </div>
  );
}
