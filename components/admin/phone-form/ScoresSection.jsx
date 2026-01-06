import { SectionCard } from "../forms";

/**
 * ScoresSection - Verdict scores (0-10)
 */
export default function ScoresSection({ formData, updateField }) {
  const scoreFields = [
    { key: "score_value", label: "Value 💰" },
    { key: "score_performance", label: "Daily Use 📱" },
    { key: "score_camera", label: "Camera 📸" },
    { key: "score_battery", label: "Battery 🔋" },
    { key: "score_display", label: "Display 🖥️" },
  ];

  return (
    <SectionCard number="5" title="Our Verdict Scores" subtitle="Rate 0-10, shows as 1-5 stars on frontend">
      <div className="pt-4">
        <div className="grid grid-cols-5 gap-3">
          {scoreFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-600 mb-1">
                {field.label}
              </label>
              <input 
                type="number" 
                min="0" 
                max="10" 
                value={formData[field.key] || ""} 
                onChange={(e) => updateField(field.key, e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center" 
                placeholder="8" 
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Score ÷ 2 = stars (e.g., 8 → 4 stars)
        </p>
      </div>
    </SectionCard>
  );
}
