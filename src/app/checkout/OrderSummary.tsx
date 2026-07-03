'use client';

import { useTranslation } from '../../lib/i18n-client';
import { formatPriceInCurrency } from '../../lib/currency';
import { CheckoutPrimaryButton } from './components/CheckoutPrimaryButton';
import {
  CHECKOUT_FORM_ALERT_CLASS,
  CHECKOUT_ORDER_SUMMARY_WRAP_CLASS,
  CHECKOUT_SECTION_CARD_CLASS,
  CHECKOUT_SECTION_TITLE_CLASS,
} from './constants/checkout-ui';
import { resolveCheckoutDeliveryCityDisplayLabel } from './constants/checkout-delivery-cities';

interface OrderSummaryProps {
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingMethod: 'pickup' | 'delivery';
  shippingCity: string | undefined;
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  error: string | null;
  isSubmitting: boolean;
  onPlaceOrder: (e?: React.FormEvent) => void;
}

export function OrderSummary({
  orderSummary,
  currency,
  shippingMethod,
  shippingCity,
  loadingDeliveryPrice,
  deliveryPrice,
  error,
  isSubmitting,
  onPlaceOrder,
}: OrderSummaryProps) {
  const { t } = useTranslation();
  const shippingCityLabel = resolveCheckoutDeliveryCityDisplayLabel(t, shippingCity);

  const shippingLabel =
    shippingMethod === 'pickup'
      ? t('checkout.shipping.freePickup')
      : loadingDeliveryPrice
        ? t('checkout.shipping.loading')
        : deliveryPrice !== null
          ? formatPriceInCurrency(orderSummary.shippingDisplay, currency) +
            (shippingCityLabel ? ` (${shippingCityLabel})` : ` (${t('checkout.shipping.delivery')})`)
          : t('checkout.shipping.selectCity');

  return (
    <div className={`lg:sticky lg:top-24 lg:self-start ${CHECKOUT_ORDER_SUMMARY_WRAP_CLASS}`}>
      <section
        className={CHECKOUT_SECTION_CARD_CLASS}
        aria-labelledby="checkout-order-summary-heading"
      >
        <h2 id="checkout-order-summary-heading" className={CHECKOUT_SECTION_TITLE_CLASS}>
          {t('checkout.orderSummary')}
        </h2>

        <div className="mt-5 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between gap-3">
            <span>{t('checkout.summary.subtotal')}</span>
            <span className="font-medium text-gray-900">
              {formatPriceInCurrency(orderSummary.subtotalDisplay, currency)}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>{t('checkout.summary.shipping')}</span>
            <span className="text-right font-medium text-gray-900">{shippingLabel}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>{t('checkout.summary.tax')}</span>
            <span className="font-medium text-gray-900">
              {formatPriceInCurrency(orderSummary.taxDisplay, currency)}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-gray-300 pt-4">
          <div className="flex justify-between gap-3 text-base font-bold text-gray-900 sm:text-lg">
            <span>{t('checkout.summary.total')}</span>
            <span>{formatPriceInCurrency(orderSummary.totalDisplay, currency)}</span>
          </div>
        </div>

        {error && (
          <div className={`mt-4 border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <CheckoutPrimaryButton
          type="submit"
          className="mt-6"
          disabled={isSubmitting}
          onClick={onPlaceOrder}
        >
          {isSubmitting ? t('checkout.buttons.processing') : t('checkout.buttons.placeOrder')}
        </CheckoutPrimaryButton>
      </section>
    </div>
  );
}
