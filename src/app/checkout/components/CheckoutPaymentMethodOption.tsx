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

  return (
    <label className={paymentOptionClass(isSelected)}>
      <CheckoutRadio
        {...register('paymentMethod')}
        tone="blue"
        value={method.id}
        checked={isSelected}
        onChange={(e) => onSelect(e.target.value as PaymentMethod['id'])}
        disabled={isSubmitting}
      />

      {isCardMethod ? (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:hidden">
            <span className="font-medium text-gray-900">{method.name}</span>
            <CheckoutPaymentMethodIcons
              methodId={method.id}
              idramLogoError={false}
              onIdramLogoError={() => {}}
            />
          </div>

          <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
            <CheckoutPaymentMethodIcons
              methodId={method.id}
              idramLogoError={false}
              onIdramLogoError={() => {}}
            />
            <div className="min-w-0">
              <div className="font-medium text-gray-900">{method.name}</div>
              <div className="text-sm text-gray-600">{method.description}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
          <CheckoutPaymentMethodIcons
            methodId={method.id}
            idramLogoError={logoErrors[method.id] ?? false}
            onIdramLogoError={() => onLogoError(method.id)}
          />
          <div className="min-w-0">
            <span className="font-medium text-gray-900 lg:hidden">{method.shortName}</span>
            <div className="hidden lg:block">
              <div className="font-medium text-gray-900">{method.name}</div>
              <div className="text-sm text-gray-600">{method.description}</div>
            </div>
          </div>
        </div>
      )}
    </label>
  );
}
