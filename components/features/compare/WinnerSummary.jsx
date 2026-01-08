"use client";

import Image from "next/image";
import { Battery, Camera, Cpu, Smartphone, Wifi, Trophy, Sparkles } from "lucide-react";

export default function WinnerSummary({ phones, verdict }) {
  if (!verdict || !verdict.overall) return null;

  const winnerPhone = phones.find((p) => p.slug === verdict.overall.winnerSlug);
  const categoryWins = [
    { key: "design", label: "Design", shortLabel: "Design", icon: Smartphone },
    { key: "performance", label: "Performance", shortLabel: "Perf", icon: Cpu },
    { key: "camera", label: "Camera", shortLabel: "Cam", icon: Camera },
    { key: "connectivity", label: "Connectivity", shortLabel: "Conn", icon: Wifi },
    { key: "battery", label: "Battery", shortLabel: "Bat", icon: Battery },
  ];

  return (
    <div className="bg-linear-to-br from-emerald-500/5 via-card to-emerald-500/5 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-4 sm:p-6 mb-6 shadow-lg shadow-emerald-500/5">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-0.5 sm:mb-1">
            So... Which One Should You Buy?
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Based on our scoring and analysis
          </p>
        </div>
      </div>

      {/* Winner Card */}
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {winnerPhone?.image && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-muted/30 rounded-lg mx-auto sm:mx-0">
              <Image
                src={winnerPhone.image}
                alt={winnerPhone.name}
                fill
                className="object-contain p-1"
              />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-600 font-semibold mb-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Overall Winner
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {verdict.overall.winner}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
              {verdict.overall.reason}
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {winnerPhone?.overallScore?.rating}/10
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {winnerPhone?.priceRange}
            </p>
          </div>
        </div>
      </div>

      {/* Category Winners Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {categoryWins.map(({ key, label, shortLabel, icon: Icon }) => {
          const winner = verdict[key];
          if (!winner) return null;
          return (
            <div key={key} className="bg-muted/40 hover:bg-muted/60 rounded-lg p-2.5 sm:p-3 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {winner.winner}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{winner.score}/10</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
