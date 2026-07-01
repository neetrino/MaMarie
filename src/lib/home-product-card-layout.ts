import {
  HOME_PRODUCT_CARD_COMPARE_SIZE_PX,
  HOME_PRODUCT_CARD_DESIGN_HEIGHT_PX,
  HOME_PRODUCT_CARD_DESIGN_WIDTH_PX,
  HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
  HOME_PRODUCT_CARD_PANEL_TOP_PX,
  HOME_PRODUCT_CARD_PRICE_SIZE_PX,
  HOME_PRODUCT_CARD_RATING_SIZE_PX,
  HOME_PRODUCT_CARD_SUBTITLE_SIZE_PX,
  HOME_PRODUCT_CARD_TITLE_SIZE_PX,
  HOME_PRODUCT_CARD_WIDTH_PX,
} from '../constants/home-sections';

const HOME_PRODUCT_CARD_TITLE_LINE_HEIGHT_PX = 28;
const HOME_PRODUCT_CARD_SUBTITLE_LINE_HEIGHT_PX = 28;
const HOME_PRODUCT_CARD_PRICE_LINE_HEIGHT_PX = 24;
const HOME_PRODUCT_CARD_RATING_LINE_HEIGHT_PX = 20;
const HOME_PRODUCT_CARD_RATING_STAR_SIZE_PX = 14;

/** 4-column catalog view — tighter type and fewer swatches so the panel fits. */
export const HOME_PRODUCT_CARD_COMPACT_TITLE_LINE_HEIGHT_PX = 20;
export const HOME_PRODUCT_CARD_COMPACT_SUBTITLE_LINE_HEIGHT_PX = 20;
export const HOME_PRODUCT_CARD_COMPACT_PRICE_LINE_HEIGHT_PX = 18;
export const HOME_PRODUCT_CARD_COMPACT_RATING_LINE_HEIGHT_PX = 16;
export const HOME_PRODUCT_CARD_COMPACT_COLOR_SWATCH_MAX_VISIBLE = 3;
export const HOME_PRODUCT_CARD_COMPACT_DESCRIPTION_TO_SWATCHES_GAP_PX = 5;

export interface HomeProductCardTypography {
  titleSizePx: number;
  subtitleSizePx: number;
  priceSizePx: number;
  compareSizePx: number;
  ratingSizePx: number;
  titleLineHeightPx: number;
  subtitleLineHeightPx: number;
  priceLineHeightPx: number;
  ratingLineHeightPx: number;
  ratingStarSizePx: number;
  colorSwatchMaxVisible: number;
}

/** Scales a homepage product-card layout token to a custom card width. */
export function homeProductCardLayoutPx(
  tokenPx: number,
  layoutWidthPx?: number,
): number {
  if (layoutWidthPx == null) {
    return tokenPx;
  }

  return tokenPx * (layoutWidthPx / HOME_PRODUCT_CARD_WIDTH_PX);
}

export function resolveHomeProductCardTypography(
  layoutWidthPx: number | undefined,
  compactPanel: boolean,
): HomeProductCardTypography {
  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);

  return {
    titleSizePx: lp(HOME_PRODUCT_CARD_TITLE_SIZE_PX),
    subtitleSizePx: lp(HOME_PRODUCT_CARD_SUBTITLE_SIZE_PX),
    priceSizePx: lp(HOME_PRODUCT_CARD_PRICE_SIZE_PX),
    compareSizePx: lp(HOME_PRODUCT_CARD_COMPARE_SIZE_PX),
    ratingSizePx: lp(HOME_PRODUCT_CARD_RATING_SIZE_PX),
    titleLineHeightPx: lp(
      compactPanel
        ? HOME_PRODUCT_CARD_COMPACT_TITLE_LINE_HEIGHT_PX
        : HOME_PRODUCT_CARD_TITLE_LINE_HEIGHT_PX,
    ),
    subtitleLineHeightPx: lp(
      compactPanel
        ? HOME_PRODUCT_CARD_COMPACT_SUBTITLE_LINE_HEIGHT_PX
        : HOME_PRODUCT_CARD_SUBTITLE_LINE_HEIGHT_PX,
    ),
    priceLineHeightPx: lp(
      compactPanel
        ? HOME_PRODUCT_CARD_COMPACT_PRICE_LINE_HEIGHT_PX
        : HOME_PRODUCT_CARD_PRICE_LINE_HEIGHT_PX,
    ),
    ratingLineHeightPx: lp(
      compactPanel
        ? HOME_PRODUCT_CARD_COMPACT_RATING_LINE_HEIGHT_PX
        : HOME_PRODUCT_CARD_RATING_LINE_HEIGHT_PX,
    ),
    ratingStarSizePx: lp(HOME_PRODUCT_CARD_RATING_STAR_SIZE_PX),
    colorSwatchMaxVisible: compactPanel ? HOME_PRODUCT_CARD_COMPACT_COLOR_SWATCH_MAX_VISIBLE : 4,
  };
}

/** Card height from width — at least tall enough for the info panel. */
export function resolveHomeProductCardHeightPx(
  layoutWidthPx?: number,
  layoutHeightPx?: number,
): number {
  if (layoutHeightPx != null) {
    return layoutHeightPx;
  }

  const width = layoutWidthPx ?? HOME_PRODUCT_CARD_WIDTH_PX;
  const aspectHeight = Math.round(
    width * (HOME_PRODUCT_CARD_DESIGN_HEIGHT_PX / HOME_PRODUCT_CARD_DESIGN_WIDTH_PX),
  );
  const panelBottom = Math.ceil(
    homeProductCardLayoutPx(
      HOME_PRODUCT_CARD_PANEL_TOP_PX + HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
      width,
    ),
  );

  return Math.max(aspectHeight, panelBottom);
}
