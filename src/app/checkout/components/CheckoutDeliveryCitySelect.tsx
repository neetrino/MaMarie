'use client';

import type { UseFormSetValue } from 'react-hook-form';
import { useMemo } from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import {
  CHECKOUT_DELIVERY_CITY_VALUES,
  getCheckoutDeliveryCityLabel,
} from '../constants/checkout-delivery-cities';
import type { CheckoutFormData } from '../types';
import { CheckoutSelect } from './CheckoutSelect';

interface CheckoutDeliveryCitySelectProps {
  shippingCity: string | undefined;
  setValue: UseFormSetValue<CheckoutFormData>;
  error?: string;
  disabled?: boolean;
  onChange?: () => void;
}

export function CheckoutDeliveryCitySelect({
  shippingCity,
  setValue,
  error,
  disabled,
  onChange,
}: CheckoutDeliveryCitySelectProps) {
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      CHECKOUT_DELIVERY_CITY_VALUES.map((city) => ({
        value: city,
        label: getCheckoutDeliveryCityLabel(t, city),
      })),
    [t],
  );

  const handleChange = (value: string) => {
    setValue('shippingCity', value, { shouldValidate: true, shouldDirty: true });
    onChange?.();
  };

  return (
    <CheckoutSelect
      label={t('checkout.form.city')}
      error={error}
      disabled={disabled}
      placeholder={t('checkout.shipping.selectCity')}
      options={options}
      value={shippingCity ?? ''}
      onChange={handleChange}
    />
  );
}
