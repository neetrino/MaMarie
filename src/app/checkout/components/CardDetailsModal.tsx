'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { ProfileSideSheet } from '../../profile/components/ProfileSideSheet';
import { useTranslation } from '../../../lib/i18n-client';
import {
  CHECKOUT_CONFIRM_SHEET_BACKDROP_TRANSITION_MS,
  CHECKOUT_CONFIRM_SHEET_DESKTOP_WIDTH_PERCENT,
  CHECKOUT_CONFIRM_SHEET_FOOTER_CLASS,
  CHECKOUT_CONFIRM_SHEET_PANEL_TRANSITION_MS,
  CHECKOUT_FORM_ALERT_CLASS,
  CHECKOUT_SECONDARY_BUTTON_CLASS,
} from '../constants/checkout-ui';
import type { Cart, CheckoutFormData } from '../types';
import { CardInputFields } from './CardInputFields';
import { CheckoutPrimaryButton } from './CheckoutPrimaryButton';
import { OrderSummaryModal } from './OrderSummaryModal';
import { PaymentMethodLogo } from './PaymentMethodLogo';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  handleSubmit: UseFormHandleSubmit<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  shippingMethod: 'pickup' | 'delivery';
  shippingCity?: string;
  cart: Cart | null;
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  logoErrors: Record<string, boolean>;
  setLogoErrors: Dispatch<SetStateAction<Record<string, boolean>>>;
  isLoggedIn: boolean;
  onShowShippingModal: () => void;
  onSubmit: (data: CheckoutFormData) => void;
}

function scrollToFirstFieldError(validationErrors: FieldErrors<CheckoutFormData>) {
  const firstErrorField = Object.keys(validationErrors)[0];
  if (!firstErrorField) {
    return;
  }
  const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
  errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Card details sheet — same side-sheet chrome as profile / confirm-order.
 */
export function CardDetailsModal({
  isOpen,
  onClose,
  register,
  setValue,
  handleSubmit,
  errors,
  isSubmitting,
  paymentMethod,
  shippingMethod,
  shippingCity,
  cart,
  orderSummary,
  currency,
  loadingDeliveryPrice,
  deliveryPrice,
  logoErrors,
  setLogoErrors,
  isLoggedIn,
  onShowShippingModal,
  onSubmit,
}: CardDetailsModalProps) {
  const { t } = useTranslation();

  const title = t('checkout.modals.cardDetails').replace(
    '{method}',
    paymentMethod === 'arca' ? t('checkout.payment.arca') : t('checkout.payment.idram'),
  );

  return (
    <ProfileSideSheet
      isOpen={isOpen}
      title={title}
      closeLabel={t('common.buttons.close')}
      onClose={onClose}
      desktopWidthPercent={CHECKOUT_CONFIRM_SHEET_DESKTOP_WIDTH_PERCENT}
      panelTransitionMs={CHECKOUT_CONFIRM_SHEET_PANEL_TRANSITION_MS}
      backdropTransitionMs={CHECKOUT_CONFIRM_SHEET_BACKDROP_TRANSITION_MS}
      footer={
        <div className={CHECKOUT_CONFIRM_SHEET_FOOTER_CLASS}>
          <div className="flex gap-3">
            <button
              type="button"
              className={`${CHECKOUT_SECONDARY_BUTTON_CLASS} flex-1`}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('checkout.buttons.cancel')}
            </button>
            <CheckoutPrimaryButton
              type="button"
              className="flex-1"
              onClick={handleSubmit((data) => {
                onClose();
                if (!isLoggedIn) {
                  onShowShippingModal();
                } else {
                  onSubmit(data);
                }
              }, scrollToFirstFieldError)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('checkout.buttons.processing')
                : t('checkout.buttons.continueToPayment')}
            </CheckoutPrimaryButton>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-3">
              <PaymentMethodLogo
                paymentMethod={paymentMethod}
                logoErrors={logoErrors}
                onError={() => {
                  setLogoErrors((prev) => ({ ...prev, [paymentMethod]: true }));
                }}
                size="medium"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {paymentMethod === 'arca'
                    ? t('checkout.payment.arca')
                    : t('checkout.payment.idram')}{' '}
                  {t('checkout.payment.paymentDetails')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('checkout.payment.enterCardDetails')}
                </div>
              </div>
            </div>

            <CardInputFields
              register={register}
              setValue={setValue}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>

          {(errors.cardNumber ||
            errors.cardExpiry ||
            errors.cardCvv ||
            errors.cardHolderName) && (
            <div className={`border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
              <p className="text-sm text-red-600">
                {errors.cardNumber?.message ||
                  errors.cardExpiry?.message ||
                  errors.cardCvv?.message ||
                  errors.cardHolderName?.message}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{t('checkout.orderSummary')}</h3>
            <OrderSummaryModal
              cart={cart}
              orderSummary={orderSummary}
              currency={currency}
              shippingMethod={shippingMethod}
              shippingCity={shippingCity}
              loadingDeliveryPrice={loadingDeliveryPrice}
              deliveryPrice={deliveryPrice}
            />
          </div>
      </div>
    </ProfileSideSheet>
  );
}
