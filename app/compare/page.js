"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GitCompare,
  X,
  Plus,
  Search,
  Star,
  Check,
  Minus,
  ArrowRight,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Zap,
  Battery,
  Camera,
  Cpu,
  Monitor,
  RotateCcw,
  Trophy,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { allPhones, getPhoneBySlug, generateComparisonVerdict } from "@/lib/phones-data";

// Phone Selector Modal
function PhoneSelector({ isOpen, onClose, onSelect, excludeSlugs = [] }) {
  const [search, setSearch] = useState("");

  const filteredPhones = useMemo(() => {
    return allPhones
      .filter((phone) => !excludeSlugs.includes(phone.slug))
      .filter(
        (phone) =>
          phone.name.toLowerCase().includes(search.toLowerCase()) ||
          phone.brand.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, excludeSlugs]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Select a Phone</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredPhones.length > 0 ? (
            <div className="space-y-1">
              {filteredPhones.map((phone) => (
                <button
                  type="button"
                  key={phone.id}
                  onClick={() => {
                    onSelect(phone);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                    {phone.image ? (
                      <Image src={phone.image} alt={phone.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{phone.name}</p>
                    <p className="text-sm text-muted-foreground">{phone.brand} • {phone.priceRange}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{phone.overallScore?.rating || "N/A"}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No phones found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Empty Slot Component
function EmptySlot({ onAdd, slotNumber }) {
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

// Phone Card in Comparison
function CompareCard({ phone, onRemove, isWinner }) {
  const score = phone.overallScore?.rating || 8.0;

  return (
    <div className={`relative bg-card rounded-2xl border overflow-hidden ${isWinner ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-border"}`}>
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white py-1.5 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold">
            <Trophy className="w-4 h-4" />
            Our Pick
          </div>
        </div>
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className={`absolute ${isWinner ? "top-12" : "top-3"} right-3 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-colors border border-border`}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Image */}
      <div className={`aspect-square bg-linear-to-br from-muted/30 to-muted/10 p-6 relative ${isWinner ? "mt-8" : ""}`}>
        {phone.image ? (
          <Image src={phone.image} alt={phone.name} fill className="object-contain p-6" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Smartphone className="w-20 h-20 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium mb-1">{phone.brand}</p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{phone.name}</h3>

        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${isWinner ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-foreground"}`}>
            <Star className={`w-4 h-4 ${isWinner ? "fill-current" : "fill-amber-400 text-amber-400"}`} />
            {score}/10
          </div>
        </div>

        <p className="text-xl font-bold text-foreground mt-3">{phone.priceRange}</p>

        <Link href={`/phones/${phone.slug}`} className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline">
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// WINNER SUMMARY - THE KEY FEATURE (People love winners, not tables)
function WinnerSummary({ phones, verdict }) {
  if (!verdict || !verdict.overall) return null;

  const winnerPhone = phones.find((p) => p.slug === verdict.overall.winnerSlug);
  const categoryWins = [
    { key: "camera", label: "Best Camera", icon: Camera },
    { key: "battery", label: "Best Battery", icon: Battery },
    { key: "performance", label: "Best Performance", icon: Cpu },
    { key: "value", label: "Best Value", icon: Star },
  ];

  return (
    <div className="bg-linear-to-br from-emerald-500/5 via-card to-emerald-500/5 rounded-2xl border border-emerald-500/20 p-6 mb-6">
      {/* Main Verdict */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">So... Which One Should You Buy?</h2>
          <p className="text-muted-foreground text-sm">Based on our scoring and analysis</p>
        </div>
      </div>

      {/* Overall Winner Box */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center gap-4">
          {winnerPhone?.image && (
            <div className="relative w-20 h-20 shrink-0">
              <Image src={winnerPhone.image} alt={winnerPhone.name} fill className="object-contain" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-emerald-600 font-semibold mb-1">🏆 Overall Winner</p>
            <h3 className="text-lg font-bold text-foreground">{verdict.overall.winner}</h3>
            <p className="text-sm text-muted-foreground mt-1">{verdict.overall.reason}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground">{winnerPhone?.overallScore?.rating}/10</p>
            <p className="text-sm text-muted-foreground">{winnerPhone?.priceRange}</p>
          </div>
        </div>
      </div>

      {/* Category Winners Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {categoryWins.map(({ key, label, icon: Icon }) => {
          const winner = verdict[key];
          if (!winner) return null;
          return (
            <div key={key} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{winner.winner}</p>
              <p className="text-xs text-muted-foreground">{winner.score}/10</p>
            </div>
          );
        })}
      </div>

      {/* Choose X if you want... - Decision Helper */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Quick Decision Helper
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phones.slice(0, 2).map((phone) => (
            <div key={phone.id} className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="font-semibold text-foreground mb-2">
                Choose <span className="text-primary">{phone.name}</span> if you want:
              </p>
              <ul className="space-y-1.5">
                {phone.bestFor?.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground capitalize">{reason.replace(/-/g, ' ')}</span>
                  </li>
                ))}
                {phone.pros?.slice(0, 2).map((pro, idx) => (
                  <li key={`pro-${idx}`} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Comparison Table Row with Winner Highlight
function CompareRow({ label, icon: Icon, values, phones, type = "text", highlight }) {
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
        <div className={`flex items-center justify-center gap-1.5 ${isBest ? "text-emerald-600 font-bold" : "text-foreground"}`}>
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

    return <span className={isBest ? "text-emerald-600 font-semibold" : ""}>{value}</span>;
  };

  const colCount = phones?.length || 3;

  return (
    <div className={`grid gap-4 py-3 border-b border-border/50 items-center`} style={{ gridTemplateColumns: `1fr repeat(${colCount}, 1fr)` }}>
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

// Collapsible Section
function CompareSection({ title, icon: Icon, children, defaultOpen = true, categoryWinner }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {categoryWinner && (
            <span className="hidden sm:flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <Trophy className="w-3 h-3" />
              {categoryWinner}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

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

  // Generate verdict for selected phones
  const verdict = useMemo(() => {
    if (!canCompare) return null;
    return generateComparisonVerdict(selectedPhones);
  }, [selectedPhones, canCompare]);

  // Determine overall winner index
  const winnerIndex = useMemo(() => {
    if (!verdict?.overall?.winnerSlug) return -1;
    return selectedPhones.findIndex((p) => p.slug === verdict.overall.winnerSlug);
  }, [verdict, selectedPhones]);

  // Get values for comparison
  const getValues = (accessor) => {
    return selectedPhones.map((phone) => {
      if (!phone) return null;
      return typeof accessor === "function" ? accessor(phone) : phone[accessor];
    });
  };

  // Get category winner name
  const getCategoryWinner = (category) => {
    if (!verdict || !verdict[category]) return null;
    return verdict[category].winner;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                <GitCompare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Compare Phones</h1>
                <p className="text-sm text-muted-foreground">Find the best phone for your needs</p>
              </div>
            </div>

            {hasPhones && (
              <Button variant="outline" onClick={resetComparison} className="hidden sm:flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* WINNER SUMMARY - Show verdict FIRST (People love winners!) */}
        {canCompare && <WinnerSummary phones={selectedPhones} verdict={verdict} />}

        {/* Phone Selection Grid */}
        <div className={`grid gap-4 mb-8 ${selectedPhones.length <= 2 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {[0, 1, 2].slice(0, Math.max(selectedPhones.length + 1, 2)).map((index) => {
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
              return <EmptySlot key={index} slotNumber={index + 1} onAdd={() => openSelector(index)} />;
            }
            return null;
          })}
        </div>

        {/* Comparison Table */}
        {canCompare && (
          <div className="space-y-4">
            {/* Overview */}
            <CompareSection title="Overview" icon={Zap} defaultOpen={true}>
              <CompareRow
                label="Overall Score"
                icon={Star}
                values={getValues((p) => p.overallScore?.rating)}
                phones={selectedPhones}
                type="score"
                highlight
              />
              <CompareRow label="Price" values={getValues("priceRange")} phones={selectedPhones} type="text" />
              <CompareRow
                label="Category"
                values={getValues((p) => (p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : null))}
                phones={selectedPhones}
                type="text"
              />
              <CompareRow label="Release Date" values={getValues("releaseDate")} phones={selectedPhones} type="text" />
            </CompareSection>

            {/* Performance */}
            <CompareSection title="Performance" icon={Cpu} categoryWinner={getCategoryWinner("performance")}>
              <CompareRow label="Processor" values={getValues((p) => p.specs?.processor)} phones={selectedPhones} type="text" />
              <CompareRow label="RAM" values={getValues((p) => p.specs?.ram)} phones={selectedPhones} type="text" />
              <CompareRow label="Storage" values={getValues((p) => p.specs?.storage)} phones={selectedPhones} type="text" />
              <CompareRow
                label="Performance Score"
                icon={Cpu}
                values={getValues((p) => p.scores?.performance)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            {/* Display */}
            <CompareSection title="Display" icon={Monitor} categoryWinner={getCategoryWinner("display")}>
              <CompareRow label="Display" values={getValues((p) => p.specs?.display)} phones={selectedPhones} type="text" />
              <CompareRow
                label="Display Score"
                icon={Monitor}
                values={getValues((p) => p.scores?.display)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            {/* Camera */}
            <CompareSection title="Camera" icon={Camera} categoryWinner={getCategoryWinner("camera")}>
              <CompareRow label="Main Camera" values={getValues((p) => p.specs?.camera)} phones={selectedPhones} type="text" />
              <CompareRow
                label="Camera Score"
                icon={Camera}
                values={getValues((p) => p.scores?.camera)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            {/* Battery */}
            <CompareSection title="Battery" icon={Battery} categoryWinner={getCategoryWinner("battery")}>
              <CompareRow label="Battery" values={getValues((p) => p.specs?.battery)} phones={selectedPhones} type="text" />
              <CompareRow label="Charging" values={getValues((p) => p.specs?.charging)} phones={selectedPhones} type="text" />
              <CompareRow
                label="Battery Score"
                icon={Battery}
                values={getValues((p) => p.scores?.battery)}
                phones={selectedPhones}
                type="score"
                highlight
              />
            </CompareSection>

            {/* Value */}
            <CompareSection title="Value for Money" icon={Star} categoryWinner={getCategoryWinner("value")}>
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

        {/* Empty State */}
        {!canCompare && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <GitCompare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {hasPhones ? "Add one more phone to compare" : "Select phones to compare"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {hasPhones
                ? "You need at least 2 phones to start comparing. Add another phone above."
                : "Click the slots above to add phones for comparison. You can compare up to 3 phones at once."}
            </p>

            {/* Popular Comparisons */}
            <div className="mt-8 max-w-xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-4">Popular Comparisons</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { phones: ["iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra"], slugs: ["iphone-15-pro-max", "samsung-galaxy-s24-ultra"] },
                  { phones: ["Google Pixel 8 Pro", "iPhone 15 Pro Max"], slugs: ["google-pixel-8-pro", "iphone-15-pro-max"] },
                  { phones: ["Samsung Galaxy A55", "Nothing Phone (2a)"], slugs: ["samsung-galaxy-a55-5g", "nothing-phone-2a"] },
                  { phones: ["OnePlus 12", "Xiaomi 14 Pro"], slugs: ["oneplus-12", "xiaomi-14-pro"] },
                ].map((comparison, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      const phones = comparison.slugs.map((slug) => getPhoneBySlug(slug)).filter(Boolean);
                      if (phones.length >= 2) {
                        setSelectedPhones(phones);
                      }
                    }}
                    className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors text-left"
                  >
                    <span className="text-sm text-foreground">{comparison.phones[0]} vs {comparison.phones[1]}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phone Selector Modal */}
      <PhoneSelector isOpen={selectorOpen} onClose={() => setSelectorOpen(false)} onSelect={handleSelectPhone} excludeSlugs={excludeSlugs} />
    </div>
  );
}
