/**
 * CommaSeparatedInput - Input for comma-separated values
 * Uses local state to allow natural typing, only converts to array on blur
 */
import { useState, useEffect, useRef } from "react";

export default function CommaSeparatedInput({
  label,
  value = [], // Array of values
  onChange, // Receives array
  placeholder,
  required,
  error,
  hint,
  className = "",
  disabled = false,
}) {
  // Local state for the text input - allows natural typing
  const [inputValue, setInputValue] = useState(() => 
    Array.isArray(value) ? value.join(", ") : ""
  );
  const isFocused = useRef(false);

  // Sync local state when external value changes (e.g., on form load)
  // But NOT when the input is focused (user is typing)
  useEffect(() => {
    if (!isFocused.current && Array.isArray(value)) {
      setInputValue(value.join(", "));
    }
  }, [value]);

  // Handle input change - just update local state, don't process
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    isFocused.current = true;
  };

  // Handle blur - convert to array and notify parent
  const handleBlur = () => {
    isFocused.current = false;
    const parsed = inputValue
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(parsed);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
