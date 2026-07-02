'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  FOOTER_PAYMENT_BADGES,
} from '../../../constants/footer';
import {
  CHECKOUT_PAYMENT_CARD_BADGE_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_WIDTH_MOBILE_SCALE,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX,
  CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
  CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
  CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_SRC,
  CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX,
} from '../constants/checkout-payment-ui';
import { CheckoutPaymentBadge } from './CheckoutPaymentBadge';

function CheckoutCashIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-7 w-7 text-[#5281e1]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="3" y="9" width="26" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16" cy="16" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 13h26" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function CheckoutPaymentIconBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center border border-gray-200 bg-white"
      style={{
        minWidth: CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX + 8,
        height: CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
        borderRadius: CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
      }}
    >
      {children}
    </div>
  );
}

interface CheckoutPaymentMethodIconsProps {
  methodId: 'idram' | 'arca' | 'cash_on_delivery';
  idramLogoError: boolean;
  onIdramLogoError: () => void;
}

export function CheckoutPaymentMethodIcons({
  methodId,
  idramLogoError,
  onIdramLogoError,
}: CheckoutPaymentMethodIconsProps) {
  if (methodId === 'cash_on_delivery') {
    return (
      <CheckoutPaymentIconBox>
        <CheckoutCashIcon />
      </CheckoutPaymentIconBox>
    );
  }

  if (methodId === 'idram') {
    return (
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white px-2"
        style={{
          width: CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX,
          height: CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
          borderRadius: CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
        }}
      >
        {idramLogoError ? (
          <span className="text-xs font-semibold text-gray-500">Idram</span>
        ) : (
          <Image
            src={CHECKOUT_PAYMENT_IDRAM_LOGO_SRC}
            alt="Idram"
            width={CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX}
            height={CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX}
            className="w-auto object-contain object-center"
            style={{ height: CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX }}
            unoptimized
            onError={onIdramLogoError}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-nowrap items-center lg:hidden"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX }}
      >
        {FOOTER_PAYMENT_BADGES.map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            heightPx={CHECKOUT_PAYMENT_CARD_BADGE_HEIGHT_MOBILE_PX}
            radiusPx={CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX}
            widthScale={CHECKOUT_PAYMENT_CARD_BADGE_WIDTH_MOBILE_SCALE}
          />
        ))}
      </div>

      <div
        className="hidden flex-nowrap items-center lg:flex"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX }}
      >
        {FOOTER_PAYMENT_BADGES.map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            heightPx={CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX}
            radiusPx={CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX}
          />
        ))}
      </div>
    </>
  );
}
