import { SectionCard, InputField, ImageUpload } from "../forms";

/**
 * BasicInfoSection - Required phone fields
 */
export default function BasicInfoSection({ 
  formData, 
  updateField, 
  brands, 
  errors,
  handleNameChange 
}) {
  return (
    <SectionCard number="0" title="Basic Info" subtitle="Required fields">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <InputField 
          label="Phone Name" 
          value={formData.name} 
          onChange={handleNameChange} 
          placeholder="Samsung Galaxy A35 5G" 
          required 
          error={errors.name} 
        />
        
        <InputField 
          label="URL Slug" 
          value={formData.slug} 
          onChange={(v) => updateField("slug", v)} 
          placeholder="samsung-galaxy-a35-5g" 
          required 
          error={errors.slug} 
        />
        
        <InputField 
          label="Display Price (AED)" 
          value={formData.price} 
          onChange={() => {}} 
          placeholder="Auto from store prices" 
          type="number" 
          disabled={true} 
          hint="Auto-calculated from lowest store price" 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand
          </label>
          <select 
            value={formData.brand_id || ""} 
            onChange={(e) => updateField("brand_id", e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Select</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select 
            value={formData.category} 
            onChange={(e) => updateField("category", e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="budget">Budget</option>
            <option value="mid-range">Mid-Range</option>
            <option value="flagship">Flagship</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        
        <ImageUpload 
          label="Phone Image" 
          value={formData.image_url} 
          onChange={(v) => updateField("image_url", v)}
          bucket="phone-images"
        />
      </div>
    </SectionCard>
  );
}
