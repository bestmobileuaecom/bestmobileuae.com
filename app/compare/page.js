"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Battery,
  Camera,
  Cpu,
  GitCompare,
  Monitor,
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
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                <GitCompare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Compare Phones
                </h1>
                <p className="text-sm text-muted-foreground">
                  Find the best phone for your needs
                </p>
              </div>
            </div>

            {hasPhones && (
              <Button
                variant="outline"
                onClick={resetComparison}
                className="hidden sm:flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {canCompare && (
          <WinnerSummary phones={selectedPhones} verdict={verdict} />
        )}

        <div
          className={`grid gap-4 mb-8 ${
            selectedPhones.length <= 2
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {[0, 1, 2]
            .slice(0, Math.max(selectedPhones.length + 1, 2))
            .map((index) => {
              const phone = selectedPhones[index];
              if (phone) {
                return (
                  <CompareCard
                    key={phone.id}
                    phone={phone}
                    onRemove={() => removePhone(index)}
                    isWinner={index === winnerIndex}
                  />
                );
              }
              if (index < 3) {
                return (
                  <EmptySlot
                    key={index}
                    slotNumber={index + 1}
                    onAdd={() => openSelector(index)}
                  />
                );
              }
              return null;
            })}
        </div>

        {canCompare && (
          <div className="space-y-4">
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
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <GitCompare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {hasPhones
                ? "Add one more phone to compare"
                : "Select phones to compare"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {hasPhones
                ? "You need at least 2 phones to start comparing. Add another phone above."
                : "Click the slots above to add phones for comparison. You can compare up to 3 phones at once."}
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Popular Comparisons
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors text-left"
                  >
                    <span className="text-sm text-foreground">
                      {comparison.phones[0]} vs {comparison.phones[1]}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
