import { AMERIABANK_MIN_CHARGE_AMD } from './constants';

type OrderChargeParts = {
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
};

/**
 * Order money is stored in AMD. Returns the whole-dram amount vPOS must charge.
 */
export function resolveLiveChargeAmountAmd(order: OrderChargeParts): number {
  const totalAmd =
    order.subtotal - order.discountAmount + order.shippingAmount + order.taxAmount;
  const amount = Math.round(totalAmd);
  if (amount < AMERIABANK_MIN_CHARGE_AMD) {
    throw {
      status: 422,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Payment Unavailable',
      detail: `Order total must be at least ${AMERIABANK_MIN_CHARGE_AMD} AMD`,
    };
  }
  return amount;
}
