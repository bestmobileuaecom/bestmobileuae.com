"use client";

import { ArrowRight, RotateCcw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneCard from "./PhoneCard";

export default function PhonesGrid({
  phones,
  hasActiveFilter,
  showAllPhones,
  onShowAll,
  toggleCompare,
  comparePhones,
  onReset,
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">
          {hasActiveFilter
            ? `Showing ${phones.length} phones`
            : "Explore All Phones"}
        </h2>
        {!hasActiveFilter && phones.length > 6 && !showAllPhones && (
          <button
            type="button"
            onClick={onShowAll}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all {phones.length} phones
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {phones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(hasActiveFilter || showAllPhones ? phones : phones.slice(0, 6)).map(
            (phone, index) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                onCompare={toggleCompare}
                isInCompare={comparePhones.some((p) => p.id === phone.id)}
                rank={hasActiveFilter ? index + 1 : null}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Smartphone className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No phones match your criteria
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters
          </p>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      )}

      {!hasActiveFilter && !showAllPhones && phones.length > 6 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onShowAll}
            className="px-8"
          >
            Show All {phones.length} Phones
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
