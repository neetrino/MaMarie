'use client';

/**
 * Shared storage keys used to keep wishlist, compare and cart data in localStorage.
 */
export const STORAGE_KEYS = {
  wishlist: 'shop_wishlist',
  compare: 'shop_compare',
  cart: 'shop_cart_guest',
} as const;

export const WISHLIST_KEY = STORAGE_KEYS.wishlist;
export const COMPARE_KEY = STORAGE_KEYS.compare;
export const CART_KEY = STORAGE_KEYS.cart;

/**
 * Returns the stored length for an array kept under the provided key.
 */
function getStoredArrayLength(key: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) {
      return 0;
    }

    const cleaned = parsed.filter(
      (value): value is string =>
        typeof value === 'string' &&
        value.trim().length > 0 &&
        value !== 'undefined' &&
        value !== 'null'
    );

    // Heal corrupted legacy values so badges and pages stay in sync.
    if (cleaned.length !== parsed.length) {
      window.localStorage.setItem(key, JSON.stringify(cleaned));
    }

    return cleaned.length;
  } catch {
    return 0;
  }
}

/**
 * Retrieves wishlist items count from localStorage.
 */
export function getWishlistCount(): number {
  return getStoredArrayLength(WISHLIST_KEY);
}

/**
 * Retrieves compare items count from localStorage.
 */
export function getCompareCount(): number {
  return getStoredArrayLength(COMPARE_KEY);
}

interface GuestCartLine {
  quantity?: number;
}

interface GuestCartPayload {
  items?: GuestCartLine[];
  itemsCount?: number;
}

/**
 * Retrieves cart item quantity total from localStorage (guest cart).
 */
export function getCartCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = window.localStorage.getItem(CART_KEY);
    if (!stored) return 0;

    const parsed: GuestCartLine[] | GuestCartPayload = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    }

    if (typeof parsed.itemsCount === 'number') {
      return parsed.itemsCount;
    }

    if (Array.isArray(parsed.items)) {
      return parsed.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    }

    return 0;
  } catch {
    return 0;
  }
}

