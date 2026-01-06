"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Battery,
  Camera,
  Cpu,
  GitCompare,
  Monitor,
  Plus,
  RotateCcw,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPhoneBySlug, generateComparisonVerdict } from "@/lib/phones-data";
import PhoneSelector from "@/components/features/compare/PhoneSelector";
import EmptySlot from "@/components/features/compare/EmptySlot";
import CompareCard from "@/components/features/compare/CompareCard";
import WinnerSummary from "@/components/features/compare/WinnerSummary";
import CompareSection from "@/components/features/compare/CompareSection";
import CompareRow from "@/components/features/compare/CompareRow";

export default function ComparePage() {
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);

  const openSelector = (slotIndex) => {
    setCurrentSlot(slotIndex);
    setSelectorOpen(true);
  };

  const handleSelectPhone = (phone) => {
    const newPhones = [...selectedPhones];
    newPhones[currentSlot] = phone;
    setSelectedPhones(newPhones);
  };

  const removePhone = (index) => {
    const newPhones = selectedPhones.filter((_, i) => i !== index);
    setSelectedPhones(newPhones);
  };

  const resetComparison = () => {
    setSelectedPhones([]);
  };

  const excludeSlugs = selectedPhones.map((p) => p.slug);
  const hasPhones = selectedPhones.length > 0;
  const canCompare = selectedPhones.length >= 2;

  const verdict = useMemo(() => {
    if (!canCompare) return null;
    return generateComparisonVerdict(selectedPhones);
  }, [selectedPhones, canCompare]);

  const winnerIndex = useMemo(() => {
    if (!verdict?.overall?.winnerSlug) return -1;
    return selectedPhones.findIndex(
      (p) => p.slug === verdict.overall.winnerSlug
    );
  }, [verdict, selectedPhones]);

  const getValues = (accessor) => {
    return selectedPhones.map((phone) => {
      if (!phone) return null;
      return typeof accessor === "function" ? accessor(phone) : phone[accessor];
    });
  };

  const getCategoryWinner = (category) => {
    if (!verdict || !verdict[category]) return null;
    return verdict[category].winner;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-xl shrink-0">
                <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Compare Phones
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">
                  Find the best phone for your needs
                </p>
              </div>
            </div>

            {hasPhones && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetComparison}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {canCompare && (
          <WinnerSummary phones={selectedPhones} verdict={verdict} />
        )}

        {/* Phone Cards Grid - 2 default slots */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 max-w-2xl lg:max-w-3xl mx-auto">
          {[0, 1].map((index) => {
            const phone = selectedPhones[index];
            if (phone) {
              return (
                <CompareCard
                  key={`phone-${index}-${phone.id}`}
                  phone={phone}
                  onRemove={() => removePhone(index)}
                  isWinner={index === winnerIndex}
                />
              );
            }
            return (
              <EmptySlot
                key={`empty-${index}`}
                slotNumber={index + 1}
                onAdd={() => openSelector(index)}
              />
            );
          })}
        </div>

        {/* Extra phones (3rd, 4th) - shown only when added */}
        {selectedPhones.length > 2 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 max-w-4xl mx-auto">
            {selectedPhones.slice(2).map((phone, idx) => (
              <CompareCard
                key={`extra-${idx}-${phone.id}`}
                phone={phone}
                onRemove={() => removePhone(idx + 2)}
                isWinner={idx + 2 === winnerIndex}
                isCompact
              />
            ))}
          </div>
        )}

        {/* Add more phones button - subtle, optional */}
        {selectedPhones.length >= 2 && selectedPhones.length < 4 && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => openSelector(selectedPhones.length)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 rounded-full border border-dashed border-border/60 hover:border-primary/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add phone {selectedPhones.length + 1}</span>
              <span className="text-xs opacity-60">(optional)</span>
            </button>
          </div>
        )}

        {/* Spacer when no extra buttons */}
        {(selectedPhones.length < 2 || selectedPhones.length >= 4) && (
          <div className="mb-6 sm:mb-8" />
        )}

        {canCompare && (
          <div className="space-y-3 sm:space-y-4">
            <CompareSection title="Overview" icon={Zap} defaultOpen={true}>
              <CompareRow
                label="Overall Score"
                icon={Star}
                values={getValues((p) => p.overallScore?.rating)}
                phones={selectedPhones}
                type="score"
                highlight
              />
              <CompareRow
                label="Price"
                values={getValues("priceRange")}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Category"
                values={getValues((p) =>
                  p.category
                    ? p.category.charAt(0).toUpperCase() + p.category.slice(1)
                    : null
                )}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Release Date"
                values={getValues("releaseDate")}
                phones={selectedPhones}
                type="text"
              />
            </CompareSection>

            <CompareSection
              title="Performance"
              icon={Cpu}
              categoryWinner={getCategoryWinner("performance")}
            >
              <CompareRow
                label="Processor"
                values={getValues((p) => p.specs?.processor)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="RAM"
                values={getValues((p) => p.specs?.ram)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Storage"
                values={getValues((p) => p.specs?.storage)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Performance Score"
                icon={Cpu}
                values={getValues((p) => p.scores?.performance)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            <CompareSection
              title="Display"
              icon={Monitor}
              categoryWinner={getCategoryWinner("display")}
            >
              <CompareRow
                label="Display"
                values={getValues((p) => p.specs?.display)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Display Score"
                icon={Monitor}
                values={getValues((p) => p.scores?.display)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            <CompareSection
              title="Camera"
              icon={Camera}
              categoryWinner={getCategoryWinner("camera")}
            >
              <CompareRow
                label="Main Camera"
                values={getValues((p) => p.specs?.camera)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Camera Score"
                icon={Camera}
                values={getValues((p) => p.scores?.camera)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            <CompareSection
              title="Battery"
              icon={Battery}
              categoryWinner={getCategoryWinner("battery")}
            >
              <CompareRow
                label="Battery"
                values={getValues((p) => p.specs?.battery)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Charging"
                values={getValues((p) => p.specs?.charging)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Battery Score"
                icon={Battery}
                values={getValues((p) => p.scores?.battery)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            <CompareSection
              title="Value for Money"
              icon={Star}
              categoryWinner={getCategoryWinner("value")}
            >
              <CompareRow
                label="Value Score"
                icon={Star}
                values={getValues((p) => p.scores?.value)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>
          </div>
        )}

        {!canCompare && (
          <div className="text-center py-8 sm:py-12 bg-card rounded-xl sm:rounded-2xl border border-border">
            <GitCompare className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              {hasPhones
                ? "Add one more phone to compare"
                : "Select phones to compare"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-4">
              {hasPhones
                ? "You need at least 2 phones to start comparing."
                : "Click the slots above to add phones for comparison. Compare up to 3 phones."}
            </p>

            <div className="mt-6 sm:mt-8 max-w-xl mx-auto px-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">
                Popular Comparisons
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  {
                    phones: ["iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra"],
                    slugs: ["iphone-15-pro-max", "samsung-galaxy-s24-ultra"],
                  },
                  {
                    phones: ["Google Pixel 8 Pro", "iPhone 15 Pro Max"],
                    slugs: ["google-pixel-8-pro", "iphone-15-pro-max"],
                  },
                  {
                    phones: ["Samsung Galaxy A55", "Nothing Phone (2a)"],
                    slugs: ["samsung-galaxy-a55-5g", "nothing-phone-2a"],
                  },
                  {
                    phones: ["OnePlus 12", "Xiaomi 14 Pro"],
                    slugs: ["oneplus-12", "xiaomi-14-pro"],
                  },
                ].map((comparison, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      const phones = comparison.slugs
                        .map((slug) => getPhoneBySlug(slug))
                        .filter(Boolean);
                      if (phones.length >= 2) {
                        setSelectedPhones(phones);
                      }
                    }}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 hover:bg-muted/50 rounded-lg sm:rounded-xl transition-colors text-left group"
                  >
                    <span className="text-xs sm:text-sm text-foreground line-clamp-1">
                      {comparison.phones[0]} vs {comparison.phones[1]}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <PhoneSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelectPhone}
        excludeSlugs={excludeSlugs}
      />
    </div>
  );
}
