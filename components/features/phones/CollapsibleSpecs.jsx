/**
 * Collapsible Specs - Key specs visible, full specs expandable
 * Shows 4 important specs cards by default
 * Full specs table hidden until user clicks expand
 * 
 * Note: Specs are primarily for SEO, not primary reading content
 */
"use client";
import { useState } from "react";
import { ChevronDown, Cpu, Monitor, Battery, Camera } from "lucide-react";

export default function CollapsibleSpecs({ specs, defaultOpen = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  // Helper to safely get nested value (handles both cases like Display or display)
  const getNestedValue = (obj, ...keys) => {
    for (const key of keys) {
      const val = obj?.[key] || obj?.[key.toLowerCase()] || obj?.[key.toUpperCase()];
      if (val) return val;
    }
    return null;
  };

  const getSpecString = (obj, primaryKey, fallbackKeys = [], priorityKeys = []) => {
    const category = getNestedValue(specs, primaryKey);
    if (!category) return null;
    if (typeof category === 'string') return category;
    
    // Helper to format value (e.g., numeric capacity to "5000mAh")
    const formatValue = (val, key) => {
      if (typeof val === 'number') {
        // Format battery capacity
        if (key.toLowerCase().includes('capacity')) {
          return `${val}mAh`;
        }
        // Format display size
        if (key.toLowerCase().includes('size') && val < 20) {
          return `${val}"`;
        }
        return String(val);
      }
      return val;
    };
    
    // First check priority keys (these should be shown first if they exist)
    for (const key of priorityKeys) {
      const val = category[key] || category[key.toLowerCase()];
      if (val !== undefined && val !== null) {
        const formatted = formatValue(val, key);
        if (typeof formatted === 'string') return formatted;
      }
      // Also check for keys containing the priority key name
      for (const catKey of Object.keys(category)) {
        if (catKey.toLowerCase().includes(key.toLowerCase())) {
          const formatted = formatValue(category[catKey], catKey);
          if (typeof formatted === 'string') return formatted;
        }
      }
    }
        // Try to find a meaningful value in the object
    const keysToTry = [primaryKey, ...fallbackKeys, 'Size', 'Type', 'Capacity', 'Main', 'Processor'];
    for (const key of keysToTry) {
      const val = category[key] || category[key.toLowerCase()];
      if (val !== undefined && val !== null) {
        const formatted = formatValue(val, key);
        if (typeof formatted === 'string') return formatted;
      }
    }
    // Look for keys that contain the fallback key names (e.g., "main_Single" contains "main")
    for (const catKey of Object.keys(category)) {
      for (const fallback of fallbackKeys) {
        if (catKey.toLowerCase().includes(fallback.toLowerCase())) {
          const formatted = formatValue(category[catKey], catKey);
          if (typeof formatted === 'string') return formatted;
        }
      }
    }
    // Return first string value
    for (const [k, v] of Object.entries(category)) {
      const formatted = formatValue(v, k);
      if (typeof formatted === 'string') return formatted;
    }
    return null;
  };

  // Special function to get display spec with size + type combined (e.g., "6.7" Super AMOLED")
  const getDisplaySpec = () => {
    const display = getNestedValue(specs, 'Display');
    if (!display) return null;
    
    // Find size value (could be "Size (inches)" or "Size")
    let size = null;
    for (const key of Object.keys(display)) {
      if (key.toLowerCase().includes('size')) {
        const val = display[key];
        size = typeof val === 'number' ? `${val}"` : val;
        break;
      }
    }
    
    // Find type value
    const type = display.Type || display.type || null;
    
    // Combine size and type if both exist
    if (size && type) {
      return `${size} ${type}`;
    }
    return size || type || null;
  };

  // Extract key specs to show by default
  const keySpecs = [
    {
      icon: Monitor,
      label: "Display",
      value: getDisplaySpec(),
      color: "bg-blue-50 border-blue-100 text-blue-600",
    },
    {
      icon: Cpu,
      label: "Processor",
      value: getSpecString(specs, 'Performance', ['Processor'], ['Chipset']) || getSpecString(specs, 'Processor'),
      color: "bg-amber-50 border-amber-100 text-amber-600",
    },
    {
      icon: Camera,
      label: "Camera",
      value: getSpecString(specs, 'Camera', ['Primary', 'main_Single', 'main_Quad', 'main_Triple', 'main_Dual'], ['Main', 'Rear Main']),
      color: "bg-purple-50 border-purple-100 text-purple-600",
    },
    {
      icon: Battery,
      label: "Battery",
      value: getSpecString(specs, 'Battery', ['Size', 'Charging'], ['Capacity']),
      color: "bg-emerald-50 border-emerald-100 text-emerald-600",
    },
  ].filter((spec) => spec.value);

  // Filter out non-object entries for full specs display
  const specEntries = Object.entries(specs || {}).filter(
    ([key, value]) => value && typeof value === 'object'
  );

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
        {isExpanded && specEntries.length > 0 && (
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
                {typeof items === "object" && items !== null ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                    {Object.entries(items).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4 py-2.5 border-b border-border/50 last:border-b-0"
                      >
                        <span className="text-sm text-muted-foreground">
                          {key}
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground text-sm">
                    {typeof items === 'string' ? items : JSON.stringify(items)}
                  </span>
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
