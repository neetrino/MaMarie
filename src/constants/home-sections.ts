/** Figma MAMARIE-DEV node `51:344` — «Best products» section heading. */
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

/** Vertical gap between stacked homepage sections. */
export const HOME_SECTION_STACK_GAP_PX = 100;

/** Space below hero before section heading. */
export const BEST_PRODUCTS_SECTION_OFFSET_TOP_PX = HOME_SECTION_STACK_GAP_PX;

/** Product cards row — Figma `Frame 472`. */
export const BEST_PRODUCTS_GRID_OFFSET_TOP_PX = 75;
export const BEST_PRODUCTS_CARD_GAP_PX = 8;
export const BEST_PRODUCTS_CARD_COUNT = 4;

/** Figma node `1:73` — product card (scaled to fit content row). */
export const HOME_PRODUCT_CARD_DESIGN_WIDTH_PX = 344;
export const HOME_PRODUCT_CARD_DESIGN_HEIGHT_PX = 371;
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

export const HOME_PRODUCT_CARD_IMAGE_LEFT_PX = scaleProductCardPx(22);
export const HOME_PRODUCT_CARD_IMAGE_TOP_PX = scaleProductCardPx(-53);
export const HOME_PRODUCT_CARD_IMAGE_WIDTH_PX = scaleProductCardPx(306);
export const HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX = scaleProductCardPx(245);
export const HOME_PRODUCT_CARD_IMAGE_HOVER_LEFT_PX = scaleProductCardPx(6);
export const HOME_PRODUCT_CARD_IMAGE_HOVER_TOP_PX = scaleProductCardPx(-71);
export const HOME_PRODUCT_CARD_IMAGE_HOVER_WIDTH_PX = scaleProductCardPx(338);
export const HOME_PRODUCT_CARD_IMAGE_HOVER_HEIGHT_PX = scaleProductCardPx(270);

export const HOME_PRODUCT_CARD_PANEL_WIDTH_PX = scaleProductCardPx(330);
export const HOME_PRODUCT_CARD_PANEL_HEIGHT_PX = scaleProductCardPx(178);
export const HOME_PRODUCT_CARD_PANEL_TOP_PX = scaleProductCardPx(186);
export const HOME_PRODUCT_CARD_PANEL_LEFT_COLUMN_WIDTH_PX = scaleProductCardPx(192);
export const HOME_PRODUCT_CARD_PANEL_RADIUS_PX = scaleProductCardPx(25);

export const HOME_PRODUCT_CARD_HEART_SIZE_PX = scaleProductCardPx(34);
export const HOME_PRODUCT_CARD_HEART_TOP_PX = scaleProductCardPx(17);
export const HOME_PRODUCT_CARD_HEART_RIGHT_PX = scaleProductCardPx(15);
/** Figma `51:643` — mdi:heart-outline inactive fill. */
export const HOME_PRODUCT_CARD_HEART_INACTIVE_FILL_OPACITY = 0.35;

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

export const HOME_PRODUCT_CARD_HOVER_DURATION_MS = 300;
export const HOME_PRODUCT_CARD_HOVER_EASING = 'cubic-bezier(0, 0, 0.58, 1)';
export const HOME_PRODUCT_CARD_HOVER_BG = '#bbaa66';
export const HOME_PRODUCT_CARD_LIFT_PX = scaleProductCardPx(18);

export const HOME_PRODUCT_CARD_SIZES_LEFT_PX = scaleProductCardPx(68);
export const HOME_PRODUCT_CARD_SIZES_TOP_PX = scaleProductCardPx(138);
export const HOME_PRODUCT_CARD_SIZE_BADGE_WIDTH_PX = scaleProductCardPx(46);
export const HOME_PRODUCT_CARD_SIZE_BADGE_HEIGHT_PX = scaleProductCardPx(34);
export const HOME_PRODUCT_CARD_SIZE_BADGE_RADIUS_PX = scaleProductCardPx(14);
export const HOME_PRODUCT_CARD_SIZE_BADGE_GAP_PX = scaleProductCardPx(8);
export const HOME_PRODUCT_CARD_SIZE_BADGE_FONT_SIZE_PX = 12;
export const HOME_PRODUCT_CARD_SIZE_ACTIVE_BG = '#ef95aa';
export const HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BG = 'rgba(232, 232, 232, 0.32)';
export const HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BORDER = '#e8e8e8';
export const HOME_PRODUCT_CARD_SIZE_SOLD_OUT_TEXT = 'rgba(85, 85, 85, 0.43)';
export const HOME_PRODUCT_CARD_SIZE_INACTIVE_BG = '#ffffff';
export const HOME_PRODUCT_CARD_SIZE_INACTIVE_TEXT = '#555555';

export const HOME_PRODUCT_CARD_SWATCH_SIZE_PX = 24;
export const HOME_PRODUCT_CARD_SWATCH_GAP_PX = 8;

export const HOME_PRODUCT_CARD_ACTIONS_GAP_PX = 66;
export const HOME_PRODUCT_CARD_ACTIONS_HOVER_GAP_PX = 50;

export const HOME_PRODUCT_CARD_CART_SIZE_PX = 56;
export const HOME_PRODUCT_CARD_CART_SIZE_HOVER_PX = 69;
export const HOME_PRODUCT_CARD_CART_ICON_SIZE_PX = 32;
export const HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX = 39;
export const HOME_PRODUCT_CARD_CART_ICON_LEFT_PX = 11;
export const HOME_PRODUCT_CARD_CART_ICON_TOP_PX = 12;
export const HOME_PRODUCT_CARD_CART_ICON_HOVER_LEFT_PX = 14;
export const HOME_PRODUCT_CARD_CART_ICON_HOVER_TOP_PX = 14.5;
export const HOME_PRODUCT_CARD_CART_BG = '#96d0ff';

export const HOME_PRODUCT_CARD_ASSETS = {
  placeholderImage: '/assets/home/product-card/placeholder-jacket.png',
  star: '/assets/home/product-card/icon-star.svg',
  cart: '/assets/home/product-card/icon-cart.svg',
} as const;

export const BEST_PRODUCTS_SECTION_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const BEST_PRODUCTS_HEADING_PADDING_Y_PX = HOME_SECTION_HEADING_PADDING_Y_PX;
export const BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX = 64;

export const BEST_PRODUCTS_TITLE_FONT_SIZE_PX = HOME_SECTION_TITLE_FONT_SIZE_PX;
export const BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX = 50;

export const BEST_PRODUCTS_LINK_FONT_SIZE_PX = HOME_SECTION_LINK_FONT_SIZE_PX;
export const BEST_PRODUCTS_LINK_LINE_HEIGHT_PX = HOME_SECTION_LINK_LINE_HEIGHT_PX;
export const BEST_PRODUCTS_LINK_GAP_PX = HOME_SECTION_LINK_GAP_PX;

export const BEST_PRODUCTS_CHEVRON_SIZE_PX = HOME_SECTION_CHEVRON_SIZE_PX;

export const BEST_PRODUCTS_HEADING_COLOR = '#ef95aa';

export const BEST_PRODUCTS_ASSETS = {
  chevronRight: '/assets/home/icon-chevron-right-pink.svg',
} as const;
