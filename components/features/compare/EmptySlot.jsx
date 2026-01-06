"use client";

import { Plus, Smartphone } from "lucide-react";

export default function EmptySlot({ onAdd, slotNumber }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full min-h-70 sm:min-h-95 bg-linear-to-b from-muted/20 to-muted/5 border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 shadow-sm">
          <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
          <Smartphone className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-foreground text-base sm:text-lg">Add Phone {slotNumber}</p>
        <p className="text-sm text-muted-foreground">Click to select</p>
      </div>
      <div className="px-4 py-2 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs font-medium text-primary">Browse phones</span>
      </div>
    </button>
  );
}
