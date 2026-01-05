"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Smartphone, Star, Trophy, X } from "lucide-react";

export default function CompareCard({ phone, onRemove, isWinner }) {
  const score = phone.overallScore?.rating || 8.0;

  return (
    <div
      className={`relative bg-card rounded-2xl border overflow-hidden ${
        isWinner
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-border"
      }`}
    >
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white py-1.5 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold">
            <Trophy className="w-4 h-4" />
            Our Pick
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={`Remove ${phone.name} from comparison`}
        onClick={onRemove}
        className={`absolute ${
          isWinner ? "top-12" : "top-3"
        } right-3 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-colors border border-border`}
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className={`aspect-square bg-linear-to-br from-muted/30 to-muted/10 p-6 relative ${
          isWinner ? "mt-8" : ""
        }`}
      >
        {phone.image ? (
          <Image
            src={phone.image}
            alt={phone.name}
            fill
            className="object-contain p-6"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Smartphone className="w-20 h-20 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          {phone.brand}
        </p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {phone.name}
        </h3>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${
              isWinner
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-muted text-foreground"
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                isWinner ? "fill-current" : "fill-amber-400 text-amber-400"
              }`}
            />
            {score}/10
          </div>
        </div>

        <p className="text-xl font-bold text-foreground mt-3">
          {phone.priceRange}
        </p>

        <Link
          href={`/phones/${phone.slug}`}
          className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
