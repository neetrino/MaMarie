'use client';

import { CheckoutInput } from './components/CheckoutInput';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslation } from '../../lib/i18n-client';
import { checkoutPageShellStyles } from './components/CheckoutPageShell';
import {
  CHECKOUT_FORM_ALERT_CLASS,
  CHECKOUT_FORM_OPTION_RADIUS_CLASS,
  CHECKOUT_OPTION_BASE_CLASS,
  CHECKOUT_OPTION_DEFAULT_CLASS,
  CHECKOUT_OPTION_SELECTED_CLASS,
  CHECKOUT_RADIO_INPUT_CLASS,
  CHECKOUT_SECTION_CARD_CLASS,
  CHECKOUT_SECTION_TITLE_CLASS,
} from './constants/checkout-ui';
import { CheckoutFormData } from './types';

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  paymentMethods: Array<{
    id: 'idram' | 'arca' | 'cash_on_delivery';
    name: string;
    description: string;
    logo: string | null;
  }>;
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
            <input
              type="radio"
              {...register('shippingMethod')}
              value="pickup"
              checked={shippingMethod === 'pickup'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              className={CHECKOUT_RADIO_INPUT_CLASS}
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t('checkout.shipping.storePickup')}</div>
              <div className="text-sm text-gray-600">{t('checkout.shipping.storePickupDescription')}</div>
            </div>
          </label>
          <label className={optionClass(shippingMethod === 'delivery')}>
            <input
              type="radio"
              {...register('shippingMethod')}
              value="delivery"
              checked={shippingMethod === 'delivery'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              className={CHECKOUT_RADIO_INPUT_CLASS}
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
            <label key={method.id} className={optionClass(paymentMethod === method.id)}>
              <input
                type="radio"
                {...register('paymentMethod')}
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) =>
                  setValue('paymentMethod', e.target.value as 'idram' | 'arca' | 'cash_on_delivery')
                }
                className={CHECKOUT_RADIO_INPUT_CLASS}
                disabled={isSubmitting}
              />
              <div className="flex flex-1 items-center gap-4">
                <div className={`relative flex h-12 w-20 flex-shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white ${CHECKOUT_FORM_OPTION_RADIUS_CLASS}`}>
                  {!method.logo || logoErrors[method.id] ? (
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ) : (
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="h-full w-full object-contain p-1.5"
                      loading="lazy"
                      onError={() => {
                        setLogoErrors((prev) => ({ ...prev, [method.id]: true }));
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
