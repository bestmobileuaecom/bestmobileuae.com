import { Plus, Trash2 } from "lucide-react";

/**
 * ArrayEditor - Reusable component for editing arrays of strings
 */
export default function ArrayEditor({ 
  label, 
  items = [], 
  onChange, 
  placeholder = "Enter value...",
  labelColor = "text-gray-700" 
}) {
  const handleUpdate = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...items, ""]);
  };

  return (
    <div>
      <label className={`block text-sm font-medium ${labelColor} mb-2`}>
        {label}
      </label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-1 mb-1">
          <input
            type="text"
            value={item}
            onChange={(e) => handleUpdate(index, e.target.value)}
            className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-emerald-600 flex items-center gap-1 hover:text-emerald-700"
      >
        <Plus className="w-3 h-3" />
        Add
      </button>
    </div>
  );
}
