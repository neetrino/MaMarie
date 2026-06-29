import { BRAND_COLORS } from './brand';
import { HOME_PRODUCT_CARD_ASSETS } from './home-sections';

/** Figma mobile home artboard — 375×2147 (`MobileApp`). */
export const MOBILE_HOME_DESIGN_WIDTH_PX = 375;

export const MOBILE_HOME_BG = '#f1f1f3';
export const MOBILE_HOME_SECTION_GAP_PX = 32;
export const MOBILE_HOME_HORIZONTAL_PADDING_PX = 20;

export const MOBILE_HOME_SEARCH_HEIGHT_PX = 48;
export const MOBILE_HOME_SEARCH_RADIUS_PX = 70;

export const MOBILE_HOME_SALE_BANNER_HEIGHT_PX = 193;
export const MOBILE_HOME_SALE_BANNER_RADIUS_PX = 30;
export const MOBILE_HOME_SALE_BANNER_BG = BRAND_COLORS.yellow;
export const MOBILE_HOME_SALE_TITLE_COLOR = '#5281e1';

export const MOBILE_HOME_GENDER_BUTTON_WIDTH_PX = 184;
export const MOBILE_HOME_GENDER_BUTTON_HEIGHT_PX = 50;
export const MOBILE_HOME_GENDER_BUTTON_GAP_PX = 8;
export const MOBILE_HOME_GENDER_GIRLS_BG = BRAND_COLORS.pink;
export const MOBILE_HOME_GENDER_BOYS_BG = '#5281e1';

export const MOBILE_HOME_SECTION_TITLE_SIZE_PX = 35;
export const MOBILE_HOME_SECTION_TITLE_LINE_HEIGHT_PX = 45;
export const MOBILE_HOME_SECTION_TITLE_COLOR = 'rgba(0, 0, 0, 0.72)';

export const MOBILE_HOME_PRODUCT_CARD_WIDTH_PX = 184;
export const MOBILE_HOME_PRODUCT_CARD_HEIGHT_PX = 330;
export const MOBILE_HOME_PRODUCT_CARD_RADIUS_PX = 30;
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
  search: '/assets/brand/icon-search.svg',
  chevronCta: '/assets/home/icon-chevron-right.svg',
  chevronSection: '/assets/home/icon-chevron-right-pink.svg',
  saleHeroImage: '/assets/home/sale-banner-child.png',
  promoImage: '/assets/home/sale-banner-child.png',
  star: HOME_PRODUCT_CARD_ASSETS.star,
  heart: HOME_PRODUCT_CARD_ASSETS.heart,
  placeholderImage: HOME_PRODUCT_CARD_ASSETS.placeholderImage,
} as const;

export const MOBILE_HOME_PRODUCTS_VISIBLE_COUNT = 3;
export const MOBILE_HOME_TESTIMONIAL_COUNT = 3;
