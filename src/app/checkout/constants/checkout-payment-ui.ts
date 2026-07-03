/** Checkout payment — brand pink selected state (matches shipping). */
export const CHECKOUT_PAYMENT_ACCENT_COLOR = '#ef95aa';

export const CHECKOUT_PAYMENT_OPTION_SELECTED_CLASS = 'border-brand-pink bg-brand-pink/10';

export const CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX = 40;
export const CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX = 8;
export const CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX = 8;

/** Desktop card badges — same outer frame height as Idram box. */
export const CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX = CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX;
export const CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX = 8;
export const CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX =
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX - CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX * 2;

/** Mobile — Idram wordmark box (reference for card badge alignment). */
export const CHECKOUT_PAYMENT_IDRAM_BOX_HEIGHT_MOBILE_PX = 40;

/** Mobile card row — framed badge boxes (title above on mobile). */
export const CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX = 4;
export const CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX = 30;
export const CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX =
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX -
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX * 2;
export const CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX = 5;
export const CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX = 4;
export const CHECKOUT_PAYMENT_CARD_BADGE_ORDER = ['Visa', 'Mastercard', 'ArCa'] as const;
/** Visa — slight shrink inside the shared frame. */
export const CHECKOUT_PAYMENT_VISA_INNER_LOGO_SCALE = 0.9;
/** ArCa square source — zoom inside the shared Visa-width frame. */
export const CHECKOUT_PAYMENT_ARCA_INNER_LOGO_SCALE = 3.5;
/** Mastercard — slight zoom inside the shared frame. */
export const CHECKOUT_PAYMENT_MASTERCARD_INNER_LOGO_SCALE = 1.25;

export interface CheckoutCardPaymentBadge {
  alt: (typeof CHECKOUT_PAYMENT_CARD_BADGE_ORDER)[number];
  src: string;
  sourceWidthPx: number;
  sourceHeightPx: number;
  /** Framed box — scales logo inside the same outer frame (ArCa square art). */
  innerLogoScale?: number;
}

export interface CheckoutCardBadgeFramedBoxSize {
  widthPx: number;
  heightPx: number;
}

/** Uniform framed box — sized from Visa wordmark width at the given logo height. */
export function getCheckoutCardBadgeFramedBoxSize(
  logoHeightPx: number,
  paddingPx: number,
  boxHeightPx?: number,
): CheckoutCardBadgeFramedBoxSize {
  const visaBadge = CHECKOUT_CARD_PAYMENT_BADGES.find((badge) => badge.alt === 'Visa');
  const heightPx = boxHeightPx ?? logoHeightPx + paddingPx * 2;

  if (!visaBadge) {
    return {
      widthPx: logoHeightPx + paddingPx * 2,
      heightPx,
    };
  }

  const visaLogoWidthPx = Math.round(
    visaBadge.sourceWidthPx * (logoHeightPx / visaBadge.sourceHeightPx),
  );

  return {
    widthPx: visaLogoWidthPx + paddingPx * 2,
    heightPx,
  };
}

/** Tight-crop checkout card logos (not footer badge canvases). */
export const CHECKOUT_CARD_PAYMENT_BADGES: CheckoutCardPaymentBadge[] = [
  {
    alt: 'Visa',
    src: '/assets/payments/checkout/visa.png',
    sourceWidthPx: 877,
    sourceHeightPx: 284,
    innerLogoScale: CHECKOUT_PAYMENT_VISA_INNER_LOGO_SCALE,
  },
  {
    alt: 'Mastercard',
    src: '/assets/payments/checkout/mastercard.png',
    sourceWidthPx: 567,
    sourceHeightPx: 440,
    innerLogoScale: CHECKOUT_PAYMENT_MASTERCARD_INNER_LOGO_SCALE,
  },
  {
    alt: 'ArCa',
    src: '/assets/payments/checkout/arca.png',
    sourceWidthPx: 1024,
    sourceHeightPx: 1024,
    innerLogoScale: CHECKOUT_PAYMENT_ARCA_INNER_LOGO_SCALE,
  },
];

export const CHECKOUT_PAYMENT_IDRAM_LOGO_SRC = '/assets/payments/idram.png';
/** Source art — horizontal Idram wordmark (415×121). */
export const CHECKOUT_PAYMENT_IDRAM_LOGO_WIDTH_PX = 415;
export const CHECKOUT_PAYMENT_IDRAM_LOGO_HEIGHT_PX = 121;
export const CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_PX = 112;
export const CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_PX = 32;
/** Mobile — Idram wordmark box width. */
export const CHECKOUT_PAYMENT_IDRAM_BOX_WIDTH_MOBILE_PX = 96;
export const CHECKOUT_PAYMENT_IDRAM_LOGO_DISPLAY_HEIGHT_MOBILE_PX = 26;
/** Mobile cash — icon only, no frame. */
export const CHECKOUT_PAYMENT_CASH_ICON_SIZE_MOBILE_PX = 42;
/** Desktop cash — icon only, no frame. */
export const CHECKOUT_PAYMENT_CASH_ICON_SIZE_DESKTOP_PX = 36;
