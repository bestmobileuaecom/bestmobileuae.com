"use client";

import { Plus } from "lucide-react";

export default function EmptySlot({ onAdd, slotNumber }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full aspect-3/4 bg-muted/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <Plus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">Add Phone {slotNumber}</p>
        <p className="text-sm text-muted-foreground">Click to select</p>
      </div>
    </button>
  );
}
