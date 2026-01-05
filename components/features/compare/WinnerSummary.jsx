"use client";

import Image from "next/image";
import { Battery, Camera, Cpu, Star, Target, Trophy } from "lucide-react";
import { Check } from "lucide-react";

export default function WinnerSummary({ phones, verdict }) {
  if (!verdict || !verdict.overall) return null;

  const winnerPhone = phones.find((p) => p.slug === verdict.overall.winnerSlug);
  const categoryWins = [
    { key: "camera", label: "Best Camera", icon: Camera },
    { key: "battery", label: "Best Battery", icon: Battery },
    { key: "performance", label: "Best Performance", icon: Cpu },
    { key: "value", label: "Best Value", icon: Star },
  ];

  return (
    <div className="bg-linear-to-br from-emerald-500/5 via-card to-emerald-500/5 rounded-2xl border border-emerald-500/20 p-6 mb-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            So... Which One Should You Buy?
          </h2>
          <p className="text-muted-foreground text-sm">
            Based on our scoring and analysis
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center gap-4">
          {winnerPhone?.image && (
            <div className="relative w-20 h-20 shrink-0">
              <Image
                src={winnerPhone.image}
                alt={winnerPhone.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-emerald-600 font-semibold mb-1">
              🏆 Overall Winner
            </p>
            <h3 className="text-lg font-bold text-foreground">
              {verdict.overall.winner}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {verdict.overall.reason}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground">
              {winnerPhone?.overallScore?.rating}/10
            </p>
            <p className="text-sm text-muted-foreground">
              {winnerPhone?.priceRange}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {categoryWins.map(({ key, label, icon: Icon }) => {
          const winner = verdict[key];
          if (!winner) return null;
          return (
            <div key={key} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">
                {winner.winner}
              </p>
              <p className="text-xs text-muted-foreground">{winner.score}/10</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Quick Decision Helper
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phones.slice(0, 2).map((phone) => (
            <div
              key={phone.id}
              className="bg-muted/30 rounded-lg p-4 border border-border/50"
            >
              <p className="font-semibold text-foreground mb-2">
                Choose <span className="text-primary">{phone.name}</span> if you
                want:
              </p>
              <ul className="space-y-1.5">
                {phone.bestFor?.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground capitalize">
                      {reason.replace(/-/g, " ")}
                    </span>
                  </li>
                ))}
                {phone.pros?.slice(0, 2).map((pro, idx) => (
                  <li
                    key={`pro-${idx}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
