"use client";

import Link from "next/link";
import { ArrowRight, GitCompare, X } from "lucide-react";

export default function CompareBar({ phones, onRemove, onClear }) {
  if (phones.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GitCompare className="w-5 h-5 text-primary" />
              <span>Compare ({phones.length}/3)</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {phones.map((phone) => (
                <div
                  key={phone.id}
                  className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm"
                >
                  <span className="font-medium truncate max-w-24">
                    {phone.name}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${phone.name} from compare`}
                    onClick={() => onRemove(phone.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
            <Link
              href={`/compare?phones=${phones.map((p) => p.slug).join(",")}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                phones.length >= 2
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              aria-disabled={phones.length < 2}
              tabIndex={phones.length < 2 ? -1 : 0}
            >
              Compare Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
