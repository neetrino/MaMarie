'use client';

import { useTranslation } from '../../../lib/i18n-client';
import { CHECKOUT_FORM_ALERT_CLASS } from '../constants/checkout-ui';
import { resolveCheckoutDeliveryCityDisplayLabel } from '../constants/checkout-delivery-cities';
import { formatPriceInCurrency } from '../../../lib/currency';
import { Cart } from '../types';

interface OrderSummaryModalProps {
  cart: Cart | null;
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingMethod: 'pickup' | 'delivery';
  shippingCity?: string;
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
}

export function OrderSummaryModal({
  cart,
  orderSummary,
  currency,
  shippingMethod,
  shippingCity,
  loadingDeliveryPrice,
  deliveryPrice,
}: OrderSummaryModalProps) {
  const { t } = useTranslation();
  const shippingCityLabel = resolveCheckoutDeliveryCityDisplayLabel(t, shippingCity);

  if (!cart) {
    return null;
  }

  const shippingDisplay =
    shippingMethod === 'pickup'
      ? t('checkout.shipping.freePickup')
      : loadingDeliveryPrice
        ? t('checkout.shipping.loading')
        : deliveryPrice !== null
          ? formatPriceInCurrency(orderSummary.shippingDisplay, currency) +
            (shippingCityLabel ? ` (${shippingCityLabel})` : ` (${t('checkout.shipping.delivery')})`)
          : t('checkout.shipping.selectCity');

  return (
    <div className={`space-y-2 bg-brand-pink/5 p-4 ring-1 ring-brand-pink/20 ${CHECKOUT_FORM_ALERT_CLASS}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{t('checkout.summary.items')}:</span>
        <span className="font-medium text-gray-900">{cart.itemsCount}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{t('checkout.summary.subtotal')}:</span>
        <span className="font-medium text-gray-900">
          {formatPriceInCurrency(orderSummary.subtotalDisplay, currency)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{t('checkout.summary.shipping')}:</span>
        <span className="font-medium text-gray-900">{shippingDisplay}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{t('checkout.summary.tax')}:</span>
        <span className="font-medium text-gray-900">
          {formatPriceInCurrency(orderSummary.taxDisplay, currency)}
        </span>
      </div>
      <div className="mt-2 border-t border-dashed border-brand-pink/30 pt-2">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">{t('checkout.summary.total')}:</span>
          <span className="font-bold text-gray-900">
            {formatPriceInCurrency(orderSummary.totalDisplay, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
