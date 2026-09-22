import { z } from 'zod';
import { useTranslation } from '../../../lib/i18n-client';

export function useCheckoutSchema() {
  const { t } = useTranslation();

  return z
    .object({
      firstName: z.string().min(1, t('checkout.errors.firstNameRequired')),
      lastName: z.string().min(1, t('checkout.errors.lastNameRequired')),
      email: z
        .string()
        .email(t('checkout.errors.invalidEmail'))
        .min(1, t('checkout.errors.emailRequired')),
      phone: z
        .string()
        .min(1, t('checkout.errors.phoneRequired'))
        .regex(/^\+?[0-9]{8,15}$/, t('checkout.errors.invalidPhone')),
      shippingMethod: z.enum(['pickup', 'delivery'], {
        message: t('checkout.errors.selectShippingMethod'),
      }),
      paymentMethod: z.enum(['idram', 'arca', 'cash_on_delivery'], {
        message: t('checkout.errors.selectPaymentMethod'),
      }),
      cashChangeFor: z
        .enum(['none', '2000', '5000', '10000', '20000', '50000', '100000'])
        .optional(),
      shippingAddress: z.string().optional(),
      shippingCity: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.shippingMethod === 'delivery') {
          return data.shippingAddress && data.shippingAddress.trim().length > 0;
        }
        return true;
      },
      {
        message: t('checkout.errors.addressRequired'),
        path: ['shippingAddress'],
      }
    )
    .refine(
      (data) => {
        if (data.shippingMethod === 'delivery') {
          return data.shippingCity && data.shippingCity.trim().length > 0;
        }
        return true;
      },
      {
        message: t('checkout.errors.cityRequired'),
        path: ['shippingCity'],
      }
    )
    .refine(
      (data) => {
        if (data.paymentMethod === 'cash_on_delivery') {
          return Boolean(data.cashChangeFor);
        }
        return true;
      },
      {
        message: t('checkout.errors.selectCashChange'),
        path: ['cashChangeFor'],
      }
    );
}
