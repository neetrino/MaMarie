import type { Dispatch, SetStateAction } from 'react';
import { apiClient } from '../../lib/api-client';
import { dispatchCartUpdated } from '../../lib/cart-events';
import { logger } from '../../lib/utils/logger';
import { replaceLoggedInCartDisplay } from '../../lib/cart-display-cache';
import {
  buildCartFromGuestStorage,
  clearCartSnapshot,
  clearGuestCartItems,
  readGuestCartItems,
  persistCartBadgeFromCart,
  writeGuestCartItems,
} from '../../lib/guest-cart-storage';
import type { Cart, CartItem, GuestCartItem } from './types';
import { showToast } from '../../components/Toast';

type SetCartState = Dispatch<SetStateAction<Cart | null>>;

/**
 * Resolve guest cart line by composite id `${productId}-${variantId}-${index}`.
 * Exact match first — product/variant ids must not be re-parsed (cuid-safe).
 */
function resolveGuestLineIndex(guestCart: GuestCartItem[], itemId: string): number {
  const exactIndex = guestCart.findIndex(
    (item, index) => `${item.productId}-${item.variantId}-${index}` === itemId,
  );
  if (exactIndex >= 0) {
    return exactIndex;
  }

  // Legacy fallback: match by product+variant when only one line exists for that pair.
  const candidates = guestCart
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => itemId.startsWith(`${item.productId}-${item.variantId}-`));

  return candidates.length === 1 ? candidates[0].index : -1;
}

function syncGuestCartState(
  setCart: SetCartState,
  productLabel: string,
): Cart | null {
  const cart = buildCartFromGuestStorage(readGuestCartItems(), productLabel);
  setCart(cart);
  return cart;
}

function isQuantityAboveStock(stock: number | undefined, quantity: number): boolean {
  return stock !== undefined && stock > 0 && quantity > stock;
}

function isAtMaxStock(stock: number | undefined, quantity: number): boolean {
  return stock !== undefined && stock > 0 && quantity >= stock;
}

/** Whether the increase button should be disabled for a cart line. */
export function isCartItemAtMaxStock(stock: number | undefined, quantity: number): boolean {
  return isAtMaxStock(stock, quantity);
}

/** Whether the requested quantity exceeds available stock. */
export function isCartItemQuantityAboveStock(stock: number | undefined, quantity: number): boolean {
  return isQuantityAboveStock(stock, quantity);
}

/**
 * Calculate cart totals
 */
function calculateCartTotals(items: CartItem[], existingTotals: Cart['totals']): Cart['totals'] {
  const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  return {
    ...existingTotals,
    subtotal: newSubtotal,
    total: newSubtotal + existingTotals.tax + existingTotals.shipping - existingTotals.discount,
  };
}

function withCartItems(cart: Cart, items: CartItem[]): Cart {
  return {
    ...cart,
    items,
    totals: calculateCartTotals(items, cart.totals),
    itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function withoutCartLine(cart: Cart, itemId: string): Cart {
  return withCartItems(cart, cart.items.filter((item) => item.id !== itemId));
}

function withLineQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  return withCartItems(
    cart,
    cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity, total: item.price * quantity } : item,
    ),
  );
}

function persistLoggedInCart(cart: Cart): void {
  clearGuestCartItems();
  replaceLoggedInCartDisplay(cart);
  persistCartBadgeFromCart(cart);
  dispatchCartUpdated({
    localOnly: true,
    cartSummary: {
      itemsCount: cart.itemsCount,
      total: cart.totals.total,
    },
  });
}

/**
 * Remove item from guest cart in localStorage
 */
function removeFromGuestCart(itemId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const guestCart = readGuestCartItems();
  const lineIndex = resolveGuestLineIndex(guestCart, itemId);
  if (lineIndex < 0) {
    return false;
  }

  guestCart.splice(lineIndex, 1);
  writeGuestCartItems(guestCart);
  return true;
}

/**
 * Update item quantity in guest cart in localStorage
 */
function updateGuestCartQuantity(itemId: string, quantity: number): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const guestCart = readGuestCartItems();
  const lineIndex = resolveGuestLineIndex(guestCart, itemId);
  if (lineIndex < 0) {
    return false;
  }

  guestCart[lineIndex].quantity = quantity;
  writeGuestCartItems(guestCart);
  return true;
}

