import type { CartItem } from '../app/cart/types';

export const CART_UPDATED_EVENT = 'cart-updated';

export interface CartUpdatedDetail {
  /** Cart UI state is already synced — update badges only, skip network reload. */
  localOnly?: boolean;
  /** Server summary returned by cart mutations for instant header badge updates. */
  cartSummary?: { itemsCount: number; total: number };
  /** Cart line shown immediately while the full server cart refresh is in flight. */
  optimisticItem?: CartItem;
  /** Legacy optimistic signal — drawer waits for the API cart-updated instead. */
  optimisticAdd?: { quantity: number; price: number };
}

/** Notifies badge listeners; optionally skips cart drawer API reload. */
export function dispatchCartUpdated(detail?: CartUpdatedDetail): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent<CartUpdatedDetail | null>(CART_UPDATED_EVENT, { detail: detail ?? null }));
}
