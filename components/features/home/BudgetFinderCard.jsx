"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ArrowRight, SlidersHorizontal, RotateCcw } from "lucide-react";

const budgetOptions = [
  { label: "Any budget", value: "" },
  { label: "Under 500 AED", value: "500" },
  { label: "Under 1,000 AED", value: "1000" },
  { label: "Under 1,500 AED", value: "1500" },
  { label: "Under 2,000 AED", value: "2000" },
  { label: "Under 3,000 AED", value: "3000" },
  { label: "Flagship (3K+ AED)", value: "flagship" },
];

const priorityOptions = [
  { label: "Balanced", value: "" },
  { label: "Camera", value: "camera" },
  { label: "Battery", value: "battery" },
  { label: "Gaming", value: "gaming" },
  { label: "Display", value: "display" },
];

const brandOptions = [
  { label: "Any brand", value: "" },
  { label: "Samsung", value: "samsung" },
  { label: "Apple", value: "apple" },
  { label: "Xiaomi", value: "xiaomi" },
  { label: "Realme", value: "realme" },
  { label: "OPPO", value: "oppo" },
  { label: "Vivo", value: "vivo" },
  { label: "OnePlus", value: "oneplus" },
];

function SelectDropdown({ label, options, value, onChange }) {
  return (
    <div className="relative flex-1">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-background border border-border rounded-xl px-3 py-2.5 pr-9 text-sm text-foreground
                     hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export default function BudgetFinderCard() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("");
  const [brand, setBrand] = useState("");

  const handleFind = () => {
    const params = new URLSearchParams();
    if (budget) params.set("budget", budget);
    if (priority) params.set("priority", priority);
    if (brand) params.set("brand", brand);

    const queryString = params.toString();
    router.push(`/phones${queryString ? `?${queryString}` : ""}`);
  };

  const handleReset = () => {
    setBudget("");
    setPriority("");
    setBrand("");
  };

  const hasFilters = !!(budget || priority || brand);

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container - Consistent with other sections */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Quick Phone Finder</h2>
                    <p className="text-sm text-muted-foreground">Pick a budget + what matters most</p>
                  </div>
                </div>

                {/* Reset */}
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasFilters}
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-border hover:bg-muted/40 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <SelectDropdown
                    label="Budget"
                    options={budgetOptions}
                    value={budget}
                    onChange={setBudget}
                  />
                </div>

                <div className="md:col-span-4">
                  <SelectDropdown
                    label="Priority"
                    options={priorityOptions}
                    value={priority}
                    onChange={setPriority}
                  />
                </div>

                <div className="md:col-span-4">
                  <SelectDropdown
                    label="Brand"
                    options={brandOptions}
                    value={brand}
                    onChange={setBrand}
                  />
                </div>

                {/* CTA row */}
                <div className="md:col-span-12 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Tip: leave Brand as "Any" to see best value phones in your budget.
                  </p>

                  <button
                    type="button"
                    onClick={handleFind}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Find Phones
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
