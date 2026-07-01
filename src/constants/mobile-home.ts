import { BRAND_COLORS } from './brand';
import { HOME_PRODUCT_CARD_ASSETS } from './home-sections';
import { resolveHomeProductCardHeightPx, homeProductCardLayoutPx } from '../lib/home-product-card-layout';
import {
  HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_TOP_PX,
} from './home-sections';
import { MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX } from './mobile-bottom-nav';

/** Figma mobile home artboard — 375×2147 (`MobileApp`). */
export const MOBILE_HOME_DESIGN_WIDTH_PX = 375;

export const MOBILE_HOME_BG = '#f1f1f3';
export const MOBILE_HOME_SECTION_GAP_PX = 50;
export const MOBILE_HOME_HORIZONTAL_PADDING_PX = 20;
/** Slightly tighter than full nav shell — less empty strip above bottom bar. */
export const MOBILE_HOME_BOTTOM_NAV_CLEARANCE_OFFSET_PX = 10;
export const MOBILE_HOME_BOTTOM_NAV_CLEARANCE_PX =
  MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX - MOBILE_HOME_BOTTOM_NAV_CLEARANCE_OFFSET_PX;
export const MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX = 20;

export const MOBILE_HOME_SEARCH_HEIGHT_PX = 48;
export const MOBILE_HOME_SEARCH_RADIUS_PX = 70;
/** Figma `74:750` — magnifier icon inside the search field. */
export const MOBILE_HOME_SEARCH_ICON_SIZE_PX = 35;
export const MOBILE_HOME_SEARCH_ICON_LEFT_PX = 19;
export const MOBILE_HOME_SEARCH_ICON_COLOR = '#c3c9d0';
export const MOBILE_HOME_SEARCH_INPUT_PADDING_LEFT_PX =
  MOBILE_HOME_SEARCH_ICON_LEFT_PX + MOBILE_HOME_SEARCH_ICON_SIZE_PX + 8;

export const MOBILE_HOME_HERO_TOP_PADDING_PX = 16;
export const MOBILE_HOME_HERO_SEARCH_TO_SALE_GAP_PX = 29;
export const MOBILE_HOME_HERO_SALE_TO_GENDER_GAP_PX = 41;
export const MOBILE_HOME_HERO_GENDER_INSET_LEFT_PX = 11;

export const MOBILE_HOME_SALE_BANNER_HEIGHT_PX = 193;
export const MOBILE_HOME_SALE_BANNER_MAX_WIDTH_PX = 370;
export const MOBILE_HOME_SALE_BANNER_RADIUS_PX = 30;
export const MOBILE_HOME_SALE_BANNER_BG = BRAND_COLORS.yellow;
export const MOBILE_HOME_SALE_TITLE_COLOR = '#5281e1';
/** Figma `74:769` — «Sale» display type (Mirage Expanded). */
export const MOBILE_HOME_SALE_LABEL_SIZE_PX = 73;
export const MOBILE_HOME_SALE_LABEL_LINE_HEIGHT_PX = 45;
export const MOBILE_HOME_SALE_LABEL_WIDTH_PX = 239;
export const MOBILE_HOME_SALE_LABEL_HEIGHT_PX = 45;
export const MOBILE_HOME_SALE_LABEL_LEFT_PX = 20;
export const MOBILE_HOME_SALE_LABEL_TOP_PX = 51.5;
/** Figma `74:770` — discount percentage. */
export const MOBILE_HOME_SALE_DISCOUNT_SIZE_PX = 75;
export const MOBILE_HOME_SALE_DISCOUNT_LINE_HEIGHT_PX = 45;
export const MOBILE_HOME_SALE_DISCOUNT_LEFT_PX = 18;
export const MOBILE_HOME_SALE_DISCOUNT_TOP_PX = 96.5;
/** Figma `74:771` — white CTA pill. */
export const MOBILE_HOME_SALE_CTA_WIDTH_PX = 176;
export const MOBILE_HOME_SALE_CTA_HEIGHT_PX = 50;
export const MOBILE_HOME_SALE_CTA_LEFT_PX = 18;
export const MOBILE_HOME_SALE_CTA_TOP_PX = 128;
export const MOBILE_HOME_SALE_CTA_CHEVRON_BG = 'rgba(239, 149, 170, 0.62)';
/** Figma `74:778` — girl photo crop frame. */
export const MOBILE_HOME_SALE_IMAGE_WIDTH_PX = 279;
export const MOBILE_HOME_SALE_IMAGE_HEIGHT_PX = 288;
export const MOBILE_HOME_SALE_IMAGE_CENTER_OFFSET_PX = 94.5;
export const MOBILE_HOME_SALE_IMAGE_TOP_PX = -1;
export const MOBILE_HOME_SALE_IMAGE_RADIUS_PX = 7;

