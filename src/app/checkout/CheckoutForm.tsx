'use client';

import { CheckoutInput } from './components/CheckoutInput';
import { CheckoutPaymentMethodOption } from './components/CheckoutPaymentMethodOption';
import { CheckoutRadio } from './components/CheckoutRadio';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslation } from '../../lib/i18n-client';
import { checkoutPageShellStyles } from './components/CheckoutPageShell';
import {
  CHECKOUT_FORM_ALERT_CLASS,
  CHECKOUT_OPTION_BASE_CLASS,
  CHECKOUT_OPTION_DEFAULT_CLASS,
  CHECKOUT_OPTION_SELECTED_CLASS,
  CHECKOUT_SECTION_CARD_CLASS,
  CHECKOUT_SECTION_TITLE_CLASS,
} from './constants/checkout-ui';
import { CheckoutFormData } from './types';
import type { PaymentMethod } from './utils/payment-methods';

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  paymentMethods: PaymentMethod[];
  logoErrors: Record<string, boolean>;
  setLogoErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

function optionClass(isSelected: boolean): string {
  return `${CHECKOUT_OPTION_BASE_CLASS} ${
    isSelected ? CHECKOUT_OPTION_SELECTED_CLASS : CHECKOUT_OPTION_DEFAULT_CLASS
  }`;
}

export function CheckoutForm({
  register,
  setValue,
  errors,
  isSubmitting,
  shippingMethod,
  paymentMethod,
  paymentMethods,
  logoErrors,
  setLogoErrors,
  error,
  setError,
}: CheckoutFormProps) {
  const { t } = useTranslation();

  return (
    <div className={`lg:col-span-2 flex flex-col ${checkoutPageShellStyles.formSections}`}>
      <section className={CHECKOUT_SECTION_CARD_CLASS}>
        <h2 className={`${CHECKOUT_SECTION_TITLE_CLASS} mb-6`}>{t('checkout.contactInformation')}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CheckoutInput
              label={t('checkout.form.firstName')}
              type="text"
              {...register('firstName')}
              error={errors.firstName?.message}
              disabled={isSubmitting}
            />
            <CheckoutInput
              label={t('checkout.form.lastName')}
              type="text"
              {...register('lastName')}
              error={errors.lastName?.message}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CheckoutInput
              label={t('checkout.form.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              disabled={isSubmitting}
            />
            <CheckoutInput
              label={t('checkout.form.phone')}
              type="tel"
              placeholder={t('checkout.placeholders.phone')}
              {...register('phone')}
              error={errors.phone?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section className={CHECKOUT_SECTION_CARD_CLASS}>
        <h2 className={`${CHECKOUT_SECTION_TITLE_CLASS} mb-6`}>{t('checkout.shippingMethod')}</h2>
        {errors.shippingMethod && (
          <div className={`mb-4 border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
            <p className="text-sm text-red-600">{errors.shippingMethod.message}</p>
          </div>
        )}
        <div className="space-y-3">
          <label className={optionClass(shippingMethod === 'pickup')}>
            <CheckoutRadio
              {...register('shippingMethod')}
              value="pickup"
              checked={shippingMethod === 'pickup'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t('checkout.shipping.storePickup')}</div>
              <div className="text-sm text-gray-600">{t('checkout.shipping.storePickupDescription')}</div>
            </div>
          </label>
          <label className={optionClass(shippingMethod === 'delivery')}>
            <CheckoutRadio
              {...register('shippingMethod')}
              value="delivery"
              checked={shippingMethod === 'delivery'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t('checkout.shipping.delivery')}</div>
              <div className="text-sm text-gray-600">{t('checkout.shipping.deliveryDescription')}</div>
            </div>
          </label>
        </div>
      </section>

      {shippingMethod === 'delivery' && (
        <section className={CHECKOUT_SECTION_CARD_CLASS} data-shipping-section>
          <h2 className={`${CHECKOUT_SECTION_TITLE_CLASS} mb-6`}>{t('checkout.shippingAddress')}</h2>
          {(error && error.includes('shipping address')) || errors.shippingAddress || errors.shippingCity ? (
            <div className={`mb-4 border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
              <p className="text-sm text-red-600">
                {error && error.includes('shipping address')
                  ? error
                  : errors.shippingAddress?.message || errors.shippingCity?.message}
              </p>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CheckoutInput
              label={t('checkout.form.city')}
              type="text"
              placeholder={t('checkout.placeholders.city')}
              {...register('shippingCity', {
                onChange: () => {
                  if (error && error.includes('shipping address')) {
                    setError(null);
                  }
                },
              })}
              error={errors.shippingCity?.message}
              disabled={isSubmitting}
            />
            <CheckoutInput
              label={t('checkout.form.address')}
              type="text"
              placeholder={t('checkout.placeholders.address')}
              {...register('shippingAddress', {
                onChange: () => {
                  if (error && error.includes('shipping address')) {
                    setError(null);
                  }
                },
              })}
              error={errors.shippingAddress?.message}
              disabled={isSubmitting}
            />
          </div>
        </section>
      )}

      <section className={CHECKOUT_SECTION_CARD_CLASS}>
        <h2 className={`${CHECKOUT_SECTION_TITLE_CLASS} mb-6`}>{t('checkout.paymentMethod')}</h2>
        {errors.paymentMethod && (
          <div className={`mb-4 border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
            <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
          </div>
        )}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <CheckoutPaymentMethodOption
              key={method.id}
              method={method}
              isSelected={paymentMethod === method.id}
              isSubmitting={isSubmitting}
              logoErrors={logoErrors}
              onLogoError={(methodId) => {
                setLogoErrors((prev) => ({ ...prev, [methodId]: true }));
              }}
              register={register}
              onSelect={(methodId) => setValue('paymentMethod', methodId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
