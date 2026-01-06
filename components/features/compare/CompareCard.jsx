"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Smartphone, Star, Trophy, X } from "lucide-react";

export default function CompareCard({ phone, onRemove, isWinner, isCompact }) {
  const score = phone.overallScore?.rating || 8.0;

  // Compact version for 3rd/4th phones
  if (isCompact) {
    return (
      <div
        className={`relative bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md group ${
          isWinner
            ? "border-emerald-500 ring-1 ring-emerald-500/20"
            : "border-border hover:border-primary/30"
        }`}
      >
        <button
          type="button"
          aria-label={`Remove ${phone.name} from comparison`}
          onClick={onRemove}
          className="absolute top-2 right-2 z-20 w-6 h-6 bg-background/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-200 border border-border"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="aspect-square bg-muted/20 p-3 relative">
          {phone.image ? (
            <Image
              src={phone.image}
              alt={phone.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wide">
              {phone.brand}
            </p>
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
              {phone.name}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {score}
            </div>
            <p className="text-sm font-bold text-foreground">
              {phone.priceRange}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg group ${
        isWinner
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10 shadow-lg"
          : "border-border hover:border-primary/30"
      }`}
    >
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-2 px-3 text-center z-10">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold">
            <Trophy className="w-4 h-4" />
            <span className="hidden xs:inline">Our Pick</span>
            <span className="xs:hidden">Winner</span>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={`Remove ${phone.name} from comparison`}
        onClick={onRemove}
        className={`absolute ${
          isWinner ? "top-12" : "top-3"
        } right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-background/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-200 border border-border shadow-sm hover:shadow-md hover:scale-105`}
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className={`aspect-4/5 sm:aspect-square bg-linear-to-br from-muted/40 via-muted/20 to-transparent p-4 sm:p-6 relative ${
          isWinner ? "mt-9" : ""
        }`}
      >
        {phone.image ? (
          <Image
            src={phone.image}
            alt={phone.name}
            fill
            className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Smartphone className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
            {phone.brand}
          </p>
          <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight line-clamp-2">
            {phone.name}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isWinner
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                isWinner ? "fill-emerald-500 text-emerald-500" : "fill-amber-400 text-amber-400"
              }`}
            />
            {score}/10
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {phone.priceRange}
          </p>
        </div>

        <Link
          href={`/phones/${phone.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-primary/5 hover:bg-primary/10 rounded-xl text-sm font-medium text-primary transition-colors group/link"
        >
          View Details 
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
