import { apiClient } from '../../lib/api-client';
import {
  buildCartFromGuestStorage,
  persistCartBadgeFromCart,
  readGuestCartItems,
  reconcileGuestItemsWithApiCart,
  writeGuestCartItems,
} from '../../lib/guest-cart-storage';
import { getCartDisplayEpoch, writeLoggedInCartDisplay } from '../../lib/cart-display-cache';
import { isClientLoggedIn } from '../../lib/storageCounts';
import { logger } from '../../lib/utils/logger';
import { getStoredLanguage } from '../../lib/language';
import type { Cart, GuestCartItem } from './types';

/**
 * Guest cart item from batch API
 */
interface GuestCartBatchResponse {
  cart: Cart | null;
  normalizedItems: GuestCartItem[];
}

function guestLineKey(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}

function hasSameGuestLineIds(left: GuestCartItem[], right: GuestCartItem[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const rightKeys = new Set(right.map((item) => guestLineKey(item.productId, item.variantId)));
  return left.every((item) => rightKeys.has(guestLineKey(item.productId, item.variantId)));
}

function productWasFound(
  item: GuestCartItem,
  normalized: GuestCartItem[],
  cart: Cart | null,
): boolean {
  if (normalized.some((line) => line.productId === item.productId)) {
    return true;
  }

  return Boolean(cart?.items.some((line) => line.variant.product.id === item.productId));
}

/** Re-export for instant cart drawer reads. */
export { getGuestCartFromStorage } from '../../lib/guest-cart-storage';

function applyGuestBatch(
  itemsAtStart: GuestCartItem[],
  batch: GuestCartBatchResponse,
  productLabel: string,
): Cart | null {
  const current = readGuestCartItems();
  if (current.length === 0) {
    return null;
  }

  if (!hasSameGuestLineIds(itemsAtStart, current)) {
    return buildCartFromGuestStorage(current, productLabel);
  }

  const normalized = Array.isArray(batch.normalizedItems) ? batch.normalizedItems : [];
  const confirmed = current.filter((item) => productWasFound(item, normalized, batch.cart));
  const reconciled = reconcileGuestItemsWithApiCart(confirmed, batch.cart, normalized);
  writeGuestCartItems(reconciled);
  return buildCartFromGuestStorage(reconciled, productLabel);
}

/**
 * Fetch guest cart. Membership changed during the request stays local,
 * so a stale response cannot restore a removed line or swap in another product.
 */
export async function fetchGuestCart(
  t: (key: string) => string
): Promise<Cart | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const productLabel = t('common.messages.product');
  const itemsAtStart = readGuestCartItems();
  if (itemsAtStart.length === 0) {
    return null;
  }

  try {
    const batch = await apiClient.post<GuestCartBatchResponse>('/api/v1/cart/guest', {
      items: itemsAtStart,
      lang: getStoredLanguage(),
    });
    return applyGuestBatch(itemsAtStart, batch, productLabel);
  } catch (error: unknown) {
    logger.warn('[CART] Guest batch fetch failed, showing the local cart', { error });
    return buildCartFromGuestStorage(readGuestCartItems(), productLabel);
  }
}

/**
 * Fetch logged-in user cart
 */
export async function fetchLoggedInCart(): Promise<Cart | null> {
  try {
    const response = await apiClient.get<{ cart: Cart }>('/api/v1/cart');
    return response.cart;
  } catch (error: unknown) {
    logger.error('Error fetching cart', { error });
    return null;
  }
}

/** Loads the logged-in cart before the drawer opens, so the first paint is not empty. */
export function prefetchLoggedInCartDisplay(): void {
  if (!isClientLoggedIn()) {
    return;
  }

  const epoch = getCartDisplayEpoch();
  void fetchLoggedInCart().then((cart) => {
    if (!cart || getCartDisplayEpoch() !== epoch) {
      return;
    }

    writeLoggedInCartDisplay(cart);
    persistCartBadgeFromCart(cart);
  });
}

/**
 * Fetch cart (guest or logged-in)
 */
export async function fetchCart(
  isLoggedIn: boolean,
  t: (key: string) => string
): Promise<Cart | null> {
  if (!isLoggedIn) {
    return fetchGuestCart(t);
  }
  return fetchLoggedInCart();
}




