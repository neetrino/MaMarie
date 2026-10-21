import { CART_DISPLAY_KEY, CART_SNAPSHOT_KEY } from '../app/cart/constants';
import type { Cart } from '../app/cart/types';

let memoryCart: Cart | null | undefined;
let displayEpoch = 0;

/** Bumps when the user changes the cart, so an older response cannot overwrite it. */
export function bumpCartDisplayEpoch(): number {
  displayEpoch += 1;
  return displayEpoch;
}

/** Epoch captured when a cart request starts. */
export function getCartDisplayEpoch(): number {
  return displayEpoch;
}

function isDisplayCart(value: unknown): value is Cart {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const cart = value as Cart;
  if (typeof cart.id !== 'string' || !Array.isArray(cart.items)) {
    return false;
  }

  return cart.items.every((item) => (
    typeof item?.id === 'string'
    && typeof item.variant?.product?.id === 'string'
    && typeof item.quantity === 'number'
  ));
}

/** Last cart the drawer can paint before the network returns. */
export function readLoggedInCartDisplay(): Cart | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (memoryCart !== undefined) {
    return memoryCart;
  }

  localStorage.removeItem(CART_SNAPSHOT_KEY);

  try {
    const stored = sessionStorage.getItem(CART_DISPLAY_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    memoryCart = isDisplayCart(parsed) && parsed.items.length > 0 ? parsed : null;
  } catch {
    memoryCart = null;
  }

  return memoryCart;
}

/** Saves a cart for the next open. Does not cancel an in-flight request. */
export function writeLoggedInCartDisplay(cart: Cart | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  memoryCart = cart && cart.items.length > 0 ? cart : null;
  if (!memoryCart) {
    sessionStorage.removeItem(CART_DISPLAY_KEY);
    return;
  }

  sessionStorage.setItem(CART_DISPLAY_KEY, JSON.stringify(memoryCart));
}

/** User changed the cart. Older responses must not paint over this. */
export function replaceLoggedInCartDisplay(cart: Cart | null): void {
  bumpCartDisplayEpoch();
  writeLoggedInCartDisplay(cart);
}