async function syncLoggedInQuantity(
  itemId: string,
  quantity: number,
  fetchCart: (silent?: boolean) => Promise<void>,
  t: (key: string) => string,
): Promise<void> {
  try {
    await apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity });
    await fetchCart(true);
  } catch (error: unknown) {
    const errorObj = error as { detail?: string; message?: string };
    logger.error('Error updating quantity', { error, itemId });
    await fetchCart(true);

    const errorMessage = errorObj?.detail || errorObj?.message || t('common.messages.failedToUpdateQuantity');
    if (errorMessage.includes('stock') || errorMessage.includes('exceeds')) {
      showToast(t('common.alerts.stockInsufficient').replace('{message}', errorMessage), 'error');
    } else {
      showToast(errorMessage, 'error');
    }
  }
}

/**
 * Handle remove item from cart.
 * `currentCart` must be the rendered cart: the decision to call the API cannot
 * depend on a state updater, because React may run it after this function returns.
 */
export async function handleRemoveItem(
  itemId: string,
  isLoggedIn: boolean,
  currentCart: Cart | null,
  setCart: SetCartState,
  fetchCart: () => Promise<void>,
  productLabel: string,
): Promise<boolean> {
  if (!isLoggedIn) {
    if (!removeFromGuestCart(itemId)) {
      return false;
    }

    const guestCart = syncGuestCartState(setCart, productLabel);
    clearCartSnapshot();
    dispatchCartUpdated({
      localOnly: true,
      cartSummary: {
        itemsCount: guestCart?.itemsCount ?? 0,
        total: guestCart?.totals.total ?? 0,
      },
    });
    return true;
  }

  if (!currentCart?.items.some((item) => item.id === itemId)) {
    return false;
  }

  setCart((prevCart) => (prevCart ? withoutCartLine(prevCart, itemId) : prevCart));
  persistLoggedInCart(withoutCartLine(currentCart, itemId));

  try {
    await apiClient.delete(`/api/v1/cart/items/${itemId}`);
    await fetchCart();
    return true;
  } catch (error: unknown) {
    logger.error('Error removing item', { error, itemId });
    return false;
  }
}

/**
 * Handle update item quantity in cart (optimistic UI, API sync in background).
 */
export function handleUpdateQuantity(
  itemId: string,
  quantity: number,
  isLoggedIn: boolean,
  currentCart: Cart | null,
  setCart: SetCartState,
  fetchCart: (silent?: boolean) => Promise<void>,
  t: (key: string) => string,
  productLabel: string,
): void {
  if (quantity < 1) {
    void handleRemoveItem(itemId, isLoggedIn, currentCart, setCart, () => fetchCart(true), productLabel);
    return;
  }

  const cartItem = readCartItemForUpdate(itemId, isLoggedIn, currentCart, productLabel);
  if (!cartItem) {
    return;
  }

  if (isQuantityAboveStock(cartItem.variant.stock, quantity)) {
    showToast(`Մատչելի քանակը ${cartItem.variant.stock} հատ է: Դուք չեք կարող ավելացնել ավելի շատ քանակ:`, 'warning');
    return;
  }

  if (!isLoggedIn) {
    if (!updateGuestCartQuantity(itemId, quantity)) {
      return;
    }

    const guestCart = syncGuestCartState(setCart, productLabel);
    clearCartSnapshot();
    dispatchCartUpdated({
      localOnly: true,
      cartSummary: {
        itemsCount: guestCart?.itemsCount ?? 0,
        total: guestCart?.totals.total ?? 0,
      },
    });
    return;
  }

  if (!currentCart) {
    return;
  }

  setCart((prevCart) => (prevCart ? withLineQuantity(prevCart, itemId, quantity) : prevCart));
  persistLoggedInCart(withLineQuantity(currentCart, itemId, quantity));
  void syncLoggedInQuantity(itemId, quantity, fetchCart, t);
}

function readCartItemForUpdate(
  itemId: string,
  isLoggedIn: boolean,
  currentCart: Cart | null,
  productLabel: string,
): CartItem | undefined {
  if (!isLoggedIn) {
    const guestCart = readGuestCartItems();
    const lineIndex = resolveGuestLineIndex(guestCart, itemId);
    if (lineIndex < 0) {
      return undefined;
    }

    const line = guestCart[lineIndex];
    const price = line.price ?? 0;
    return {
      id: `${line.productId}-${line.variantId}-${lineIndex}`,
      variant: {
        id: line.variantId,
        sku: line.sku ?? '',
        stock: line.stock,
        product: {
          id: line.productId,
          title: line.title ?? productLabel,
          slug: line.productSlug ?? '',
          image: line.image ?? null,
        },
      },
      quantity: line.quantity,
      price,
      originalPrice: line.originalPrice ?? null,
      total: price * line.quantity,
      selectedColor: line.selectedColor ?? null,
      selectedSize: line.selectedSize ?? null,
    };
  }

  return currentCart?.items.find((item) => item.id === itemId);
}
