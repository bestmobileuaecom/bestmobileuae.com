"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FiltersPanel from "@/components/features/allphones/FiltersPanel";
import PhonesGrid from "@/components/features/allphones/PhonesGrid";
import CompareBar from "@/components/features/allphones/CompareBar";

const budgetRanges = [
  { label: "Any Budget", short: "Any", min: 0, max: 999999, title: "" },
  {
    label: "Under 500",
    short: "Under 500",
    min: 0,
    max: 500,
    title: "Best Budget Phones Under AED 500",
  },
  {
    label: "Under 1,000",
    short: "Under 1K",
    min: 0,
    max: 1000,
    title: "Best Phones Under AED 1,000",
  },
  {
    label: "Under 1,500",
    short: "Under 1.5K",
    min: 0,
    max: 1500,
    title: "Best Budget Phones Under AED 1,500",
  },
  {
    label: "Under 2,000",
    short: "Under 2K",
    min: 0,
    max: 2000,
    title: "Best Phones Under AED 2,000",
  },
  {
    label: "Under 3,000",
    short: "Under 3K",
    min: 0,
    max: 3000,
    title: "Best Value Phones Under AED 3,000",
  },
  {
    label: "Above 3,000",
    short: "3K+",
    min: 3000,
    max: 999999,
    title: "Best Flagship Phones (AED 3,000+)",
  },
];

const goalFilters = [
  {
    id: "camera",
    label: "📸 Best Camera",
    title: "Best Camera Phones in UAE",
    subtitle: "Ranked by photography & video quality",
  },
  {
    id: "battery",
    label: "🔋 Long Battery",
    title: "Best Battery Life Phones in UAE",
    subtitle: "All-day battery champions",
  },
  {
    id: "gaming",
    label: "🎮 Gaming",
    title: "Best Gaming Phones in UAE",
    subtitle: "Thermal + Performance Ranked",
  },
  {
    id: "value",
    label: "💰 Best Value",
    title: "Best Value Phones in UAE",
    subtitle: "Maximum specs for your money",
  },
];

// Helper to find budget range from URL param
function getBudgetFromUrl(budgetParam, maxPriceParam) {
  // Handle maxPrice param (direct price value)
  if (maxPriceParam) {
    const maxPrice = Number.parseInt(maxPriceParam, 10);
    if (!Number.isNaN(maxPrice)) {
      // Find matching budget range or create custom one
      const match = budgetRanges.find((b) => b.max === maxPrice);
      if (match) return match;
      // Return custom budget range for slider values
      return {
        label: `Under ${maxPrice.toLocaleString()}`,
        short: "Custom",
        min: 0,
        max: maxPrice,
        title: `Best Phones Under AED ${maxPrice.toLocaleString()}`,
      };
    }
  }

  // Handle budget param from BudgetFinderCard
  if (budgetParam) {
    if (budgetParam === "flagship") {
      return budgetRanges.find((b) => b.min === 5000) || budgetRanges[4];
    }
    const maxPrice = Number.parseInt(budgetParam, 10);
    if (!Number.isNaN(maxPrice)) {
      // Find matching or create custom
      const match = budgetRanges.find((b) => b.max === maxPrice && b.min === 0);
      if (match) return match;
      return {
        label: `Under ${maxPrice.toLocaleString()}`,
        short: "Custom",
        min: 0,
        max: maxPrice,
        title: `Best Phones Under AED ${maxPrice.toLocaleString()}`,
      };
    }
  }

  return budgetRanges[0]; // Default: Any Budget
}

// Helper to map priority param to goal
function getGoalFromUrl(priorityParam) {
  if (!priorityParam) return "";
  const goalMap = {
    camera: "camera",
    battery: "battery",
    gaming: "gaming",
    display: "value", // Map display to value or handle separately
    value: "value",
  };
  return goalMap[priorityParam.toLowerCase()] || "";
}

