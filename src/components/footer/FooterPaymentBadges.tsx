import Image from 'next/image';
import {
  FOOTER_PAYMENT_BADGE_HEIGHT_PX,
  FOOTER_PAYMENT_BADGE_RADIUS_PX,
  FOOTER_PAYMENT_BADGES,
  FOOTER_PAYMENT_GAP_PX,
  type FooterPaymentBadge,
} from '../../constants/footer';

function FooterPaymentBadgeItem({ badge }: { badge: FooterPaymentBadge }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-white"
      style={{
        width: badge.widthPx,
        height: FOOTER_PAYMENT_BADGE_HEIGHT_PX,
        borderRadius: FOOTER_PAYMENT_BADGE_RADIUS_PX,
      }}
    >
      <div
        className="absolute"
        style={{
          left: badge.logoLeftPx,
          top: badge.logoTopPx,
          width: badge.logoWidthPx,
          height: badge.logoHeightPx,
        }}
      >
        <Image
          src={badge.logoSrc}
          alt={badge.alt}
          fill
          sizes={`${badge.logoWidthPx}px`}
          className="object-contain object-center"
        />
      </div>
    </div>
  );
}

/** Figma node `51:485` — Mastercard, ArCa, Visa badges under contacts. */
export function FooterPaymentBadges() {
  return (
    <div
      className="flex items-center"
      style={{ gap: FOOTER_PAYMENT_GAP_PX }}
      aria-label="Accepted payment methods"
    >
      {FOOTER_PAYMENT_BADGES.map((badge) => (
        <FooterPaymentBadgeItem key={badge.alt} badge={badge} />
      ))}
    </div>
  );
}
