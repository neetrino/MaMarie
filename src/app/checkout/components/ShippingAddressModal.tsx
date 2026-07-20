'use client';

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
import { CheckoutDeliveryCitySelect } from './CheckoutDeliveryCitySelect';
import { CheckoutInput } from './CheckoutInput';
import { CheckoutPrimaryButton } from './CheckoutPrimaryButton';
import { ContactInformation } from './ContactInformation';
import { OrderSummaryModal } from './OrderSummaryModal';

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  handleSubmit: UseFormHandleSubmit<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  cart: Cart | null;
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingCity?: string;
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
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
 * Confirm-order sheet — same side-sheet chrome as profile / size guide.
 */
export function ShippingAddressModal({
  isOpen,
  onClose,
  register,
  setValue,
  handleSubmit,
  errors,
  isSubmitting,
  shippingMethod,
  paymentMethod,
  cart,
  orderSummary,
  currency,
  shippingCity,
  loadingDeliveryPrice,
  deliveryPrice,
  onSubmit,
}: ShippingAddressModalProps) {
  const { t } = useTranslation();

  const title =
    shippingMethod === 'delivery'
      ? t('checkout.modals.completeOrder')
      : t('checkout.modals.confirmOrder');

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
                onSubmit(data);
              }, scrollToFirstFieldError)}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('checkout.buttons.processing') : t('checkout.buttons.placeOrder')}
            </CheckoutPrimaryButton>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
          <ContactInformation
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          {shippingMethod === 'delivery' ? (
            <>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  {t('checkout.shippingAddress')}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CheckoutDeliveryCitySelect
                    shippingCity={shippingCity}
                    setValue={setValue}
                    error={errors.shippingCity?.message}
                    disabled={isSubmitting}
                  />
                  <CheckoutInput
                    label={t('checkout.form.address')}
                    type="text"
                    placeholder={t('checkout.placeholders.address')}
                    {...register('shippingAddress')}
                    error={errors.shippingAddress?.message}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {(errors.shippingAddress || errors.shippingCity) && (
                <div className={`border border-red-200 bg-red-50 p-3 ${CHECKOUT_FORM_ALERT_CLASS}`}>
                  <p className="text-sm text-red-600">
                    {errors.shippingAddress?.message || errors.shippingCity?.message}
                  </p>
                </div>
              )}

              {(paymentMethod === 'arca' || paymentMethod === 'idram') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('checkout.payment.paymentDetails')} (
                    {paymentMethod === 'idram'
                      ? t('checkout.payment.idram')
                      : t('checkout.payment.arca')}
                    )
                  </h3>
                  <CardInputFields
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}

              {paymentMethod === 'cash_on_delivery' && (
                <div className={`border border-green-200 bg-green-50 p-4 ${CHECKOUT_FORM_ALERT_CLASS}`}>
                  <p className="text-sm text-green-800">
                    <strong>{t('checkout.payment.cashOnDelivery')}:</strong>{' '}
                    {t('checkout.messages.cashOnDeliveryInfo')}
                  </p>
                </div>
              )}

              <OrderSummaryModal
                cart={cart}
                orderSummary={orderSummary}
                currency={currency}
                shippingMethod={shippingMethod}
                shippingCity={shippingCity}
                loadingDeliveryPrice={loadingDeliveryPrice}
                deliveryPrice={deliveryPrice}
              />
            </>
          ) : (
            <>
              <div className={`border border-blue-200 bg-blue-50 p-4 ${CHECKOUT_FORM_ALERT_CLASS}`}>
                <p className="text-sm text-blue-800">
                  <strong>{t('checkout.shipping.storePickup')}:</strong>{' '}
                  {t('checkout.messages.storePickupInfo')}
                </p>
              </div>

              {(paymentMethod === 'arca' || paymentMethod === 'idram') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('checkout.payment.paymentDetails')} (
                    {paymentMethod === 'idram'
                      ? t('checkout.payment.idram')
                      : t('checkout.payment.arca')}
                    )
                  </h3>
                  <CardInputFields
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}

              {paymentMethod === 'cash_on_delivery' && (
                <div className={`border border-green-200 bg-green-50 p-4 ${CHECKOUT_FORM_ALERT_CLASS}`}>
                  <p className="text-sm text-green-800">
                    <strong>{t('checkout.payment.cashOnDelivery')}:</strong>{' '}
                    {t('checkout.messages.cashOnDeliveryPickup')}
                  </p>
                </div>
              )}

              <OrderSummaryModal
                cart={cart}
                orderSummary={orderSummary}
                currency={currency}
                shippingMethod={shippingMethod}
                shippingCity={shippingCity}
                loadingDeliveryPrice={loadingDeliveryPrice}
                deliveryPrice={deliveryPrice}
              />
            </>
          )}
      </div>
    </ProfileSideSheet>
  );
}
