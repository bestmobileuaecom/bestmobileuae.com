"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import PhoneSelector from "@/components/features/compare/PhoneSelector";
import EmptySlot from "@/components/features/compare/EmptySlot";
import CompareCard from "@/components/features/compare/CompareCard";
import WinnerSummary from "@/components/features/compare/WinnerSummary";
import CompareSection from "@/components/features/compare/CompareSection";
import CompareRow from "@/components/features/compare/CompareRow";
import PublicLayout from "@/components/common/PublicLayout";

// Generate comparison verdict based on phone scores
function generateComparisonVerdict(phones) {
  if (phones.length < 2) return null;

  const categories = ["camera", "battery", "performance", "display", "value"];
  const verdict = {};

  for (const category of categories) {
    let winnerPhone = null;
    let maxScore = -1;

    for (const phone of phones) {
      const score = phone.scores?.[category] || 0;
      if (score > maxScore) {
        maxScore = score;
        winnerPhone = phone;
      }
    }

    verdict[category] = { 
      winner: winnerPhone?.name || winnerPhone?.slug, 
      winnerSlug: winnerPhone?.slug,
      score: maxScore 
    };
  }

  // Overall winner by total score
  let overallWinnerPhone = null;
  let maxTotal = -1;

  for (const phone of phones) {
    const total = categories.reduce(
      (sum, cat) => sum + (phone.scores?.[cat] || 0),
      0
    );
    if (total > maxTotal) {
      maxTotal = total;
      overallWinnerPhone = phone;
    }
  }

  // Generate reason based on category wins
  const categoryWinCount = categories.filter(
    cat => verdict[cat]?.winnerSlug === overallWinnerPhone?.slug
  ).length;
  
  let reason = "";
  if (categoryWinCount >= 4) {
    reason = "Dominates in almost every category";
  } else if (categoryWinCount >= 3) {
    reason = "Wins in most key categories";
  } else {
    reason = "Best overall balance of features and value";
  }

  verdict.overall = { 
    winnerSlug: overallWinnerPhone?.slug,
    winner: overallWinnerPhone?.name,
    reason,
    totalScore: maxTotal
  };

  return verdict;
}

