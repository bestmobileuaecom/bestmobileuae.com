/**
 * Best Alternatives - Decision continuation
 * 3 small cards with context for each alternative
 */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BestAlternatives({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null;

  const getReasonColor = (reason) => {
    const lower = reason.toLowerCase();
    if (lower.includes("camera"))
      return "bg-purple-50 text-purple-700 border-purple-100";
    if (lower.includes("gaming"))
      return "bg-rose-50 text-rose-700 border-rose-100";
    if (lower.includes("battery"))
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (
      lower.includes("cheap") ||
      lower.includes("price") ||
      lower.includes("value")
    )
      return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Similar Phones to Consider
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/phones/${alt.slug}`}
              className="group bg-secondary/50 border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 relative bg-gradient-to-br from-secondary to-muted rounded-xl overflow-hidden flex-shrink-0 border border-border">
                  <Image
                    src={alt.image || "/placeholder-phone.png"}
                    alt={alt.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
                  {alt.name}
                </h3>
              </div>
              <div
                className={`rounded-lg px-3 py-2 border ${getReasonColor(
                  alt.reason
                )}`}
              >
                <p className="text-xs font-medium">✨ {alt.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
