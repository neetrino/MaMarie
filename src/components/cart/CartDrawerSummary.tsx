'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  buildCartShippingAndTotalLabels,
  formatCartLineAmountInCurrency,
} from '../../app/cart/cart-summary-labels';
import type { Cart } from '../../app/cart/types';
import { useCartDeliveryEstimate } from '../../app/cart/use-cart-delivery-estimate';
import type { CurrencyCode } from '../../lib/currency';
import { closeCartDrawer } from '../../lib/cart-drawer';

interface CartDrawerSummaryProps {
  cart: Cart;
  currency: string;
  t: (key: string) => string;
}

export function CartDrawerSummary({ cart, currency, t }: CartDrawerSummaryProps) {
  const currencyCode = currency as CurrencyCode;
  const { deliveryPriceAMD, loadingDelivery } = useCartDeliveryEstimate();
  const { shippingLabel, totalLabel } = useMemo(
    () =>
      buildCartShippingAndTotalLabels({
        cart,
        currencyCode,
        deliveryPriceAMD,
        loadingDelivery,
      }),
    [cart, currencyCode, deliveryPriceAMD, loadingDelivery],
  );

  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between gap-3">
          <span>{t('common.cart.subtotal')}</span>
          <span className="font-medium text-gray-900">
            {formatCartLineAmountInCurrency(cart.totals.subtotal, currencyCode)}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>{t('common.cart.shipping')}</span>
          <span className="font-medium text-gray-900">{shippingLabel}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-3 text-base font-bold text-gray-900">
        <span>{t('common.cart.total')}</span>
        <span>{totalLabel}</span>
      </div>

      <Link
        href="/checkout"
        onClick={closeCartDrawer}
        className="mt-5 flex w-full items-center justify-center rounded-2xl bg-sky-50 px-4 py-4 text-sm font-bold uppercase tracking-wide text-gray-900 shadow-sm transition-colors hover:bg-sky-100"
      >
        {t('common.buttons.proceedToCheckout')}
      </Link>
    </footer>
  );
}
