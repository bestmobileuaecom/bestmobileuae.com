import PhoneHeader from "@/components/features/phones/PhoneHeader.jsx";
import QuickVerdict from "./QuickVerdict";
import PriceByStore from "./PriceByStore";
import PriceAlertForm from "./PriceAlertForm";
import BuySkipBox from "./BuySkipBox";
import ScoreStrip from "./ScoreStrip";
import PriceComparison from "./PriceComparison";
import KeyDifferences from "./KeyDifferences";
import FinalRecommendation from "./FinalRecommendation";
import BestAlternatives from "./BestAlternatives";
import CollapsibleSpecs from "./CollapsibleSpecs";
import InternalLinks from "./InternalLinks";
import CollapsibleFAQ from "./CollapsibleFAQ";

export default function phoneDetailPage({ phone }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Max width container - clean single column layout */}
      <div className="max-w-7xl mx-auto px-4 ">
        {/* 1. Header - Recognition  */}
        <PhoneHeader phone={phone} />
        {/* 2. Quick Verdict - Judgement */}
        {phone.verdict && <QuickVerdict verdict={phone.verdict} />}
        {/* 3. Price by Store - Where to buy */}
        {phone.storePrices && phone.storePrices.length > 0 && (
          <PriceByStore storePrices={phone.storePrices} phoneName={phone.name} />
        )}
        {/* 3.5 Price Alert Form */}
        {phone.id && (
          <div id="price-alert" className="mb-6 md:mb-8 scroll-mt-24">
            <PriceAlertForm phoneId={phone.id} phoneName={phone.name} />
          </div>
        )}
        {/* 4. Buy/Skip Box - Personal fit */}
        {phone.buyReasons && phone.skipReasons && (
          <BuySkipBox
            buyReasons={phone.buyReasons}
            skipReasons={phone.skipReasons}
          />
        )}
        {/* 5. Score Strip - At-a-glance */}
        {phone.scores && phone.scores.length > 0 && (
          <ScoreStrip scores={phone.scores} />
        )}
        {/* 7. Key Differences - Understanding */}
        {phone.keyDifferences && phone.keyDifferences.length > 0 && (
          <KeyDifferences differences={phone.keyDifferences} />
        )}
        {/* 6. Price Comparison - How it compares */}
        {phone.priceComparison && (
          <PriceComparison
            comparisons={phone.priceComparison}
            pricePoint={phone.priceRange}
          />
        )}
        {/* 8. Final Recommendation - Decision Closure */}
        {phone.finalRecommendation && (
          <FinalRecommendation recommendation={phone.finalRecommendation} />
        )}

        {/* 9. Best Alternatives - Options */}
        {phone.alternatives && phone.alternatives.length > 0 && (
          <BestAlternatives alternatives={phone.alternatives} />
        )}

        {/* 10. Specs - Details if needed (collapsed) */}
        {phone.specs && <CollapsibleSpecs specs={phone.specs} />}

        {/* 12. FAQ - Last (collapsed) */}
        {phone.faqs && phone.faqs.length > 0 && (
          <CollapsibleFAQ faqs={phone.faqs} />
        )}
        {/* 11. Internal Links - SEO */}
        {phone.relatedLinks && phone.relatedLinks.length > 0 && (
          <InternalLinks phone={phone} relatedLinks={phone.relatedLinks} />
        )}
      </div>
    </div>
  );
}
