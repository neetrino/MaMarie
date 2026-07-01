import {
  MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_WIDTH_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../constants/mobile-products-catalog';

/** Scales a Figma `167:618` layout token to the rendered mobile catalog card width. */
export function mobileProductsCatalogCardLayoutPx(
  tokenPx: number,
  layoutWidthPx: number = MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
): number {
  return tokenPx * (layoutWidthPx / MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_WIDTH_PX);
}

export function resolveMobileProductsCatalogCardHeightPx(
  layoutWidthPx: number = MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
): number {
  return Math.round(
    layoutWidthPx
      * (MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_HEIGHT_PX / MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_WIDTH_PX),
  );
}

/** Resolves card height — allows explicit override for placeholders. */
export function resolveMobileProductsCatalogCardLayoutHeightPx(
  layoutWidthPx?: number,
  layoutHeightPx?: number,
): number {
  if (layoutHeightPx != null) {
    return layoutHeightPx;
  }

  if (layoutWidthPx != null) {
    return resolveMobileProductsCatalogCardHeightPx(layoutWidthPx);
  }

  return resolveMobileProductsCatalogCardHeightPx(MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX);
}