function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phonesParam = searchParams.get("phones");
  
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [allPhones, setAllPhones] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all phones for selector and pre-select from URL params
  useEffect(() => {
    async function fetchPhones() {
      try {
        const res = await fetch("/api/phones");
        const data = await res.json();
        if (data.phones) {
          setAllPhones(data.phones);
          
          // Check for phones in URL query params (e.g., ?phones=slug1,slug2)
          if (phonesParam) {
            const slugs = phonesParam.split(",").filter(Boolean);
            const preSelectedPhones = slugs
              .map(slug => data.phones.find(p => p.slug === slug))
              .filter(Boolean);
            if (preSelectedPhones.length > 0) {
              setSelectedPhones(preSelectedPhones);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching phones:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhones();
  }, [phonesParam]);

  const openSelector = (slotIndex) => {
    setCurrentSlot(slotIndex);
    setSelectorOpen(true);
  };

  const handleSelectPhone = (phone) => {
    const newPhones = [...selectedPhones];
    newPhones[currentSlot] = phone;
    setSelectedPhones(newPhones);
    setSelectorOpen(false);
    
    // Update URL with selected phones
    const slugs = newPhones.map(p => p.slug).join(',');
    if (slugs) {
      router.replace(`/compare?phones=${slugs}`, { scroll: false });
    }
  };

  const removePhone = (index) => {
    const newPhones = selectedPhones.filter((_, i) => i !== index);
    setSelectedPhones(newPhones);
    
    // Update URL after removing phone
    const slugs = newPhones.map(p => p.slug).join(',');
    if (slugs) {
      router.replace(`/compare?phones=${slugs}`, { scroll: false });
    } else {
      router.replace('/compare', { scroll: false });
    }
  };

  const resetComparison = () => {
    setSelectedPhones([]);
    router.replace('/compare', { scroll: false });
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

  // Get spec value helper
  const getSpecValue = (phone, ...keys) => {
    if (!phone?.specs) return null;
    const specs = phone.specs;
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      const upperKey = key.charAt(0).toUpperCase() + key.slice(1);
      if (specs[key]) {
        if (typeof specs[key] === "object" && specs[key] !== null) {
          // Return first value from nested object
          const values = Object.values(specs[key]).filter(v => v != null);
          return values[0] || null;
        }
        return specs[key];
      }
      if (specs[lowerKey]) return typeof specs[lowerKey] === "object" && specs[lowerKey] !== null ? Object.values(specs[lowerKey]).filter(v => v != null)[0] || null : specs[lowerKey];
      if (specs[upperKey]) return typeof specs[upperKey] === "object" && specs[upperKey] !== null ? Object.values(specs[upperKey]).filter(v => v != null)[0] || null : specs[upperKey];
    }
    return null;
  };

  // Helper to format charging info from object
  const formatCharging = (chargingData) => {
    if (!chargingData) return null;
    if (typeof chargingData === 'string') return chargingData;
    if (typeof chargingData === 'object') {
      const parts = [];
      if (chargingData.Wired) parts.push(chargingData.Wired);
      if (chargingData.Wireless) parts.push(`${chargingData.Wireless} (Wireless)`);
      if (chargingData.Reverse_Wired) parts.push(`${chargingData.Reverse_Wired} (Reverse)`);
      return parts.join(', ') || Object.values(chargingData).filter(v => v)[0] || null;
    }
    return null;
  };

  // Helper to format camera info from object
  const formatCamera = (cameraData) => {
    if (!cameraData) return null;
    if (typeof cameraData === 'string') return cameraData;
    if (typeof cameraData === 'object') {
      // If it has numeric keys or an array-like structure, join with " + "
      const values = Object.values(cameraData).filter(v => v && typeof v === 'string');
      return values.join(' + ') || null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading phones...</p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
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
            </CompareSection>

            <CompareSection
              title="Performance"
              icon={Cpu}
              categoryWinner={getCategoryWinner("performance")}
            >
              <CompareRow
                label="Processor"
                values={getValues((p) => getSpecValue(p, "Performance", "Processor") || getSpecValue(p, "processor"))}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="RAM"
                values={getValues((p) => p.specs?.Performance?.RAM || p.specs?.RAM || p.specs?.ram)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Storage"
                values={getValues((p) => p.specs?.Performance?.Storage || p.specs?.Storage || p.specs?.storage)}
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
                label="Size"
                values={getValues((p) => p.specs?.Display?.Size || p.specs?.display?.Size || p.specs?.display?.size)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Type"
                values={getValues((p) => p.specs?.Display?.Type || p.specs?.display?.Type || p.specs?.display?.type)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Refresh Rate"
                values={getValues((p) => p.specs?.Display?.["Refresh Rate"] || p.specs?.display?.["Refresh Rate"])}
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
                values={getValues((p) => formatCamera(p.specs?.Camera?.Main || p.specs?.camera?.Main || p.specs?.camera?.main))}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Front Camera"
                values={getValues((p) => formatCamera(p.specs?.Camera?.Front || p.specs?.camera?.Front || p.specs?.camera?.front))}
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
                label="Capacity"
                values={getValues((p) => p.specs?.Battery?.Capacity || p.specs?.battery?.Capacity || p.specs?.battery?.capacity)}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow
                label="Charging"
                values={getValues((p) => formatCharging(p.specs?.Battery?.Charging || p.specs?.battery?.Charging || p.specs?.battery?.charging))}
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
                : "Click the slots above to add phones for comparison. Compare up to 4 phones."}
            </p>

            {allPhones.length >= 2 && (
              <div className="mt-6 sm:mt-8 max-w-xl mx-auto px-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">
                  Quick Compare
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Show first 4 phones as quick options */}
                  {allPhones.slice(0, 4).map((phone) => (
                    <button
                      type="button"
                      key={phone.id}
                      onClick={() => {
                        if (selectedPhones.length < 4 && !selectedPhones.find(p => p.slug === phone.slug)) {
                          const newPhones = [...selectedPhones, phone];
                          setSelectedPhones(newPhones);
                          // Update URL with selected phones
                          const slugs = newPhones.map(p => p.slug).join(',');
                          router.replace(`/compare?phones=${slugs}`, { scroll: false });
                        }
                      }}
                      disabled={selectedPhones.find(p => p.slug === phone.slug)}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg sm:rounded-xl transition-colors text-left group"
                    >
                      <span className="text-xs sm:text-sm text-foreground line-clamp-1">
                        {phone.name}
                      </span>
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <PhoneSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelectPhone}
        excludeSlugs={excludeSlugs}
        phones={allPhones}
      />
    </div>
    </PublicLayout>
  );
}

// Loading fallback for Suspense
function CompareLoading() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading comparison...</p>
        </div>
      </div>
    </PublicLayout>
  );
}

// Wrap in Suspense for useSearchParams
export default function ComparePageWrapper() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <ComparePage />
    </Suspense>
  );
}
