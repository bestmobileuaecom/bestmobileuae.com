import { SectionCard, ArrayEditor } from "../forms";

/**
 * BuySkipSection - Reasons to buy or skip this phone
 */
export default function BuySkipSection({ formData, updateField }) {
  return (
    <SectionCard number="4" title="Buy or Skip" subtitle="Is This Phone Right for You?">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ArrayEditor
          label="✓ Good for you if"
          items={formData.buy_reasons}
          onChange={(value) => updateField("buy_reasons", value)}
          placeholder="All-day battery that lasts 1.5 days..."
          labelColor="text-green-700"
        />
        
        <ArrayEditor
          label="✗ Avoid if"
          items={formData.skip_reasons}
          onChange={(value) => updateField("skip_reasons", value)}
          placeholder="Heavy games like Genshin will struggle..."
          labelColor="text-red-700"
        />
      </div>
    </SectionCard>
  );
}
