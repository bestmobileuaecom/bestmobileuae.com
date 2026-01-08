import PhoneHeader from "@/components/features/phones/PhoneHeader.jsx";
import ShouldYouBuy from "./ShouldYouBuy";
import PriceByStore from "./PriceByStore";
import PriceAlertForm from "./PriceAlertForm";
import VerdictScores from "./VerdictScores";
import BestAlternatives from "./BestAlternatives";
import CollapsibleSpecs from "./CollapsibleSpecs";
import CollapsibleFAQ from "./CollapsibleFAQ";

/**
 * PhoneDetailPage - Simplified MVP structure
 * 
 * Structure (mentor-recommended):
 * 1. Header (image, price, score, CTA)
 * 2. Should You Buy? (2 bullets only - yes/no)
 * 3. Where to Buy (affiliate)
 * 4. Price Alert
 * 5. Verdict Scores (5 metrics)
 * 6. Similar Phones (auto-linked)
 * 7. Specifications (collapsed)
 * 8. FAQs (template)
 */
export default function phoneDetailPage({ phone }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* 1. Header - Recognition */}
        <PhoneHeader phone={phone} />

        {/* 2. Should You Buy? - 2 bullets only */}
        {(phone.buyReason || phone.skipReason) && (
          <ShouldYouBuy buyReason={phone.buyReason} skipReason={phone.skipReason} />
        )}

        {/* 3. Where to Buy - Affiliate ready */}
        {phone.storePrices && phone.storePrices.length > 0 && (
          <PriceByStore storePrices={phone.storePrices} phoneName={phone.name} />
        )}

        {/* 4. Price Alert - High perceived value */}
        {phone.id && (
          <div id="price-alert" className="mb-6 md:mb-8 scroll-mt-24">
            <PriceAlertForm phoneId={phone.id} phoneName={phone.name} />
          </div>
        )}

        {/* 5. Verdict Scores - 5 metrics */}
        {phone.scores && (
          <VerdictScores scores={phone.scores} />
        )}

        {/* 6. Similar Phones - Options */}
        {phone.alternatives && phone.alternatives.length > 0 && (
          <BestAlternatives alternatives={phone.alternatives} />
        )}

        {/* 7. Specifications - Collapsed by default (SEO) */}
        {phone.specs && <CollapsibleSpecs specs={phone.specs} defaultOpen={false} />}

        {/* 8. FAQs - Template based (SEO) */}
        {phone.faqs && phone.faqs.length > 0 && (
          <CollapsibleFAQ faqs={phone.faqs} />
        )}
      </div>
    </div>
  );
}
