/** Figma MAMARIE-DEV node `1:65` — «Best products» section heading. */
export const HOME_SECTION_MAX_WIDTH_PX = 1440;
export const BEST_PRODUCTS_SECTION_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;

/** Shared homepage content width — sale banner reference (`1:105`). */
export const HOME_SECTION_CONTENT_MAX_WIDTH_PX = 1354;
export const HOME_SECTION_PADDING_LEFT_PX = 43;
export const HOME_SECTION_PADDING_RIGHT_PX = 26;

export function homeSectionColumnWidthPx(
  columnCount: number,
  gapPx: number,
  contentWidthPx: number = HOME_SECTION_CONTENT_MAX_WIDTH_PX,
): number {
  return (contentWidthPx - (columnCount - 1) * gapPx) / columnCount;
}

export const HOME_SECTION_TITLE_FONT_SIZE_PX = 50;
export const HOME_SECTION_LINK_FONT_SIZE_PX = 16;
export const HOME_SECTION_LINK_LINE_HEIGHT_PX = 24;
export const HOME_SECTION_LINK_GAP_PX = 10;
export const HOME_SECTION_CHEVRON_SIZE_PX = 16;

/** Shared section heading row — aligns «See all» across homepage blocks. */
export const HOME_SECTION_HEADING_PADDING_Y_PX = 7;
export const HOME_SECTION_HEADING_MIN_HEIGHT_PX = 94;
export const HOME_SECTION_HEADING_TITLE_LINE_HEIGHT_PX = 80;

/** Space below hero before section heading. */
export const BEST_PRODUCTS_SECTION_OFFSET_TOP_PX = 24;

/** Product cards row — Figma `Frame 472`. */
export const BEST_PRODUCTS_GRID_OFFSET_TOP_PX = 75;
export const BEST_PRODUCTS_CARD_GAP_PX = 8;
export const BEST_PRODUCTS_CARD_COUNT = 4;

/** Figma node `1:73` — product card (scaled to fit content row). */
export const HOME_PRODUCT_CARD_DESIGN_WIDTH_PX = 344;
export const HOME_PRODUCT_CARD_DESIGN_HEIGHT_PX = 352;
export const HOME_PRODUCT_CARD_WIDTH_PX = homeSectionColumnWidthPx(
  BEST_PRODUCTS_CARD_COUNT,
  BEST_PRODUCTS_CARD_GAP_PX,
);
export const HOME_PRODUCT_CARD_HEIGHT_PX = Math.round(
  HOME_PRODUCT_CARD_WIDTH_PX * (HOME_PRODUCT_CARD_DESIGN_HEIGHT_PX / HOME_PRODUCT_CARD_DESIGN_WIDTH_PX),
);
export const HOME_PRODUCT_CARD_LAYOUT_SCALE =
  HOME_PRODUCT_CARD_WIDTH_PX / HOME_PRODUCT_CARD_DESIGN_WIDTH_PX;

function scaleProductCardPx(value: number): number {
  return value * HOME_PRODUCT_CARD_LAYOUT_SCALE;
}

export const HOME_PRODUCT_CARD_RADIUS_PX = scaleProductCardPx(30);
export const HOME_PRODUCT_CARD_BG = '#f9e490';

export const HOME_PRODUCT_CARD_IMAGE_LEFT_PX = scaleProductCardPx(8);
export const HOME_PRODUCT_CARD_IMAGE_TOP_PX = scaleProductCardPx(-46);
export const HOME_PRODUCT_CARD_IMAGE_WIDTH_PX = scaleProductCardPx(334);
export const HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX = scaleProductCardPx(268);

export const HOME_PRODUCT_CARD_PANEL_WIDTH_PX = scaleProductCardPx(330);
export const HOME_PRODUCT_CARD_PANEL_HEIGHT_PX = scaleProductCardPx(130);
export const HOME_PRODUCT_CARD_PANEL_TOP_PX = scaleProductCardPx(215);
export const HOME_PRODUCT_CARD_PANEL_RADIUS_PX = scaleProductCardPx(25);

export const HOME_PRODUCT_CARD_HEART_SIZE_PX = scaleProductCardPx(34);
export const HOME_PRODUCT_CARD_HEART_TOP_PX = scaleProductCardPx(17);
export const HOME_PRODUCT_CARD_HEART_RIGHT_PX = scaleProductCardPx(15);

export const HOME_PRODUCT_CARD_TITLE_SIZE_PX = 18;
export const HOME_PRODUCT_CARD_SUBTITLE_SIZE_PX = 16;
export const HOME_PRODUCT_CARD_PRICE_SIZE_PX = 22;
export const HOME_PRODUCT_CARD_COMPARE_SIZE_PX = 16;
export const HOME_PRODUCT_CARD_TEXT_DARK = '#1d1c16';
export const HOME_PRODUCT_CARD_TEXT_MUTED = 'rgba(29, 28, 22, 0.61)';
export const HOME_PRODUCT_CARD_PRICE_COLOR = '#a43c12';
export const HOME_PRODUCT_CARD_COMPARE_COLOR = '#9a9a9a';
export const HOME_PRODUCT_CARD_RATING_COLOR = '#757571';
export const HOME_PRODUCT_CARD_RATING_SIZE_PX = 13.745;

export const HOME_PRODUCT_CARD_CART_SIZE_PX = 56;
export const HOME_PRODUCT_CARD_CART_ICON_SIZE_PX = 32;
export const HOME_PRODUCT_CARD_CART_BG = '#96d0ff';

export const HOME_PRODUCT_CARD_ASSETS = {
  placeholderImage: '/assets/home/product-card/placeholder-jacket.png',
  star: '/assets/home/product-card/icon-star.svg',
  cart: '/assets/home/product-card/icon-cart.svg',
  heart: '/assets/home/product-card/icon-heart.svg',
} as const;

export const BEST_PRODUCTS_PLACEHOLDER_TITLE = 'Բաճկոն';
export const BEST_PRODUCTS_PLACEHOLDER_SUBTITLE = 'Բաճկոն';
export const BEST_PRODUCTS_PLACEHOLDER_PRICE_AMD = 14000;
export const BEST_PRODUCTS_PLACEHOLDER_COMPARE_PRICE_AMD = 22000;

export const BEST_PRODUCTS_SECTION_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const BEST_PRODUCTS_HEADING_PADDING_Y_PX = HOME_SECTION_HEADING_PADDING_Y_PX;
export const BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX = HOME_SECTION_HEADING_MIN_HEIGHT_PX;

export const BEST_PRODUCTS_TITLE_FONT_SIZE_PX = HOME_SECTION_TITLE_FONT_SIZE_PX;
export const BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX = HOME_SECTION_HEADING_TITLE_LINE_HEIGHT_PX;

export const BEST_PRODUCTS_LINK_FONT_SIZE_PX = HOME_SECTION_LINK_FONT_SIZE_PX;
export const BEST_PRODUCTS_LINK_LINE_HEIGHT_PX = HOME_SECTION_LINK_LINE_HEIGHT_PX;
export const BEST_PRODUCTS_LINK_GAP_PX = HOME_SECTION_LINK_GAP_PX;

export const BEST_PRODUCTS_CHEVRON_SIZE_PX = HOME_SECTION_CHEVRON_SIZE_PX;

export const BEST_PRODUCTS_HEADING_COLOR = '#c2ddf9';

export const BEST_PRODUCTS_ASSETS = {
  chevronRight: '/assets/home/icon-chevron-right.svg',
} as const;
