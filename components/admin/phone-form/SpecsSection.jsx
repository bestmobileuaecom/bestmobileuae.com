import { SectionCard } from "../forms";

/**
 * SpecsSection - Full specifications in JSON format
 */
export default function SpecsSection({ specsText, setSpecsText, setHasUnsavedChanges, updateField }) {
  const handleChange = (e) => {
    setSpecsText(e.target.value);
    setHasUnsavedChanges(true);
    try {
      updateField("specs", JSON.parse(e.target.value));
    } catch {
      // Invalid JSON, will be handled on save
    }
  };

  return (
    <SectionCard number="10" title="Specifications" subtitle="Full specs (JSON format)">
      <div className="pt-4">
        <textarea 
          value={specsText} 
          onChange={handleChange} 
          rows={12} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs" 
          placeholder='{"Display": {"Size": "6.6 inches", "Type": "Super AMOLED"}, ...}' 
        />
        <p className="text-xs text-gray-500 mt-1">
          Use categories: Display, Performance, Camera, Battery, Network, Build, Software
        </p>
      </div>
    </SectionCard>
  );
}
