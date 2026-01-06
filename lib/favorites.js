/**
 * Cookie-based favorites/likes management
 * Stores liked phone slugs in a cookie for persistence
 */

const COOKIE_NAME = "bestmobile_favorites";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// Use a unique, stable event name for real-time sync
const FAVORITES_CHANGED_EVENT = "bestmobile:favorites:changed";

/**
 * Dispatch a custom event when favorites change
 */
function dispatchFavoritesChanged(slugs) {
  if (typeof window !== "undefined") {
    // Use a custom event on window for real-time sync across components
    const event = new CustomEvent(FAVORITES_CHANGED_EVENT, { 
      detail: { slugs },
      bubbles: false,
      cancelable: false
    });
    window.dispatchEvent(event);
  }
}

/**
 * Get all liked phone slugs from cookie
 */
export function getLikedPhones() {
  if (typeof document === "undefined") return [];
  
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  
  if (!cookie) return [];
  
  try {
    const value = decodeURIComponent(cookie.split("=")[1]);
    return JSON.parse(value);
  } catch {
    return [];
  }
}

/**
 * Check if a phone is liked
 */
export function isPhoneLiked(slug) {
  const liked = getLikedPhones();
  return liked.includes(slug);
}

/**
 * Toggle like status for a phone
 * Returns the new like status (true = liked, false = not liked)
 */
export function togglePhoneLike(slug) {
  const liked = getLikedPhones();
  let newLiked;
  let isNowLiked;
  
  if (liked.includes(slug)) {
    // Remove from likes
    newLiked = liked.filter((s) => s !== slug);
    isNowLiked = false;
  } else {
    // Add to likes
    newLiked = [...liked, slug];
    isNowLiked = true;
  }
  
  // Save to cookie
  const cookieValue = encodeURIComponent(JSON.stringify(newLiked));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  
  // Dispatch event for real-time sync
  dispatchFavoritesChanged(newLiked);
  
  return isNowLiked;
}

/**
 * Add a phone to likes
 */
export function likePhone(slug) {
  const liked = getLikedPhones();
  if (liked.includes(slug)) return true;
  
  const newLiked = [...liked, slug];
  const cookieValue = encodeURIComponent(JSON.stringify(newLiked));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  
  // Dispatch event for real-time sync
  dispatchFavoritesChanged(newLiked);
  
  return true;
}

/**
 * Remove a phone from likes
 */
export function unlikePhone(slug) {
  const liked = getLikedPhones();
  if (!liked.includes(slug)) return false;
  
  const newLiked = liked.filter((s) => s !== slug);
  const cookieValue = encodeURIComponent(JSON.stringify(newLiked));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  
  // Dispatch event for real-time sync
  dispatchFavoritesChanged(newLiked);
  
  return false;
}

/**
 * Get the count of liked phones
 */
export function getLikedCount() {
  return getLikedPhones().length;
}

/**
 * Subscribe to favorites changes
 * Returns an unsubscribe function
 */
export function onFavoritesChange(callback) {
  if (typeof window === "undefined") return () => {};
  
  // Listen for custom event
  const customHandler = (event) => {
    callback(event.detail.slugs);
  };
  window.addEventListener(FAVORITES_CHANGED_EVENT, customHandler);
  
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, customHandler);
  };
}