export default function PhonesClient() {
  const searchParams = useSearchParams();

  const [phones, setPhones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize state from URL params
  const [activeBrand, setActiveBrand] = useState(() => searchParams.get("brand") || "");
  const [activeGoal, setActiveGoal] = useState(() => getGoalFromUrl(searchParams.get("priority")));
  const [activeBudget, setActiveBudget] = useState(() => 
    getBudgetFromUrl(searchParams.get("budget"), searchParams.get("maxPrice"))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [comparePhones, setComparePhones] = useState([]);
  const [showAllPhones, setShowAllPhones] = useState(false);

  // Fetch phones from API
  useEffect(() => {
    async function fetchPhones() {
      try {
        const res = await fetch("/api/phones");
        const data = await res.json();
        if (data.phones) {
          setPhones(data.phones);
          // Extract unique brands
          const uniqueBrands = [...new Set(data.phones.map((p) => p.brand).filter(Boolean))];
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error("Error fetching phones:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhones();
  }, []);

  // Sync state with URL params when they change
  useEffect(() => {
    const brandFromUrl = searchParams.get("brand") || "";
    const priorityFromUrl = searchParams.get("priority") || "";
    const budgetFromUrl = searchParams.get("budget") || "";
    const maxPriceFromUrl = searchParams.get("maxPrice") || "";

    if (brandFromUrl !== activeBrand) {
      setActiveBrand(brandFromUrl);
    }

    const goalFromUrl = getGoalFromUrl(priorityFromUrl);
    if (goalFromUrl !== activeGoal) {
      setActiveGoal(goalFromUrl);
    }

    const budgetObjFromUrl = getBudgetFromUrl(budgetFromUrl, maxPriceFromUrl);
    if (budgetObjFromUrl.max !== activeBudget.max || budgetObjFromUrl.min !== activeBudget.min) {
      setActiveBudget(budgetObjFromUrl);
    }
  }, [searchParams]);

  const toggleCompare = (phone) => {
    if (comparePhones.find((p) => p.id === phone.id)) {
      setComparePhones(comparePhones.filter((p) => p.id !== phone.id));
    } else if (comparePhones.length < 3) {
      setComparePhones([...comparePhones, phone]);
    }
  };

  const filteredPhones = useMemo(() => {
    let result = [...phones];

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (phone) =>
          phone.name.toLowerCase().includes(searchLower) ||
          (phone.brand && phone.brand.toLowerCase().includes(searchLower))
      );
    }

    if (activeBrand) {
      result = result.filter(
        (phone) => phone.brand && phone.brand.toLowerCase() === activeBrand.toLowerCase()
      );
    }

    if (activeGoal) {
      // Sort by relevant score based on goal
      if (activeGoal === "camera") {
        result = result.filter((p) => p.scores?.camera >= 7);
        result.sort((a, b) => (b.scores?.camera || 0) - (a.scores?.camera || 0));
      } else if (activeGoal === "battery") {
        result = result.filter((p) => p.scores?.battery >= 7);
        result.sort((a, b) => (b.scores?.battery || 0) - (a.scores?.battery || 0));
      } else if (activeGoal === "gaming") {
        result = result.filter((p) => p.scores?.performance >= 7);
        result.sort((a, b) => (b.scores?.performance || 0) - (a.scores?.performance || 0));
      } else if (activeGoal === "value") {
        result = result.filter((p) => p.scores?.value >= 7);
        result.sort((a, b) => (b.scores?.value || 0) - (a.scores?.value || 0));
      }
    }

    result = result.filter(
      (phone) => phone.price >= activeBudget.min && phone.price <= activeBudget.max
    );

    if (!activeGoal) {
      if (activeBudget.label !== "Any Budget") {
        result.sort((a, b) => (b.scores?.value || 0) - (a.scores?.value || 0));
      } else {
        result.sort(
          (a, b) => (b.overallScore?.rating || 0) - (a.overallScore?.rating || 0)
        );
      }
    }

    return result;
  }, [phones, searchQuery, activeBrand, activeGoal, activeBudget]);

  const hasActiveFilter =
    activeBrand || activeGoal || activeBudget.label !== "Any Budget";

  const topBrands = ["Samsung", "Apple", "Xiaomi", "Google", "OnePlus", "Nothing", "Realme"];
  const displayBrands = topBrands.filter((b) => brands.some((brand) => brand?.toLowerCase() === b.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading phones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-24">
      <FiltersPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeBrand={activeBrand}
        setActiveBrand={setActiveBrand}
        activeBudget={activeBudget}
        setActiveBudget={setActiveBudget}
        activeGoal={activeGoal}
        setActiveGoal={setActiveGoal}
        displayBrands={displayBrands}
        budgetRanges={budgetRanges}
        goalFilters={goalFilters}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <PhonesGrid
          phones={filteredPhones}
          hasActiveFilter={hasActiveFilter}
          showAllPhones={showAllPhones}
          onShowAll={() => setShowAllPhones(true)}
          toggleCompare={toggleCompare}
          comparePhones={comparePhones}
          onReset={() => {
            setSearchQuery("");
            setActiveBrand("");
            setActiveGoal("");
            setActiveBudget(budgetRanges[0]);
          }}
        />
      </div>

      <CompareBar
        phones={comparePhones}
        onRemove={(id) => setComparePhones(comparePhones.filter((p) => p.id !== id))}
        onClear={() => setComparePhones([])}
      />
    </div>
  );
}