export const MOBILE_HOME_GENDER_BUTTON_WIDTH_PX = 184;
export const MOBILE_HOME_GENDER_BUTTON_HEIGHT_PX = 50;
export const MOBILE_HOME_GENDER_BUTTON_GAP_PX = 8;
export const MOBILE_HOME_GENDER_GIRLS_BG = BRAND_COLORS.pink;
export const MOBILE_HOME_GENDER_BOYS_BG = '#5281e1';

export const MOBILE_HOME_SECTION_TITLE_SIZE_PX = 35;
export const MOBILE_HOME_SECTION_TITLE_LINE_HEIGHT_PX = 45;
export const MOBILE_HOME_SECTION_TITLE_COLOR = 'rgba(0, 0, 0, 0.72)';
/** Figma `74:789` — white see-all pill next to section title. */
export const MOBILE_HOME_SECTION_SEE_ALL_BUTTON_SIZE_PX = 40;
export const MOBILE_HOME_SECTION_SEE_ALL_BUTTON_RADIUS_PX = 20;
export const MOBILE_HOME_SECTION_SEE_ALL_BUTTON_PADDING_PX = 10;
export const MOBILE_HOME_SECTION_SEE_ALL_ARROW_SIZE_PX = 20;

export const MOBILE_HOME_PRODUCT_CARD_WIDTH_PX = 240;

/** Product photo bleed above card — matches HomeProductCard image frame offsets. */
const HOME_PRODUCT_CARD_IMAGE_INNER_TOP_BLEED_RATIO = 0.2148;

function mobileHomeProductCardTopBleedPx(widthPx: number): number {
  const imageWrapTopPx = homeProductCardLayoutPx(HOME_PRODUCT_CARD_IMAGE_TOP_PX, widthPx);
  const imageWrapHeightPx = homeProductCardLayoutPx(HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX, widthPx);

  return Math.ceil(
    Math.abs(imageWrapTopPx) + imageWrapHeightPx * HOME_PRODUCT_CARD_IMAGE_INNER_TOP_BLEED_RATIO,
  );
}

export const MOBILE_HOME_PRODUCT_CARD_TOP_BLEED_PX = mobileHomeProductCardTopBleedPx(
  MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
);
export const MOBILE_HOME_PRODUCT_CARD_HEIGHT_PX = resolveHomeProductCardHeightPx(
  MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
);
export const MOBILE_HOME_PRODUCT_CARD_GAP_PX = 10;

export const MOBILE_HOME_DOT_ACTIVE_WIDTH_PX = 35;
export const MOBILE_HOME_DOT_SIZE_PX = 10;
export const MOBILE_HOME_DOT_GAP_PX = 7;
export const MOBILE_HOME_DOT_ACTIVE_COLOR = '#90b4ff';
export const MOBILE_HOME_DOT_INACTIVE_COLOR = '#ffffff';
export const MOBILE_HOME_DOT_ACTIVE_COLOR_PINK = BRAND_COLORS.pink;

export const MOBILE_HOME_TESTIMONIAL_CARD_HEIGHT_PX = 204;
export const MOBILE_HOME_TESTIMONIAL_CARD_RADIUS_PX = 30;
export const MOBILE_HOME_TESTIMONIAL_BLUE_BG = '#c2ddf9';
export const MOBILE_HOME_TESTIMONIAL_YELLOW_BG = BRAND_COLORS.yellow;
export const MOBILE_HOME_TESTIMONIAL_PROMO_BG = BRAND_COLORS.pink;

export const MOBILE_HOME_ASSETS = {
  /** Figma `74:750` — material-symbols:search-rounded. */
  search: '/assets/home/mobile/icon-search-rounded.svg',
  chevronCta: '/assets/home/icon-chevron-right.svg',
  /** Figma `74:790` — glyphs:arrow-bold inside `74:789`. */
  sectionSeeAllArrow: '/assets/home/mobile/section-see-all-arrow.svg',
  saleBannerGirl: '/assets/home/mobile/sale-banner-girl.png',
  saleBannerArrow: '/assets/home/mobile/sale-banner-arrow.svg',
  genderChevronGirls: '/assets/home/mobile/gender-chevron-girls.svg',
  genderChevronBoys: '/assets/home/mobile/gender-chevron-boys.svg',
  promoImage: '/assets/home/sale-banner-child.png',
  star: HOME_PRODUCT_CARD_ASSETS.star,
  placeholderImage: HOME_PRODUCT_CARD_ASSETS.placeholderImage,
} as const;

export const MOBILE_HOME_PRODUCTS_VISIBLE_COUNT = 3;
export const MOBILE_HOME_TESTIMONIAL_COUNT = 3;
