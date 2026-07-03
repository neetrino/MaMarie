import type { OrderDetails, OrderListItem } from './types';

/** List/dashboard row — enough to open the side sheet before the details API responds. */
export type OrderDetailsClickPreview = Pick<
  OrderListItem,
  'id' | 'number' | 'status' | 'paymentStatus' | 'fulfillmentStatus' | 'total' | 'currency' | 'createdAt'
>;

/** Minimal order payload so the side sheet can open instantly while details load. */
export function createOrderDetailsPreview(preview: OrderDetailsClickPreview): OrderDetails {
  return {
    id: preview.id,
    number: preview.number,
    status: preview.status,
    paymentStatus: preview.paymentStatus,
    fulfillmentStatus: preview.fulfillmentStatus,
    items: [],
    totals: {
      subtotal: preview.total,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: preview.total,
      currency: preview.currency,
    },
    shippingMethod: '',
    createdAt: preview.createdAt,
    updatedAt: preview.createdAt,
  };
}
