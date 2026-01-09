"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, GitCompare, Smartphone } from "lucide-react";

const getScoreLabel = (score) => {
  if (score >= 9.0)
    return {
      label: "Best in Class",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
    };
  if (score >= 8.0)
    return {
      label: "Excellent",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
    };
  if (score >= 7.0)
    return {
      label: "Very Good",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
    };
  return {
    label: "Good",
    color: "text-slate-600 bg-slate-50 dark:bg-slate-900/30",
  };
};

export default function PhoneCard({ phone, onCompare, isInCompare, rank }) {
  const score = phone.overallScore?.rating || 8.0;
  const scoreInfo = getScoreLabel(score);

  return (
    <div className="group bg-card rounded-2xl border border-border/60 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          {rank && (
            <div className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-xs font-bold shadow-md">
              #{rank}
            </div>
          )}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${scoreInfo.color}`}
          >
            ⭐ {scoreInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>

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

      <div className="p-4 pt-2">
        <p className="text-xs text-muted-foreground font-medium">
          {phone.brand}
        </p>
        <h3 className="font-bold text-foreground text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          {phone.name}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {phone.whyPick}
        </p>

        <div className="space-y-1 mb-4">
          {phone.pros?.slice(0, 2).map((pro, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-muted-foreground">{pro}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-base font-semibold text-foreground">
              {phone.priceRange}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={
                isInCompare
                  ? `Remove ${phone.name} from compare`
                  : `Add ${phone.name} to compare`
              }
              aria-pressed={isInCompare}
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
