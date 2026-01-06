/**
 * InputField - Reusable text/number input with label
 */
export default function InputField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required, 
  error, 
  hint, 
  className = "", 
  disabled = false 
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
