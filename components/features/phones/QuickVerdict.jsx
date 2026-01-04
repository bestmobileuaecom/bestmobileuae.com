/**
 * Quick Verdict Section
 * Direct Yes/No format for instant clarity
 * Plain English heading: "Should You Buy This Phone?"
 */
import { Lightbulb, Check, X } from "lucide-react";

export default function QuickVerdict({ verdict }) {
  // Split verdict into Yes and No parts if it contains both
  const hasYesNo = verdict.includes("Yes,") && verdict.includes("No,");
  let yesPart = "";
  let noPart = "";

  if (hasYesNo) {
    const parts = verdict.split(/No,\s*/);
    yesPart = parts[0].replace(/^Yes,\s*/, "").replace(/\.\s*$/, "");
    noPart = parts[1] ? parts[1].replace(/\.\s*$/, "") : "";
  }

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Should You Buy This Phone?
        </h2>
        {hasYesNo ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-emerald-700">Yes</span>, if
                you want {yesPart}.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-100 flex-shrink-0">
                <X className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-rose-700">No</span>, if{" "}
                {noPart}.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
              {verdict}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
