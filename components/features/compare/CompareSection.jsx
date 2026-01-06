"use client";

import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { useState } from "react";

export default function CompareSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  categoryWinner,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">{title}</h3>
          {categoryWinner && (
            <span className="flex items-center gap-1 text-[10px] sm:text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 sm:px-2 py-0.5 rounded-full">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden xs:inline">{categoryWinner}</span>
              <span className="xs:hidden">Winner</span>
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto">
          <div className="min-w-70">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
