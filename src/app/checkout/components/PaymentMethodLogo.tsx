'use client';

import Image from 'next/image';
import {
  CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_SRC,
  CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX,
} from '../constants/checkout-payment-ui';

interface PaymentMethodLogoProps {
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  logoErrors: Record<string, boolean>;
  onError: () => void;
  size?: 'small' | 'medium' | 'large';
}

const arcaSizeClasses = {
  small: 'w-12 h-8',
  medium: 'w-16 h-10',
  large: 'w-20 h-12',
};

export function PaymentMethodLogo({
  paymentMethod,
  logoErrors,
  onError,
  size = 'medium',
}: PaymentMethodLogoProps) {
  const altText = paymentMethod === 'arca' ? 'ArCa' : 'Idram';

  if (logoErrors[paymentMethod]) {
    return (
      <div
        className={`${paymentMethod === 'idram' ? 'w-28' : arcaSizeClasses[size]} flex h-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white`}
      >
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  }

  if (paymentMethod === 'idram') {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white px-2"
        style={{ width: CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX, height: 40 }}
      >
        <Image
          src={CHECKOUT_PAYMENT_IDRAM_LOGO_SRC}
          alt={altText}
          width={CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX}
          height={CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX}
          className="w-auto object-contain object-center"
          style={{ height: CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX }}
          unoptimized
          onError={onError}
        />
      </div>
    );
  }

  return (
    <div className={`${arcaSizeClasses[size]} flex flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white`}>
      <img
        src="/assets/payments/arca.svg"
        alt={altText}
        className="h-full w-full object-contain p-1"
        loading="lazy"
        onError={onError}
      />
    </div>
  );
}
