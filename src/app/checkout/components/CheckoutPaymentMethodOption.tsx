'use client';

import type { UseFormRegister } from 'react-hook-form';
import {
  CHECKOUT_OPTION_BASE_CLASS,
  CHECKOUT_OPTION_DEFAULT_CLASS,
} from '../constants/checkout-ui';
import { CHECKOUT_PAYMENT_OPTION_SELECTED_CLASS } from '../constants/checkout-payment-ui';
import type { PaymentMethod } from '../utils/payment-methods';
import type { CheckoutFormData } from '../types';
import { CheckoutPaymentMethodIcons } from './CheckoutPaymentMethodIcons';
import { CheckoutRadio } from './CheckoutRadio';

interface CheckoutPaymentMethodOptionProps {
  method: PaymentMethod;
  isSelected: boolean;
  isSubmitting: boolean;
  logoErrors: Record<string, boolean>;
  onLogoError: (methodId: string) => void;
  register: UseFormRegister<CheckoutFormData>;
  onSelect: (methodId: PaymentMethod['id']) => void;
}

function paymentOptionClass(isSelected: boolean): string {
  return `${CHECKOUT_OPTION_BASE_CLASS} ${
    isSelected ? CHECKOUT_PAYMENT_OPTION_SELECTED_CLASS : CHECKOUT_OPTION_DEFAULT_CLASS
  }`;
}

export function CheckoutPaymentMethodOption({
  method,
  isSelected,
  isSubmitting,
  logoErrors,
  onLogoError,
  register,
  onSelect,
}: CheckoutPaymentMethodOptionProps) {
  const isCardMethod = method.id === 'arca';
  const idramLogoError = logoErrors[method.id] ?? false;
  const onIdramLogoError = () => onLogoError(method.id);

  const icons = (
    <CheckoutPaymentMethodIcons
      methodId={method.id}
      idramLogoError={idramLogoError}
      onIdramLogoError={onIdramLogoError}
      mobileCardFramed={isCardMethod}
    />
  );

  if (isCardMethod) {
    return (
      <label className={paymentOptionClass(isSelected)}>
        <CheckoutRadio
          {...register('paymentMethod')}
          value={method.id}
          checked={isSelected}
          onChange={(e) => onSelect(e.target.value as PaymentMethod['id'])}
          disabled={isSubmitting}
          className="self-center lg:hidden"
        />

        <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-1.5 lg:hidden">
          <span className="font-medium text-gray-900">{method.shortName}</span>
          {icons}
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <CheckoutRadio
            {...register('paymentMethod')}
            value={method.id}
            checked={isSelected}
            onChange={(e) => onSelect(e.target.value as PaymentMethod['id'])}
            disabled={isSubmitting}
          />
          {icons}
          <div className="min-w-0">
            <div className="font-medium text-gray-900">{method.name}</div>
            <div className="text-sm text-gray-600">{method.description}</div>
          </div>
        </div>
      </label>
    );
  }

  return (
    <label className={paymentOptionClass(isSelected)}>
      <CheckoutRadio
        {...register('paymentMethod')}
        value={method.id}
        checked={isSelected}
        onChange={(e) => onSelect(e.target.value as PaymentMethod['id'])}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
        {icons}
        <div className="min-w-0">
          <span className="font-medium text-gray-900 lg:hidden">{method.shortName}</span>
          <div className="hidden lg:block">
            <div className="font-medium text-gray-900">{method.name}</div>
            <div className="text-sm text-gray-600">{method.description}</div>
          </div>
        </div>
      </div>
    </label>
  );
}
