'use client';

import Image from 'next/image';
import {
  CHECKOUT_CARD_PAYMENT_BADGES,
  CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_ORDER,
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX,
  getCheckoutCardBadgeFramedBoxSize,
  CHECKOUT_PAYMENT_CASH_ICON_SIZE_MOBILE_PX,
  CHECKOUT_PAYMENT_CASH_ICON_SIZE_DESKTOP_PX,
  CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
  CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
  CHECKOUT_PAYMENT_IDRAM_BOX_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_MOBILE_PX,
  CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_IDRAM_LOGO_SRC,
  CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX,
} from '../constants/checkout-payment-ui';
import { CheckoutPaymentBadge } from './CheckoutPaymentBadge';

function getCheckoutCardBadges() {
  return CHECKOUT_PAYMENT_CARD_BADGE_ORDER.map((alt) =>
    CHECKOUT_CARD_PAYMENT_BADGES.find((badge) => badge.alt === alt),
  ).filter((badge): badge is (typeof CHECKOUT_CARD_PAYMENT_BADGES)[number] => badge !== undefined);
}

function CheckoutCashIcon({ sizePx }: { sizePx: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="shrink-0 text-brand-pink"
      style={{ width: sizePx, height: sizePx }}
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

interface CheckoutPaymentMethodIconsProps {
  methodId: 'idram' | 'arca' | 'cash_on_delivery';
  idramLogoError: boolean;
  onIdramLogoError: () => void;
  /** Mobile card row — framed badge boxes per Figma. */
  mobileCardFramed?: boolean;
}

export function CheckoutPaymentMethodIcons({
  methodId,
  idramLogoError,
  onIdramLogoError,
  mobileCardFramed = false,
}: CheckoutPaymentMethodIconsProps) {
  if (methodId === 'cash_on_delivery') {
    return (
      <>
        <div className="flex shrink-0 items-center justify-center lg:hidden">
          <CheckoutCashIcon sizePx={CHECKOUT_PAYMENT_CASH_ICON_SIZE_MOBILE_PX} />
        </div>
        <div className="hidden shrink-0 items-center justify-center lg:flex">
          <CheckoutCashIcon sizePx={CHECKOUT_PAYMENT_CASH_ICON_SIZE_DESKTOP_PX} />
        </div>
      </>
    );
  }

  if (methodId === 'idram') {
    return (
      <>
        <div
          className="relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white px-1.5 lg:hidden"
          style={{
            width: CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_MOBILE_PX,
            height: CHECKOUT_PAYMENT_IDRAM_BOX_HEIGHT_MOBILE_PX,
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
              style={{ height: CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_MOBILE_PX }}
              unoptimized
              onError={onIdramLogoError}
            />
          )}
        </div>

        <div
          className="relative hidden shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white px-2 lg:flex"
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
      </>
    );
  }

  const mobileFramedBoxSize = getCheckoutCardBadgeFramedBoxSize(
    CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX,
  );
  const desktopFramedBoxSize = getCheckoutCardBadgeFramedBoxSize(
    CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX,
  );

  return (
    <>
      <div
        className="flex max-w-full flex-wrap items-center justify-start self-start lg:hidden"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX }}
      >
        {getCheckoutCardBadges().map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            logoHeightPx={CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX}
            radiusPx={CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX}
            paddingPx={CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX}
            framed={mobileCardFramed}
            framedBoxSize={mobileCardFramed ? mobileFramedBoxSize : undefined}
          />
        ))}
      </div>

      <div
        className="hidden shrink-0 flex-nowrap items-center justify-start lg:flex"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX }}
      >
        {getCheckoutCardBadges().map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            logoHeightPx={CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX}
            radiusPx={CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX}
            paddingPx={CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX}
            framed
            framedBoxSize={desktopFramedBoxSize}
          />
        ))}
      </div>
    </>
  );
}
