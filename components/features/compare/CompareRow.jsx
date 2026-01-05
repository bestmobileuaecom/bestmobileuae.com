"use client";

import { Check, Minus, Trophy } from "lucide-react";

export default function CompareRow({
  label,
  icon: Icon,
  values,
  phones,
  type = "text",
  highlight,
}) {
  const getBestIndex = () => {
    if (!highlight) return -1;
    if (type === "score") {
      const numericValues = values.map((v) => (typeof v === "number" ? v : 0));
      const max = Math.max(...numericValues);
      if (max === 0) return -1;
      return numericValues.indexOf(max);
    }
    return -1;
  };

  const bestIndex = getBestIndex();

  const renderValue = (value, index) => {
    if (value == null) return <span className="text-muted-foreground">—</span>;

    const isBest = index === bestIndex;

    if (type === "score") {
      return (
        <div
          className={`flex items-center justify-center gap-1.5 ${
            isBest ? "text-emerald-600 font-bold" : "text-foreground"
          }`}
        >
          {isBest && <Trophy className="w-4 h-4 text-emerald-500" />}
          <span>{value}/10</span>
        </div>
      );
    }

    if (type === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
      ) : (
        <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
      );
    }

    return (
      <span className={isBest ? "text-emerald-600 font-semibold" : ""}>
        {value}
      </span>
    );
  };

  const colCount = phones?.length || 3;

  return (
    <div
      className="grid gap-4 py-3 border-b border-border/50 items-center"
      style={{ gridTemplateColumns: `1fr repeat(${colCount}, 1fr)` }}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
      {values.map((value, index) => (
        <div key={index} className="text-center text-sm">
          {renderValue(value, index)}
        </div>
      ))}
    </div>
  );
}
