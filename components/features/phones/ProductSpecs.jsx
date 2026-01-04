/**
 * Product Specs - Trust signals, quick specs, storage, and color options
 */
import { Smartphone, Cpu, Battery, Camera } from "lucide-react";

// Trust Signals Component
export function TrustSignals({ signals }) {
  if (!signals?.length) return null;

  return (
    <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      {signals.slice(0, 4).map((s, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full border whitespace-nowrap flex-shrink-0 transition-colors ${
            i === 0
              ? "bg-primary/10 text-primary border-primary/20"
              : i === 1
              ? "bg-accent/10 text-accent border-accent/20"
              : "bg-secondary text-secondary-foreground border-border"
          }`}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </span>
      ))}
    </div>
  );
}

// Quick Specs Component
export function QuickSpecs({ specs }) {
  const quickSpecs = [
    specs?.display && { icon: Smartphone, label: specs.display },
    specs?.processor && { icon: Cpu, label: specs.processor },
    specs?.battery && { icon: Battery, label: specs.battery },
    specs?.camera && { icon: Camera, label: specs.camera },
  ].filter(Boolean);

  if (!quickSpecs.length) return null;

  return (
    <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      {quickSpecs.slice(0, 4).map((spec, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-muted-foreground bg-muted/50 px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg whitespace-nowrap flex-shrink-0"
        >
          <spec.icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span className="font-medium text-foreground/80">{spec.label}</span>
        </div>
      ))}
    </div>
  );
}

// Storage Options Component
export function StorageOptions({ options }) {
  if (!options?.length) return null;

  return (
    <div className="flex items-center gap-2 mb-3 md:mb-4">
      <span className="text-[10px] md:text-xs text-muted-foreground">
        Storage:
      </span>
      <div className="flex gap-1.5 md:gap-2">
        {options.map((storage, i) => (
          <span
            key={i}
            className="text-[10px] md:text-xs font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-md bg-secondary border border-border text-foreground"
          >
            {storage}
          </span>
        ))}
      </div>
    </div>
  );
}

// Color Options Component
export function ColorOptions({ options }) {
  if (!options?.length) return null;

  return (
    <div className="flex items-center gap-2 mb-3 md:mb-4">
      <span className="text-[10px] md:text-xs text-muted-foreground">
        Colors:
      </span>
      <div className="flex items-center gap-1.5 md:gap-2">
        {options.map((c, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-md bg-secondary border border-border text-foreground"
          >
            <span
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: c.hex }}
            />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
