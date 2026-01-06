"use client";

import { useState } from "react";
import {
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const tabs = [
  { id: "latest", label: "Latest", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "top-rated", label: "Top Rated", icon: Star },
  { id: "best-value", label: "Best Value", icon: Zap },
];

function PhoneRow({ phone, index, tabId }) {
  const score = phone.expert_score || phone.score || 0;

  const getBadge = () => {
    switch (tabId) {
      case "latest":
        return { text: "NEW", color: "bg-green-500" };
      case "popular":
        return { text: "HOT", color: "bg-red-500" };
      case "top-rated":
        return { text: "TOP", color: "bg-amber-500" };
      case "best-value":
        return { text: "DEAL", color: "bg-blue-500" };
      default:
        return null;
    }
  };

  const getSubtext = () => {
    switch (tabId) {
      case "latest":
        return "Just launched";
      case "popular":
        return "Trending now";
      case "top-rated":
        return "Highly rated";
      case "best-value":
        return "Great value";
      default:
        return "";
    }
  };

  const badge = getBadge();

  return (
    <Link
      href={`/phones/${phone.slug}`}
      className="group flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/50 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative flex-shrink-0 w-14 h-16 bg-gradient-to-br from-background to-muted/50 rounded-xl overflow-hidden">
        {phone.image || phone.main_image ? (
          <Image
            src={phone.image || phone.main_image}
            alt={phone.name}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[8px] text-muted-foreground">No img</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {phone.name}
          </h3>
          {badge && (
            <span
              className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color} text-white`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{getSubtext()}</p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-sm font-bold text-amber-600">{score}</span>
        <span className="text-xs text-muted-foreground">/10</span>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

export default function LatestPopularPhones({
  latestPhones = [],
  popularPhones = [],
  topRatedPhones = [],
  bestValuePhones = [],
}) {
  const [activeTab, setActiveTab] = useState("latest");

  // Use different data based on tab
  const getPhones = () => {
    switch (activeTab) {
      case "latest":
        return latestPhones;
      case "popular":
        return popularPhones;
      case "top-rated":
        return topRatedPhones;
      case "best-value":
        return bestValuePhones;
      default:
        return latestPhones;
    }
  };

  const phonesToShow = getPhones().slice(0, 4);

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container - Consistent with other sections */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header with Tabs */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Explore Phones
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Latest, popular, top rated & best deals
                    </p>
                  </div>
                </div>

                {/* 4 Tabs */}
                <div className="flex flex-wrap gap-2 bg-muted/50 rounded-xl p-1.5">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone List - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {phonesToShow.map((phone, index) => (
                  <PhoneRow
                    key={phone.id}
                    phone={phone}
                    index={index}
                    tabId={activeTab}
                  />
                ))}
              </div>

              {/* View All - higher contrast */}
              <div className="mt-5 pt-4 border-t border-border/50 text-center">
                <Link
                  href="/phones"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold rounded-lg transition-colors"
                >
                  View all phones
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
