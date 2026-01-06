import { Plus, Trash2 } from "lucide-react";
import { SectionCard } from "../forms";

/**
 * StorePricesSection - Where to buy in UAE
 */
export default function StorePricesSection({ 
  storePrices, 
  setStorePrices, 
  setHasUnsavedChanges 
}) {
  const handleUpdate = (index, field, value) => {
    const updated = [...storePrices];
    updated[index] = { ...updated[index], [field]: value };
    setStorePrices(updated);
    setHasUnsavedChanges(true);
  };

  const handleRemove = (index) => {
    setStorePrices(storePrices.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleAdd = () => {
    setStorePrices([...storePrices, { store_name: "", price: "", price_value: "", url: "" }]);
    setHasUnsavedChanges(true);
  };

  return (
    <SectionCard number="3" title="Store Prices" subtitle="Where to Buy in UAE">
      <div className="pt-4 space-y-2">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 px-2">
          <span className="col-span-3">Store Name</span>
          <span className="col-span-3">Display Price</span>
          <span className="col-span-2">Value (number)</span>
          <span className="col-span-3">URL</span>
          <span className="col-span-1"></span>
        </div>

        {storePrices.map((sp, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-lg">
            <input 
              type="text" 
              value={sp.store_name} 
              onChange={(e) => handleUpdate(i, "store_name", e.target.value)} 
              className="col-span-3 px-2 py-2 border border-gray-300 rounded text-sm" 
              placeholder="Noon" 
            />
            <input 
              type="text" 
              value={sp.price} 
              onChange={(e) => handleUpdate(i, "price", e.target.value)} 
              className="col-span-3 px-2 py-2 border border-gray-300 rounded text-sm" 
              placeholder="AED 1,179" 
            />
            <input 
              type="number" 
              value={sp.price_value} 
              onChange={(e) => handleUpdate(i, "price_value", e.target.value)} 
              className="col-span-2 px-2 py-2 border border-gray-300 rounded text-sm" 
              placeholder="1179" 
            />
            <input 
              type="text" 
              value={sp.url || ""} 
              onChange={(e) => handleUpdate(i, "url", e.target.value)} 
              className="col-span-3 px-2 py-2 border border-gray-300 rounded text-sm" 
              placeholder="https://..." 
            />
            <button 
              type="button" 
              onClick={() => handleRemove(i)} 
              className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded"
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
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>
    </SectionCard>
  );
}
