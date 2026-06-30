import { CART_DRAWER_CLOSE_EVENT, CART_DRAWER_OPEN_EVENT } from '../constants/cart-drawer';

/** Opens the global cart drawer panel. */
export function openCartDrawer(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT));
}

/** Closes the global cart drawer panel. */
export function closeCartDrawer(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(CART_DRAWER_CLOSE_EVENT));
}
