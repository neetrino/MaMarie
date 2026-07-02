'use client';

import Image from 'next/image';
import type { FooterPaymentBadge } from '../../../constants/footer';
import { FOOTER_PAYMENT_BADGE_HEIGHT_PX } from '../../../constants/footer';

interface CheckoutPaymentBadgeProps {
  badge: FooterPaymentBadge;
  heightPx: number;
  radiusPx: number;
  /** Stretches badge width and logo horizontally without increasing height. */
  widthScale?: number;
}

function scaleBadgePx(valuePx: number, heightPx: number, widthScale = 1): number {
  return Math.round(valuePx * (heightPx / FOOTER_PAYMENT_BADGE_HEIGHT_PX) * widthScale);
}

/** Footer payment badge scaled for checkout card row (Visa / Mastercard / ArCa). */
export function CheckoutPaymentBadge({
  badge,
  heightPx,
  radiusPx,
  widthScale = 1,
}: CheckoutPaymentBadgeProps) {
  const heightScale = heightPx / FOOTER_PAYMENT_BADGE_HEIGHT_PX;
  const widthPx = scaleBadgePx(badge.widthPx, heightPx, widthScale);
  const logoLeftPx = scaleBadgePx(badge.logoLeftPx, heightPx, widthScale);
  const logoTopPx = badge.logoTopPx * heightScale;
  const logoWidthPx = scaleBadgePx(badge.logoWidthPx, heightPx, widthScale);
  const logoHeightPx = Math.round(badge.logoHeightPx * heightScale);

  return (
    <div
      className="relative shrink-0 overflow-hidden border border-gray-200 bg-white"
      style={{
        width: widthPx,
        height: heightPx,
        borderRadius: radiusPx,
      }}
    >
      <div
        className="absolute"
        style={{
          left: logoLeftPx,
          top: logoTopPx,
          width: logoWidthPx,
          height: logoHeightPx,
        }}
      >
        <Image
          src={badge.logoSrc}
          alt={badge.alt}
          fill
          sizes={`${logoWidthPx}px`}
          className="object-contain object-center"
        />
      </div>
    </div>
  );
}
