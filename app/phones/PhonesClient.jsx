"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { allPhones, getBrands } from "@/lib/phones-data";
import FiltersPanel from "@/components/features/allphones/FiltersPanel";
import PhonesGrid from "@/components/features/allphones/PhonesGrid";
import CompareBar from "@/components/features/allphones/CompareBar";

const budgetRanges = [
  { label: "Any Budget", short: "Any", min: 0, max: 999999, title: "" },
  {
    label: "Under 1,500",
    short: "Budget",
    min: 0,
    max: 1500,
    title: "Best Budget Phones Under AED 1,500",
  },
  {
    label: "1,500 - 3,000",
    short: "Best Value",
    min: 1500,
    max: 3000,
    title: "Best Value Phones (AED 1,500 - 3,000)",
  },
  {
    label: "3,000 - 5,000",
    short: "Premium",
    min: 3000,
    max: 5000,
    title: "Best Premium Phones (AED 3,000 - 5,000)",
  },
  {
    label: "Above 5,000",
    short: "Flagship",
    min: 5000,
    max: 999999,
    title: "Best Flagship Phones (AED 5,000+)",
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
  {
    id: "updates",
    label: "🔄 Long Updates",
    title: "Phones with Longest Software Support",
    subtitle: "5+ years of updates guaranteed",
  },
];

export default function PhonesClient() {
  const searchParams = useSearchParams();
  const brands = getBrands();

  const initialBrand = searchParams.get("brand") || "";

  const [activeBrand, setActiveBrand] = useState(initialBrand);
  const [activeGoal, setActiveGoal] = useState("");
  const [activeBudget, setActiveBudget] = useState(budgetRanges[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [comparePhones, setComparePhones] = useState([]);
  const [showAllPhones, setShowAllPhones] = useState(false);

  useEffect(() => {
    const brandFromUrl = searchParams.get("brand") || "";
    if (brandFromUrl !== activeBrand) {
      setActiveBrand(brandFromUrl);
    }
  }, [searchParams, activeBrand]);

  const toggleCompare = (phone) => {
    if (comparePhones.find((p) => p.id === phone.id)) {
      setComparePhones(comparePhones.filter((p) => p.id !== phone.id));
    } else if (comparePhones.length < 3) {
      setComparePhones([...comparePhones, phone]);
    }
  };

  const filteredPhones = useMemo(() => {
    let result = [...allPhones];

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (phone) =>
          phone.name.toLowerCase().includes(searchLower) ||
          phone.brand.toLowerCase().includes(searchLower)
      );
    }

    if (activeBrand) {
      result = result.filter(
        (phone) => phone.brand.toLowerCase() === activeBrand.toLowerCase()
      );
    }

    if (activeGoal) {
      result = result.filter((phone) => phone.bestFor?.includes(activeGoal));
    }

    result = result.filter(
      (phone) => phone.price >= activeBudget.min && phone.price <= activeBudget.max
    );

    if (activeBudget.label !== "Any Budget") {
      result.sort((a, b) => (b.scores?.value || 0) - (a.scores?.value || 0));
    } else {
      result.sort(
        (a, b) => (b.overallScore?.rating || 0) - (a.overallScore?.rating || 0)
      );
    }

    return result;
  }, [searchQuery, activeBrand, activeGoal, activeBudget]);

  const hasActiveFilter =
    activeBrand || activeGoal || activeBudget.label !== "Any Budget";

  const topBrands = ["Samsung", "Apple", "Xiaomi", "Google", "OnePlus", "OPPO"];
  const displayBrands = topBrands.filter((b) => brands.includes(b));

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
