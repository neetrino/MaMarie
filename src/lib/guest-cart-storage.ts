import { CART_KEY, CART_SNAPSHOT_KEY } from '../app/cart/constants';
import type { Cart, CartItem, GuestCartItem } from '../app/cart/types';

function guestItemToCartItem(item: GuestCartItem, index: number, productLabel: string): CartItem {
  const price = item.price ?? 0;

  return {
    id: `${item.productId}-${item.variantId}-${index}`,
    variant: {
      id: item.variantId,
      sku: item.sku ?? '',
      stock: item.stock,
      product: {
        id: item.productId,
        title: item.title ?? productLabel,
        slug: item.productSlug ?? '',
        image: item.image ?? null,
      },
    },
    quantity: item.quantity,
    price,
    originalPrice: item.originalPrice ?? null,
    total: price * item.quantity,
    selectedColor: item.selectedColor ?? null,
  };
}

/** Reads guest cart lines from localStorage. */
export function readGuestCartItems(): GuestCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

/** Persists guest cart lines to localStorage. */
export function writeGuestCartItems(items: GuestCartItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/** Builds a cart synchronously from localStorage (no network). */
export function buildCartFromGuestStorage(
  items: GuestCartItem[],
  productLabel: string,
): Cart | null {
  if (items.length === 0) {
    return null;
  }

  const cartItems = items.map((item, index) => guestItemToCartItem(item, index, productLabel));
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: 'guest-cart',
    items: cartItems,
    totals: {
      subtotal,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: subtotal,
      currency: 'AMD',
    },
    itemsCount,
  };
}

/** Instant guest cart for drawer/header — reads localStorage only. */
export function getGuestCartFromStorage(productLabel: string): Cart | null {
  return buildCartFromGuestStorage(readGuestCartItems(), productLabel);
}

/** Reads last API cart snapshot for logged-in instant display. */
export function readCartSnapshot(): Cart | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CART_SNAPSHOT_KEY);
    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const cart = parsed as Cart;
    return Array.isArray(cart.items) && cart.items.length > 0 ? cart : null;
  } catch {
    return null;
  }
}

/** Persists cart snapshot after a successful API fetch. */
export function writeCartSnapshot(cart: Cart | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!cart || cart.items.length === 0) {
    localStorage.removeItem(CART_SNAPSHOT_KEY);
    return;
  }

  localStorage.setItem(CART_SNAPSHOT_KEY, JSON.stringify(cart));
}

/** Synchronous cart for drawer — guest lines or logged-in snapshot. */
export function getInstantCartDisplay(isLoggedIn: boolean, productLabel: string): Cart | null {
  if (!isLoggedIn) {
    return getGuestCartFromStorage(productLabel);
  }

  return readCartSnapshot() ?? getGuestCartFromStorage(productLabel);
}

/** Merges API cart display fields back into localStorage snapshot. */
export function syncGuestCartDisplayFromApiCart(
  cart: Cart,
  storedItems: GuestCartItem[],
): GuestCartItem[] {
  return storedItems.map((stored) => {
    const apiLine = cart.items.find(
      (item) =>
        item.variant.product.id === stored.productId && item.variant.id === stored.variantId,
    );

    if (!apiLine) {
      return stored;
    }

    return {
      ...stored,
      productSlug: apiLine.variant.product.slug || stored.productSlug,
      price: apiLine.price,
      title: apiLine.variant.product.title,
      image: apiLine.variant.product.image ?? stored.image,
      stock: apiLine.variant.stock,
      originalPrice: apiLine.originalPrice ?? stored.originalPrice,
      sku: apiLine.variant.sku || stored.sku,
      selectedColor: apiLine.selectedColor ?? stored.selectedColor,
    };
  });
}

/** Keeps cached display fields when server normalizes cart lines. */
export function mergeNormalizedGuestItems(
  normalized: GuestCartItem[],
  storedItems: GuestCartItem[],
): GuestCartItem[] {
  return normalized.map((item) => {
    const prev = storedItems.find(
      (stored) => stored.productId === item.productId && stored.variantId === item.variantId,
    );

    if (!prev) {
      return item;
    }

    return {
      ...prev,
      ...item,
      title: item.title ?? prev.title,
      image: item.image ?? prev.image,
      stock: item.stock ?? prev.stock,
      originalPrice: item.originalPrice ?? prev.originalPrice,
      sku: item.sku ?? prev.sku,
      selectedColor: item.selectedColor ?? prev.selectedColor,
    };
  });
}
