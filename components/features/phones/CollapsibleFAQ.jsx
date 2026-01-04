/**
 * Collapsible FAQ - Accordion style
 * Real buyer questions only
 * UAE-specific where relevant
 */
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mb-6 md:mb-8">
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
          Common Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-secondary/50 border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between text-left hover:bg-secondary transition-colors"
              >
                <span className="font-medium text-foreground pr-4 text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 md:px-5 pb-3 md:pb-4 text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
