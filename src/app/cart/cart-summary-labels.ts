import {
  convertPrice,
  formatPrice,
  formatPriceInCurrency,
  formatStorefrontPrice,
} from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import type { Cart } from './types';

/** Formats a cart line/subtotal amount stored in USD into the storefront currency. */
export function formatCartLineAmountInCurrency(
  amountUsd: number,
  currencyCode: CurrencyCode,
): string {
  return formatPrice(amountUsd, currencyCode);
}

/** Formats a cart amount stored in AMD into the storefront currency. */
export function formatCartAmountInCurrency(
  amountAmd: number,
  currencyCode: CurrencyCode,
): string {
  return formatStorefrontPrice(amountAmd, currencyCode);
}

interface CartSummaryLabelsInput {
  cart: Cart;
  currencyCode: CurrencyCode;
  deliveryPriceAMD: number | null;
  loadingDelivery: boolean;
}

/**
 * Shipping row: shows **0** in the storefront currency until the estimate request finishes,
 * then the API value (including real **0 AMD**). Totals use the same provisional shipping.
 */
export function buildCartShippingAndTotalLabels({
  cart,
  currencyCode,
  deliveryPriceAMD,
  loadingDelivery,
}: CartSummaryLabelsInput): { shippingLabel: string; totalLabel: string } {
  const shippingAmdResolved = !loadingDelivery && deliveryPriceAMD !== null;
  const shippingAmd = shippingAmdResolved ? deliveryPriceAMD : 0;
  const shippingLabel = formatCartAmountInCurrency(shippingAmd, currencyCode);

  const subtotalUsd = cart.totals.subtotal - cart.totals.discount;
  const subtotalInDisplay = convertPrice(subtotalUsd, 'USD', currencyCode);
  const shippingInDisplay =
    currencyCode === 'AMD' ? shippingAmd : convertPrice(shippingAmd, 'AMD', currencyCode);
  const totalLabel = formatPriceInCurrency(subtotalInDisplay + shippingInDisplay, currencyCode);

  return { shippingLabel, totalLabel };
}
