/**
 * Internal Links Section - SEO contextual links
 * Helps Google discover related content and improves site structure
 */
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Smartphone,
  GitCompare,
  Signal,
  BatteryFull,
} from "lucide-react";

export default function InternalLinks({ phone, relatedLinks }) {
  if (!relatedLinks || relatedLinks.length === 0) return null;

  const getLinkConfig = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes("compare"))
      return {
        icon: GitCompare,
        color:
          "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100",
      };
    if (lower.includes("5g"))
      return {
        icon: Signal,
        color: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100",
      };
    if (lower.includes("battery"))
      return {
        icon: BatteryFull,
        color:
          "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100",
      };
    if (lower.includes("samsung") || lower.includes("phone"))
      return {
        icon: Smartphone,
        color: "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100",
      };
    return {
      icon: Search,
      color: "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100",
    };
  };

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {relatedLinks.map((link, idx) => {
            const config = getLinkConfig(link.label);
            const IconComponent = config.icon;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${config.color}`}
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-card/80 border border-current/10 flex items-center justify-center">
                  <IconComponent className="w-4.5 h-4.5" />
                </span>
                <span className="flex-1 text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  {link.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
