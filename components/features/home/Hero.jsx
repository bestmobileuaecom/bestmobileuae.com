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
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            📱
          </div>
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
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
              {score}
            </span>
            <span className="text-[10px] text-yellow-600/70 dark:text-yellow-500/70">
              /10
            </span>
          </div>
          {/* Badge */}
          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}
            >
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
    {
      label: "Best Value",
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: "Most Popular",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Top Rated",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ];

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Hero Banner */}
          <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl border border-border/60 shadow-lg overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-10">
              {/* Left: Headline & CTA */}
              <div className="flex flex-col justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 w-fit mb-4">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-primary">
                    UAE's #1 Phone Price Comparison
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                  Find the <span className="text-primary">Best Phone</span>
                  <br />
                  at the Best Price
                </h1>

                {/* Subheadline */}
                <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-md">
                  Compare prices from 50+ UAE retailers. Get expert reviews and
                  make smarter buying decisions.
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        1,200+
                      </p>
                      <p className="text-xs text-muted-foreground">Phones</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-xl">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">50+</p>
                      <p className="text-xs text-muted-foreground">Retailers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500/10 rounded-xl">
                      <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">Daily</p>
                      <p className="text-xs text-muted-foreground">Updates</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/phones"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  >
                    Browse All Phones
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 bg-background border border-border hover:border-primary/50 text-foreground px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Compare Phones
                  </Link>
                </div>
              </div>

              {/* Right: Budget Filter */}
              <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-6 lg:p-8 flex flex-col justify-center">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-1">
                    Quick Budget Finder
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Set your budget, find your phone
                  </p>
                </div>

                {/* Budget Display */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">AED</span>
                    <span className="text-4xl font-bold text-primary">
                      {formatBudget(budget)}
                    </span>
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
                    style={{
                      left: `calc(${((budget - 300) / 4700) * 100}% - 10px)`,
                    }}
                  />
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-5 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                  Show phones under AED {formatBudget(budget)}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Trending Phones Row */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Trending Right Now
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Most searched phones in UAE
                  </p>
                </div>
              </div>
              <Link
                href="/phones"
                className="text-xs text-primary hover:underline font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topPhones.length > 0
                ? topPhones.map((phone, index) => (
                    <PhonePickCard
                      key={phone.id}
                      phone={phone}
                      badge={badges[index]}
                      index={index}
                    />
                  ))
                : [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl animate-pulse"
                    >
                      <div className="w-14 h-14 bg-muted rounded-xl" />
                      <div className="flex-grow space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
