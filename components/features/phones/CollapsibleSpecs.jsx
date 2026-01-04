/**
 * Collapsible Specs - Key specs visible, full specs expandable
 * Shows 4 important specs cards by default
 * Full specs table hidden until user clicks expand
 */
"use client";
import { useState } from "react";
import { ChevronDown, Cpu, Monitor, Battery, Camera } from "lucide-react";

export default function CollapsibleSpecs({ specs }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract key specs to show by default
  const keySpecs = [
    {
      icon: Monitor,
      label: "Display",
      value: specs?.Display?.Size
        ? `${specs.Display.Size} ${specs.Display.Type || ""}`
        : null,
      color: "bg-blue-50 border-blue-100 text-blue-600",
    },
    {
      icon: Cpu,
      label: "Processor",
      value: specs?.Performance?.Processor || null,
      color: "bg-amber-50 border-amber-100 text-amber-600",
    },
    {
      icon: Battery,
      label: "Battery",
      value: specs?.Battery?.Capacity || null,
      color: "bg-emerald-50 border-emerald-100 text-emerald-600",
    },
    {
      icon: Camera,
      label: "Camera",
      value: specs?.Camera?.Main || null,
      color: "bg-purple-50 border-purple-100 text-purple-600",
    },
  ].filter((spec) => spec.value);

  const specEntries = Object.entries(specs);

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 pb-0">
          <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
            Specifications
          </h2>

          {/* Key Specs - Always visible */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {keySpecs.map((spec, idx) => {
              const IconComponent = spec.icon;
              return (
                <div
                  key={idx}
                  className="bg-secondary/50 border border-border rounded-xl p-4 text-center"
                >
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${spec.color} border mb-2`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </span>
                  <div className="text-xs text-muted-foreground mb-1">
                    {spec.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground leading-tight">
                    {spec.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Full specs - only when expanded */}
        {isExpanded && (
          <div className="border-t border-border">
            {specEntries.map(([category, items], idx) => (
              <div
                key={category}
                className={`px-4 md:px-6 py-4 ${
                  idx !== specEntries.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <h4 className="font-semibold text-foreground text-sm mb-3">
                  {category}
                </h4>
                {typeof items === "object" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                    {Object.entries(items).map(([key, value], rowIdx) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4 py-2.5 border-b border-border/50 last:border-b-0"
                      >
                        <span className="text-sm text-muted-foreground">
                          {key}
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground text-sm">{items}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full px-4 md:px-6 py-3.5 bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground ${
            isExpanded ? "border-t border-border" : ""
          }`}
        >
          <span>
            {isExpanded
              ? "Hide Full Specifications"
              : "View All Specifications"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </section>
  );
}
