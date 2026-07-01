import { BRAND_COLORS } from './brand';
import {
  HEADER_CONTENT_CLEARANCE_DESKTOP_PX,
  HEADER_CONTENT_CLEARANCE_MOBILE_PX,
} from './header';
import {
  HOME_PRODUCT_CARD_DESIGN_WIDTH_PX,
  HOME_PRODUCT_CARD_IMAGE_TOP_PX,
  HOME_PRODUCT_CARD_WIDTH_PX,
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  homeSectionColumnWidthPx,
} from './home-sections';
import { resolveHomeProductCardHeightPx } from '../lib/home-product-card-layout';

/** Figma shop page — catalog layout tokens. Horizontal insets use `HomeContentHorizontalFrame` (same as navbar pill). */

/** Extra breathing room below fixed navbar — shop page only. */
export const PRODUCTS_CATALOG_NAVBAR_GAP_EXTRA_PX = 35;

/** Top inset — content clears fixed navbar + shop-specific gap. */
export const PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX =
  HEADER_CONTENT_CLEARANCE_MOBILE_PX + PRODUCTS_CATALOG_NAVBAR_GAP_EXTRA_PX;
export const PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX =
  HEADER_CONTENT_CLEARANCE_DESKTOP_PX + PRODUCTS_CATALOG_NAVBAR_GAP_EXTRA_PX;

export const PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX = 281;
export const PRODUCTS_CATALOG_MAIN_GAP_PX = 52;
/** Breadcrumb row → product grid (desktop). */
export const PRODUCTS_CATALOG_TOP_ROW_PB_PX = 16;
/** Product grid top inset below breadcrumb / sort row. */
export const PRODUCTS_CATALOG_GRID_OFFSET_TOP_PX = 104;

/** PDP related products — title → card row (same as home best-products; image sits in this inset). */
export const RELATED_PRODUCTS_GRID_OFFSET_TOP_PX = BEST_PRODUCTS_GRID_OFFSET_TOP_PX;

/** Horizontal space between catalog cards. */
export const PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX = 24;

/** PDP related row — slightly tighter than shop grid. */
export const RELATED_PRODUCTS_CARD_GAP_PX = 8;
export const PRODUCTS_CATALOG_CARD_COLUMNS = 3;
export const PRODUCTS_CATALOG_GRID4_COLUMNS = 4;

/** Product grid width beside the filter sidebar (1354 − sidebar − gap). */
export const PRODUCTS_CATALOG_MAIN_CONTENT_WIDTH_PX =
  HOME_SECTION_CONTENT_MAX_WIDTH_PX -
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX -
  PRODUCTS_CATALOG_MAIN_GAP_PX;

/** Fits exactly three cards per row in the catalog main column. */
export const PRODUCTS_CATALOG_CARD_WIDTH_PX = Math.floor(
  homeSectionColumnWidthPx(
    PRODUCTS_CATALOG_CARD_COLUMNS,
    PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
    PRODUCTS_CATALOG_MAIN_CONTENT_WIDTH_PX,
  ),
);

/**
 * Vertical space between rows — product images sit above the card (`HOME_PRODUCT_CARD_IMAGE_TOP_PX`).
 * Row gap must clear that overhang so cards do not overlap.
 */
export const PRODUCTS_CATALOG_CARD_ROW_GAP_PX =
  Math.abs(HOME_PRODUCT_CARD_IMAGE_TOP_PX * (PRODUCTS_CATALOG_CARD_WIDTH_PX / HOME_PRODUCT_CARD_WIDTH_PX)) +
  8;

export const PRODUCTS_CATALOG_CARD_HEIGHT_PX = resolveHomeProductCardHeightPx(
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
);

export const PRODUCTS_CATALOG_CARD_LAYOUT_SCALE =
  PRODUCTS_CATALOG_CARD_WIDTH_PX / HOME_PRODUCT_CARD_DESIGN_WIDTH_PX;

export const PRODUCTS_CATALOG_FILTER_SECTION_BG = '#f6f6f6';
export const PRODUCTS_CATALOG_FILTER_SECTION_RADIUS_PX = 16;
export const PRODUCTS_CATALOG_FILTER_SECTION_SHADOW = '0px 1px 4px rgba(0, 0, 0, 0.06)';
export const PRODUCTS_CATALOG_FILTER_TITLE_LETTER_SPACING_PX = 1.4;
export const PRODUCTS_CATALOG_FILTER_TITLE_SIZE_PX = 13;
export const PRODUCTS_CATALOG_FILTER_TITLE_LINE_HEIGHT_PX = 19.5;
export const PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX = 14;
export const PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX = 20;
export const PRODUCTS_CATALOG_FILTER_NOTE_SIZE_PX = 13;
export const PRODUCTS_CATALOG_FILTER_NOTE_LINE_HEIGHT_PX = 18.5;
export const PRODUCTS_CATALOG_FILTER_SIZE_CHIP_FONT_SIZE_PX = 14;
export const PRODUCTS_CATALOG_FILTER_PRICE_FONT_SIZE_PX = 15;
export const PRODUCTS_CATALOG_FILTER_ACCENT = '#5281e1';
export const PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX = 16;
export const PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX = 4;
export const PRODUCTS_CATALOG_BREADCRUMB_MUTED = 'rgba(29, 28, 22, 0.36)';
export const PRODUCTS_CATALOG_TEXT_DARK = '#1d1c16';

