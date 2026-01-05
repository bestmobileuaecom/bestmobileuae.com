"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Zap, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const budgetOptions = [
  { label: "500", value: "500" },
  { label: "1K", value: "1000" },
  { label: "1.5K", value: "1500" },
  { label: "3K", value: "3000" },
  { label: "5K+", value: "5000" },
];

// Professional Phone Card
function PhonePickCard({ phone, badge, index }) {
  const score = phone.score || phone.expert_score || 8.5;
  return (
    <Link
      href={`/phones/${phone.slug}`}
      className="group flex items-center gap-4 p-3 bg-gradient-to-r from-background to-muted/20 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg text-sm font-bold shadow-sm">
        {index + 1}
      </div>

      {/* Phone Image */}
      <div className="relative w-14 h-14 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-border/50 shadow-sm">
        {phone.image || phone.main_image ? (
          <Image
            src={phone.image || phone.main_image}
            alt={phone.name}
            fill
            className="object-contain p-1 group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">📱</div>
        )}
      </div>

      {/* Phone Info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {phone.name}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          {/* Score */}
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{score}</span>
            <span className="text-[10px] text-yellow-600/70 dark:text-yellow-500/70">/10</span>
          </div>
          {/* Badge */}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

export default function Hero({ trendingPhones = [] }) {
  const router = useRouter();
  const [budget, setBudget] = useState(1500);

  const handleSliderChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleShowPhones = () => {
    router.push(`/phones?maxPrice=${budget}`);
  };

  const formatBudget = (value) => {
    return value.toLocaleString();
  };

  const topPhones = trendingPhones.slice(0, 3);

  const badges = [
    { label: "Best Value", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { label: "Most Popular", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { label: "Top Rated", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Hero Card - max-w-7xl */}
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl border border-border/60 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[280px]">
            
            {/* LEFT: Best Picks (2 cols) */}
            <div className="lg:col-span-2 p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-xl">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      Best Phones Right Now
                    </h1>
                    <p className="text-xs text-muted-foreground">Updated daily • UAE prices</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <Shield className="w-3 h-3" />
                  <span>Trusted reviews</span>
                </div>
              </div>

              {/* Phone Cards */}
              <div className="space-y-3">
                {topPhones.length > 0 ? (
                  topPhones.map((phone, index) => (
                    <PhonePickCard
                      key={phone.id}
                      phone={phone}
                      badge={badges[index]}
                      index={index}
                    />
                  ))
                ) : (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded-lg" />
                      <div className="w-14 h-14 bg-muted rounded-xl" />
                      <div className="flex-grow space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View All */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                <Link
                  href="/phones"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold group"
                >
                  Browse all 1,200+ phones
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Live rankings</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Budget Filter (1 col) */}
            <div className="lg:col-span-1 bg-gradient-to-b from-muted/40 to-muted/20 border-t lg:border-t-0 lg:border-l border-border/50 p-6 lg:p-8 flex flex-col justify-center">
              {/* Header */}
              <div className="text-center mb-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Filter by Budget
                </p>
                <div className="inline-flex items-baseline gap-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                  <span className="text-3xl font-bold text-transparent">AED {formatBudget(budget)}</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative mb-5">
                <div className="relative h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-150"
                    style={{ width: `${((budget - 300) / 4700) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={budget}
                  onChange={handleSliderChange}
                  className="absolute top-0 left-0 w-full h-2.5 opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-primary pointer-events-none transition-all duration-150"
                  style={{ left: `calc(${((budget - 300) / 4700) * 100}% - 10px)` }}
                />
                {/* Labels */}
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium">
                  <span>300</span>
                  <span>5,000 AED</span>
                </div>
              </div>

              {/* Quick Budget Pills */}
              <div className="grid grid-cols-5 gap-1.5 mb-5">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBudget(Number(option.value))}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      budget === Number(option.value)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background/80 border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleShowPhones}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                Show phones under AED {formatBudget(budget)}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust */}
              <p className="text-[10px] text-muted-foreground text-center mt-4">
                Real prices • Updated hourly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
