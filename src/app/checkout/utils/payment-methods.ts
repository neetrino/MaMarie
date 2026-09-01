import { useTranslation } from '../../../lib/i18n-client';

export type PaymentMethodId = 'idram' | 'arca' | 'cash_on_delivery';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  shortName: string;
  description: string;
  logo: string | null;
}

export function usePaymentMethods(shippingMethod: 'pickup' | 'delivery'): PaymentMethod[] {
  const { t } = useTranslation();
  const isPickup = shippingMethod === 'pickup';

  return [
    {
      id: 'cash_on_delivery',
      name: isPickup
        ? t('checkout.payment.cashOnPickup')
        : t('checkout.payment.cashOnDelivery'),
      shortName: t('checkout.payment.cashShort'),
      description: isPickup
        ? t('checkout.payment.cashOnPickupDescription')
        : t('checkout.payment.cashOnDeliveryDescription'),
      logo: null,
    },
    {
      id: 'idram',
      name: t('checkout.payment.idram'),
      shortName: t('checkout.payment.idram'),
      description: t('checkout.payment.idramDescription'),
      logo: '/assets/payments/idram.png',
    },
    {
      id: 'arca',
      name: t('checkout.payment.card'),
      shortName: t('checkout.payment.card'),
      description: t('checkout.payment.cardDescription'),
      logo: null,
    },
  ];
}