export const PRODUCTS_CATALOG_SORT_PILL_BG = BRAND_COLORS.pink;
export const PRODUCTS_CATALOG_VIEW_PILL_BG = '#f3f3f3';
export const PRODUCTS_CATALOG_PILL_HEIGHT_PX = 48;
export const PRODUCTS_CATALOG_PILL_RADIUS_PX = 30;
export const PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX = 231;
export const PRODUCTS_CATALOG_SORT_TEXT_SIZE_PX = 16;
export const PRODUCTS_CATALOG_SORT_ICON_SIZE_PX = 16;
export const PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX = 25;
export const PRODUCTS_CATALOG_ASSETS = {
  sortSliders: '/assets/products/icon-sort-sliders.svg',
} as const;

/** Catalog toolbar view modes — list, 3-column grid, 4-column grid (Figma `51:666`). */
export const PRODUCTS_CATALOG_VIEW_MODES = ['list', 'grid-3', 'grid-4'] as const;
export type ProductsCatalogViewMode = (typeof PRODUCTS_CATALOG_VIEW_MODES)[number];
/** Default — middle (2nd) icon in the view toolbar; user choice is persisted in localStorage. */
export const PRODUCTS_CATALOG_DEFAULT_VIEW_MODE: ProductsCatalogViewMode =
  PRODUCTS_CATALOG_VIEW_MODES[1];

/** Fits exactly four cards per row in the catalog main column. */
export const PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX = Math.floor(
  homeSectionColumnWidthPx(
    PRODUCTS_CATALOG_GRID4_COLUMNS,
    PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
    PRODUCTS_CATALOG_MAIN_CONTENT_WIDTH_PX,
  ),
);

export const PRODUCTS_CATALOG_CARD_HEIGHT_GRID4_PX = resolveHomeProductCardHeightPx(
  PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX,
);

const PRODUCTS_CATALOG_GRID_BASE_CLASS =
  'grid w-full overflow-visible justify-items-center lg:justify-items-start';

/** Responsive catalog grid — 3 or 4 columns on desktop beside the sidebar. */
export function getProductsCatalogGridClassName(
  viewMode: ProductsCatalogViewMode,
): string {
  if (viewMode === 'list') {
    return 'flex w-full flex-col overflow-visible';
  }

  if (viewMode === 'grid-4') {
    return `${PRODUCTS_CATALOG_GRID_BASE_CLASS} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
  }

  return `${PRODUCTS_CATALOG_GRID_BASE_CLASS} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
}

export function normalizeProductsCatalogViewMode(value: string | null): ProductsCatalogViewMode {
  if (value === 'list' || value === 'grid-3' || value === 'grid-4') {
    return value;
  }
  return PRODUCTS_CATALOG_DEFAULT_VIEW_MODE;
}

export const PRODUCTS_CATALOG_CTA_WIDTH_PX = 200;
export const PRODUCTS_CATALOG_CTA_HEIGHT_PX = 56;
export const PRODUCTS_CATALOG_CTA_BG = BRAND_COLORS.pink;
export const PRODUCTS_CATALOG_CTA_INSET_SHADOW =
  'inset 0px -4px 8px rgba(0, 0, 0, 0.27), inset 0px 4px 4px rgba(255, 255, 255, 0.4), inset 0px 20px 40px -10px rgba(164, 60, 18, 0.2)';

export const PRODUCTS_CATALOG_FILTER_CHEVRON_SRC = '/assets/products/filter-chevron.svg';
export const PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX = 14;

/** Max products prefetched client-side for instant first filter preview. */
export const PRODUCTS_CATALOG_CLIENT_POOL_LIMIT = 200;

/** Debounce delay before server fetch when catalog search query changes. */
export const PRODUCTS_CATALOG_SEARCH_DEBOUNCE_MS = 300;

/** List view — full-width horizontal product row. */
export const PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX = 128;
export const PRODUCTS_CATALOG_LIST_ROW_GAP_PX = 12;
export const PRODUCTS_CATALOG_LIST_IMAGE_WIDTH_PX = 152;
export const PRODUCTS_CATALOG_LIST_HEART_TOP_PX = 8;
export const PRODUCTS_CATALOG_LIST_HEART_RIGHT_PX = 8;
export const PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX = 30;
export const PRODUCTS_CATALOG_LIST_ROW_BORDER_WIDTH_PX = 1;
export const PRODUCTS_CATALOG_LIST_PANEL_PADDING_X_PX = 18;
export const PRODUCTS_CATALOG_LIST_PANEL_PADDING_Y_PX = 14;
export const PRODUCTS_CATALOG_LIST_PRICE_TO_ACTIONS_GAP_PX = 20;
export const PRODUCTS_CATALOG_LIST_RATING_STAR_TEXT_GAP_PX = 4;
export const PRODUCTS_CATALOG_LIST_RATING_TO_CART_GAP_PX = 8;
