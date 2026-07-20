import type { Dispatch, SetStateAction } from 'react';
import { apiClient } from '../../lib/api-client';
import { dispatchCartUpdated } from '../../lib/cart-events';
import { logger } from '../../lib/utils/logger';
import {
  buildCartFromGuestStorage,
  readGuestCartItems,
  writeCartSnapshot,
  writeGuestCartItems,
} from '../../lib/guest-cart-storage';
import type { Cart, CartItem, GuestCartItem } from './types';
import { showToast } from '../../components/Toast';

type SetCartState = Dispatch<SetStateAction<Cart | null>>;

/**
 * Parse guest cart line id (`${productId}-${variantId}-${index}`).
 * Uses the last segment as index and splits product/variant on the previous dash.
 */
function parseGuestCartLineId(itemId: string): { productId: string; variantId: string } | null {
  const lastDash = itemId.lastIndexOf('-');
  if (lastDash <= 0) {
    return null;
  }

  const indexPart = itemId.slice(lastDash + 1);
  if (!/^\d+$/.test(indexPart)) {
    return null;
  }

  const withoutIndex = itemId.slice(0, lastDash);
  const variantDash = withoutIndex.lastIndexOf('-');
  if (variantDash <= 0) {
    return null;
  }

  return {
    productId: withoutIndex.slice(0, variantDash),
    variantId: withoutIndex.slice(variantDash + 1),
  };
}

function resolveGuestLineIndex(guestCart: GuestCartItem[], itemId: string): number {
  const parsed = parseGuestCartLineId(itemId);
  if (parsed) {
    const matchedIndex = guestCart.findIndex(
      (item) => item.productId === parsed.productId && item.variantId === parsed.variantId,
    );
    if (matchedIndex >= 0) {
      return matchedIndex;
    }
  }

  return guestCart.findIndex(
    (item, index) => `${item.productId}-${item.variantId}-${index}` === itemId,
  );
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
    dispatchCartUpdated({ localOnly: true });
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
 * Handle remove item from cart
 */
export async function handleRemoveItem(
  itemId: string,
  isLoggedIn: boolean,
  setCart: SetCartState,
  fetchCart: () => Promise<void>,
  productLabel: string,
): Promise<void> {
  if (!isLoggedIn) {
    if (!removeFromGuestCart(itemId)) {
      return;
    }

    syncGuestCartState(setCart, productLabel);
    dispatchCartUpdated({ localOnly: true });
    return;
  }

  let itemFound = false;
  let nextCart: Cart | null = null;

  setCart((prevCart) => {
    if (!prevCart) {
      return prevCart;
    }

    const itemToRemove = prevCart.items.find((item) => item.id === itemId);
    if (!itemToRemove) {
      return prevCart;
    }

    itemFound = true;
    const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
    const newItemsCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    nextCart = {
      ...prevCart,
      items: updatedItems,
      totals: calculateCartTotals(updatedItems, prevCart.totals),
      itemsCount: newItemsCount,
    };

    return nextCart;
  });

  if (!itemFound) {
    return;
  }

  writeCartSnapshot(nextCart);

  try {
    await apiClient.delete(`/api/v1/cart/items/${itemId}`);
    dispatchCartUpdated({ localOnly: true });
  } catch (error: unknown) {
    logger.error('Error removing item', { error, itemId });
    await fetchCart();
  }
}

/**
 * Handle update item quantity in cart (optimistic UI, API sync in background).
 */
export function handleUpdateQuantity(
  itemId: string,
  quantity: number,
  isLoggedIn: boolean,
  setCart: SetCartState,
  fetchCart: (silent?: boolean) => Promise<void>,
  t: (key: string) => string,
  productLabel: string,
): void {
  if (quantity < 1) {
    void handleRemoveItem(itemId, isLoggedIn, setCart, () => fetchCart(true), productLabel);
    return;
  }

  const cartItem = readCartItemForUpdate(itemId, isLoggedIn, setCart, productLabel);
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

    syncGuestCartState(setCart, productLabel);
    dispatchCartUpdated({ localOnly: true });
    return;
  }

  setCart((prevCart) => {
    if (!prevCart) {
      return prevCart;
    }

    const updatedItems = prevCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity, total: item.price * quantity } : item,
    );
    const newItemsCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    const updatedCart = {
      ...prevCart,
      items: updatedItems,
      totals: calculateCartTotals(updatedItems, prevCart.totals),
      itemsCount: newItemsCount,
    };

    writeCartSnapshot(updatedCart);
    return updatedCart;
  });

  dispatchCartUpdated({ localOnly: true });
  void syncLoggedInQuantity(itemId, quantity, fetchCart, t);
}

function readCartItemForUpdate(
  itemId: string,
  isLoggedIn: boolean,
  setCart: SetCartState,
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

  let cartItem: CartItem | undefined;
  setCart((prevCart) => {
    cartItem = prevCart?.items.find((item) => item.id === itemId);
    return prevCart ?? null;
  });
  return cartItem;
}
