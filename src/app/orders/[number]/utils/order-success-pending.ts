import type { Order } from '../types';

export const ORDER_SUCCESS_PENDING_STORAGE_KEY = 'mamarie:order-success-pending';

export interface OrderSuccessPendingSnapshot {
  number: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
}

/** Minimal order stub so the success hero can render before the detail fetch. */
export function createPendingOrderStub(snapshot: OrderSuccessPendingSnapshot): Order {
  return {
    id: `pending-${snapshot.number}`,
    number: snapshot.number,
    status: snapshot.status,
    paymentStatus: snapshot.paymentStatus,
    fulfillmentStatus: snapshot.fulfillmentStatus,
    items: [],
    totals: {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      currency: 'AMD',
    },
    shippingMethod: 'pickup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function saveOrderSuccessPending(snapshot: OrderSuccessPendingSnapshot): void {
  try {
    sessionStorage.setItem(ORDER_SUCCESS_PENDING_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota / private mode — page still works via API fetch.
  }
}

export function readOrderSuccessPending(orderNumber: string): OrderSuccessPendingSnapshot | null {
  try {
    const raw = sessionStorage.getItem(ORDER_SUCCESS_PENDING_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as OrderSuccessPendingSnapshot;
    if (parsed.number !== orderNumber) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearOrderSuccessPending(): void {
  try {
    sessionStorage.removeItem(ORDER_SUCCESS_PENDING_STORAGE_KEY);
  } catch {
    // no-op
  }
}

/** Warm the order-success illustration so it paints with the hero text. */
export function preloadOrderSuccessIllustration(src: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector(`link[data-preload-order-hero="${src}"]`);
  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute('data-preload-order-hero', src);
  document.head.appendChild(link);

  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}
