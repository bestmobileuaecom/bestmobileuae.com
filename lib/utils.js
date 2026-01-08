import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with 2 decimal places and thousand separators
 * @param {number|string} value - Price value
 * @param {boolean} includeAED - Whether to include "AED" prefix (default: false)
 * @returns {string} Formatted price like "3,919.00" or "AED 3,919.00"
 */
export function formatPrice(value, includeAED = false) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return includeAED ? `AED ${formatted}` : formatted;
}
