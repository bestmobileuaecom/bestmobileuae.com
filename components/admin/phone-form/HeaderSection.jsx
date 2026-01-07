import { Plus, Trash2 } from "lucide-react";
import {
  SectionCard,
  InputField,
  TextareaField,
  CommaSeparatedInput,
} from "../forms";

/**
 * HeaderSection - Phone header info (identity, scores, trust signals)
 */
export default function HeaderSection({ formData, updateField }) {
  return (
    <SectionCard
      number="1"
      title="Header Section"
      subtitle="Phone identity, score, trust signals, options"
    >
      <div className="space-y-4 pt-4">
        <TextareaField
          label="Identity (Description below phone name)"
          value={formData.identity}
          onChange={(v) => updateField("identity", v)}
          placeholder="The Samsung Galaxy A35 5G is a popular mid-range smartphone..."
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Overall Score (0-10)"
            value={formData.overall_score_rating}
            onChange={(v) => updateField("overall_score_rating", v)}
            placeholder="8.1"
            type="number"
            hint="e.g., 8.1"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Score Label
            </label>
            <select
              value={formData.overall_score_label || ""}
              onChange={(e) =>
                updateField("overall_score_label", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
            </select>
          </div>

          <InputField
            label="Why Pick (Score summary)"
            value={formData.why_pick}
            onChange={(v) => updateField("why_pick", v)}
            placeholder="Perfect everyday phone at this price"
          />
        </div>

        {/* Trust Signals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trust Signals (4 badges below price)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {formData.trust_signals.map((s, i) => (
              <div key={i} className="flex gap-1">
                <input
                  type="text"
                  value={s.icon}
                  onChange={(e) => {
                    const updated = [...formData.trust_signals];
                    updated[i] = { ...updated[i], icon: e.target.value };
                    updateField("trust_signals", updated);
                  }}
                  className="w-12 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm"
                  placeholder="🔋"
                />
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => {
                    const updated = [...formData.trust_signals];
                    updated[i] = { ...updated[i], label: e.target.value };
                    updateField("trust_signals", updated);
                  }}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="All-day battery"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Storage & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommaSeparatedInput
            label="Storage Options"
            value={formData.storage_options || []}
            onChange={(arr) => updateField("storage_options", arr)}
            placeholder="128GB, 256GB, 128GB | 6GB"
            hint="Comma separated"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color Options
            </label>
            <div className="space-y-1">
              {formData.color_options.map((c, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <span
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.hex || "#000" }}
                    aria-hidden
                  />
                  <input
                    type="text"
                    value={c.hex || ""}
                    onChange={(e) => {
                      const updated = [...formData.color_options];
                      updated[i] = { ...updated[i], hex: e.target.value };
                      updateField("color_options", updated);
                    }}
                    className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="#1E90FF"
                  />
                  <input
                    type="text"
                    value={c.name || ""}
                    onChange={(e) => {
                      const updated = [...formData.color_options];
                      updated[i] = { ...updated[i], name: e.target.value };
                      updateField("color_options", updated);
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Awesome Navy"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "color_options",
                        formData.color_options.filter((_, idx) => idx !== i)
                      )
                    }
                    className="p-1 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                updateField("color_options", [
                  ...formData.color_options,
                  { name: "", hex: "" },
                ])
              }
              className="mt-1 text-sm text-emerald-600 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
