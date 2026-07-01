import {
  MOBILE_WISHLIST_CARD_DESIGN_WIDTH_PX,
  MOBILE_WISHLIST_CARD_DESIGN_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_WIDTH_PX,
} from '../constants/mobile-wishlist';

/** Scales a Figma `74:798` layout token to the rendered mobile wishlist card width. */
export function mobileWishlistCardLayoutPx(
  tokenPx: number,
  layoutWidthPx: number = MOBILE_WISHLIST_CARD_WIDTH_PX,
): number {
  return tokenPx * (layoutWidthPx / MOBILE_WISHLIST_CARD_DESIGN_WIDTH_PX);
}

export function resolveMobileWishlistCardHeightPx(
  layoutWidthPx: number = MOBILE_WISHLIST_CARD_WIDTH_PX,
): number {
  return Math.round(
    layoutWidthPx * (MOBILE_WISHLIST_CARD_DESIGN_HEIGHT_PX / MOBILE_WISHLIST_CARD_DESIGN_WIDTH_PX),
  );
}

/** Resolves card height — allows explicit override for placeholders. */
export function resolveMobileWishlistCardLayoutHeightPx(
  layoutWidthPx?: number,
  layoutHeightPx?: number,
): number {
  if (layoutHeightPx != null) {
    return layoutHeightPx;
  }

  if (layoutWidthPx != null) {
    return resolveMobileWishlistCardHeightPx(layoutWidthPx);
  }

  return resolveMobileWishlistCardHeightPx(MOBILE_WISHLIST_CARD_WIDTH_PX);
}
