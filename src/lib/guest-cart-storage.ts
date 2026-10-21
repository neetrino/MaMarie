import { CART_KEY, CART_SNAPSHOT_KEY, CART_SUMMARY_KEY } from '../app/cart/constants';
import { replaceLoggedInCartDisplay, readLoggedInCartDisplay } from './cart-display-cache';
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
    selectedSize: item.selectedSize ?? null,
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

  if (items.length === 0) {
    localStorage.removeItem(CART_KEY);
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/** Clears guest cart lines from localStorage. */
export function clearGuestCartItems(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(CART_KEY);
}

export interface CartBadgeSummary {
  itemsCount: number;
  total: number;
}

/** Drops the legacy product-line cache so it cannot be shown again. */
export function clearLegacyCartProductSnapshot(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(CART_SNAPSHOT_KEY);
}

/** Reads the logged-in badge summary. Product lines are never stored. */
export function readCartBadgeSummary(): CartBadgeSummary | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CART_SUMMARY_KEY);
    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const itemsCount = (parsed as { itemsCount?: unknown }).itemsCount;
    const total = (parsed as { total?: unknown }).total;
    if (typeof itemsCount !== 'number' || itemsCount <= 0 || typeof total !== 'number') {
      return null;
    }

    return { itemsCount, total };
  } catch {
    return null;
  }
}

/** Persists badge counts only. */
export function writeCartBadgeSummary(summary: CartBadgeSummary | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  clearLegacyCartProductSnapshot();

  if (!summary || summary.itemsCount <= 0) {
    localStorage.removeItem(CART_SUMMARY_KEY);
    return;
  }

  localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(summary));
}

/** Stores badge counts from a cart and deletes any cached product lines. */
export function persistCartBadgeFromCart(cart: Cart | null): void {
  if (!cart || cart.items.length === 0 || cart.itemsCount <= 0) {
    writeCartBadgeSummary(null);
    return;
  }

  writeCartBadgeSummary({
    itemsCount: cart.itemsCount,
    total: cart.totals.total,
  });
}

/** Clears logged-in badge data and the instant drawer copy. */
export function clearCartSnapshot(): void {
  writeCartBadgeSummary(null);
  replaceLoggedInCartDisplay(null);
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

/**
 * Synchronous cart for the drawer.
 * Guests read their local cart. Logged-in users read the last confirmed cart,
 * then the open drawer refreshes it from the database.
 */
export function getInstantCartDisplay(isLoggedIn: boolean, productLabel: string): Cart | null {
  if (!isLoggedIn) {
    return getGuestCartFromStorage(productLabel);
  }

  return readLoggedInCartDisplay();
}

/**
 * Reconciles an in-flight guest API response onto the *current* localStorage lines.
 * Membership and quantities always come from `currentItems` so a concurrent remove/add
 * is not overwritten by a stale batch response.
 */
export function reconcileGuestItemsWithApiCart(
  currentItems: GuestCartItem[],
  apiCart: Cart | null,
  normalizedItems: GuestCartItem[] = [],
): GuestCartItem[] {
  if (currentItems.length === 0) {
    return [];
  }

  return currentItems.map((stored) => {
    const fromNormalized = normalizedItems.find(
      (item) => item.productId === stored.productId && item.variantId === stored.variantId,
    );
    const apiLine = apiCart?.items.find(
      (item) =>
        item.variant.product.id === stored.productId && item.variant.id === stored.variantId,
    );

    return {
      ...stored,
      ...(fromNormalized ?? {}),
      quantity: stored.quantity,
      productSlug:
        fromNormalized?.productSlug ?? apiLine?.variant.product.slug ?? stored.productSlug,
      price: apiLine?.price ?? fromNormalized?.price ?? stored.price,
      title: apiLine?.variant.product.title ?? stored.title ?? fromNormalized?.title,
      image: apiLine?.variant.product.image ?? stored.image ?? fromNormalized?.image,
      stock: apiLine?.variant.stock ?? stored.stock ?? fromNormalized?.stock,
      originalPrice:
        apiLine?.originalPrice ?? stored.originalPrice ?? fromNormalized?.originalPrice ?? null,
      sku: apiLine?.variant.sku || stored.sku || fromNormalized?.sku,
      selectedColor:
        apiLine?.selectedColor ??
        fromNormalized?.selectedColor ??
        stored.selectedColor,
      selectedSize:
        apiLine?.selectedSize ?? fromNormalized?.selectedSize ?? stored.selectedSize,
    };
  });
}

/** Filters server cart lines that were optimistically removed while a fetch was in flight. */
export function filterRemovedCartItems(cart: Cart, removedIds: ReadonlySet<string>): Cart {
  if (removedIds.size === 0) {
    return cart;
  }

  const items = cart.items.filter((item) => !removedIds.has(item.id));
  if (items.length === cart.items.length) {
    return cart;
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    items,
    itemsCount,
    totals: {
      ...cart.totals,
      subtotal,
      total: subtotal + cart.totals.tax + cart.totals.shipping - cart.totals.discount,
    },
  };
}

