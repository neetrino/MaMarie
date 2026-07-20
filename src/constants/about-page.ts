import { ABOUT_US_ASSETS } from './about-us-section';
import { BRAND_COLORS } from './brand';
import { HOME_SECTION_MAX_WIDTH_PX } from './home-sections';

/** Figma `300:576` — About us page (content only; header/footer from layout). */
export const ABOUT_PAGE_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;
export const ABOUT_PAGE_BG = '#ffffff';

export const ABOUT_PAGE_ASSETS = {
  title: '/assets/about/title-about-us.webp',
  hero: '/assets/about/hero-portrait.webp',
  gallery1: '/assets/about/gallery-1.webp',
  gallery2: '/assets/about/gallery-2.webp',
  gallery3: '/assets/about/gallery-3.webp',
  decoBird: '/assets/about/deco-bird.webp',
  decoStrawberry: ABOUT_US_ASSETS.decoStar,
  decoBunny: ABOUT_US_ASSETS.decoBunny,
  logoInline: ABOUT_US_ASSETS.logoInline,
} as const;

/** Match home hero — avoid Next default JPEG quality loss. */
export const ABOUT_PAGE_IMAGE_QUALITY = 100;

/** Title — Figma `307:643`. */
export const ABOUT_PAGE_TITLE_WIDTH_PX = 758;
export const ABOUT_PAGE_TITLE_HEIGHT_PX = 248;
export const ABOUT_PAGE_TITLE_TOP_PX = 0;

/** Hero portrait — Figma `307:628`. */
export const ABOUT_PAGE_HERO_WIDTH_PX = 550;
export const ABOUT_PAGE_HERO_HEIGHT_PX = 817;
export const ABOUT_PAGE_HERO_TOP_PX = 102;
export const ABOUT_PAGE_HERO_OFFSET_X_PX = 15;
export const ABOUT_PAGE_HERO_RADIUS_PX = 40;
export const ABOUT_PAGE_HERO_IMG_WIDTH_PERCENT = 139.31;
export const ABOUT_PAGE_HERO_IMG_HEIGHT_PERCENT = 140.38;
export const ABOUT_PAGE_HERO_IMG_LEFT_PERCENT = -39.31;
export const ABOUT_PAGE_HERO_IMG_TOP_PERCENT = -35.18;

/** Lead (logo + short line) — Figma `307:624`. */
export const ABOUT_PAGE_LEAD_LOGO_LEFT_PX = 242;
export const ABOUT_PAGE_LEAD_LOGO_TOP_PX = 335;
export const ABOUT_PAGE_LEAD_LOGO_WIDTH_PX = 86;
export const ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX = 37;
export const ABOUT_PAGE_LEAD_LOGO_CROP_HEIGHT_PERCENT = 237.18;
export const ABOUT_PAGE_LEAD_LOGO_CROP_TOP_PERCENT = -67.18;
/** Nudge clay wordmark vs text baseline (positive = up, negative = down). */
export const ABOUT_PAGE_LEAD_LOGO_RAISE_PX = -44;
export const ABOUT_PAGE_LEAD_TEXT_LEFT_PX = 211;
export const ABOUT_PAGE_LEAD_TEXT_TOP_PX = 346;
export const ABOUT_PAGE_LEAD_TEXT_WIDTH_PX = 298;
export const ABOUT_PAGE_LEAD_TEXT_SIZE_PX = 16;
export const ABOUT_PAGE_LEAD_TEXT_COLOR = '#5d5d5d';

/** Body copy right of hero — Figma `307:635`. */
export const ABOUT_PAGE_BODY_LEFT_PX = 1006;
export const ABOUT_PAGE_BODY_TOP_PX = 598;
export const ABOUT_PAGE_BODY_WIDTH_PX = 398;
export const ABOUT_PAGE_BODY_TEXT_SIZE_PX = 15;
export const ABOUT_PAGE_BODY_LINE_HEIGHT_PX = 20;
export const ABOUT_PAGE_BODY_TEXT_COLOR = '#5d5d5d';

/** Bunny beside body — Figma `307:638`. */
export const ABOUT_PAGE_BUNNY_LEFT_PX = 972;
export const ABOUT_PAGE_BUNNY_TOP_PX = 434;
export const ABOUT_PAGE_BUNNY_WRAPPER_SIZE_PX = 122.073;
export const ABOUT_PAGE_BUNNY_IMAGE_SIZE_PX = 104.088;
export const ABOUT_PAGE_BUNNY_ROTATE_DEG = -168.97;

/** Gallery band — Figma `307:626`. */
export const ABOUT_PAGE_GALLERY_TOP_PX = 678;
export const ABOUT_PAGE_GALLERY_HEIGHT_PX = 786;
export const ABOUT_PAGE_GALLERY_CARDS_TOP_PX = 60;
export const ABOUT_PAGE_GALLERY_CARD_GAP_PX = 27;
export const ABOUT_PAGE_GALLERY_CARD_WIDTH_PX = 406;
export const ABOUT_PAGE_GALLERY_PINK_WIDTH_PX = 410;
export const ABOUT_PAGE_GALLERY_CARD_HEIGHT_PX = 609;
export const ABOUT_PAGE_GALLERY_CARD_RADIUS_PX = 40;
export const ABOUT_PAGE_GALLERY_PINK_BG = BRAND_COLORS.pink;
export const ABOUT_PAGE_GALLERY_TEXT_SIZE_PX = 16;
export const ABOUT_PAGE_GALLERY_TEXT_LINE_HEIGHT_PX = 23;
export const ABOUT_PAGE_GALLERY_TEXT_TOP_PX = 147;
export const ABOUT_PAGE_GALLERY_TEXT_LEFT_PX = 40;
export const ABOUT_PAGE_GALLERY_TEXT_WIDTH_PX = 329;
export const ABOUT_PAGE_GALLERY_ROW_OFFSET_X_PX = -8.5;

/** Bird on pink card — Figma `307:625`. */
export const ABOUT_PAGE_BIRD_LEFT_PX = -130;
export const ABOUT_PAGE_BIRD_TOP_PX = -122;
export const ABOUT_PAGE_BIRD_WRAPPER_SIZE_PX = 321.127;
export const ABOUT_PAGE_BIRD_IMAGE_SIZE_PX = 233.401;
export const ABOUT_PAGE_BIRD_ROTATE_DEG = 58.38;

/** Strawberry over gallery — Figma `307:622`. */
export const ABOUT_PAGE_STRAWBERRY_LEFT_PX = 317;
export const ABOUT_PAGE_STRAWBERRY_TOP_PX = -20;
export const ABOUT_PAGE_STRAWBERRY_WRAPPER_SIZE_PX = 175.201;
export const ABOUT_PAGE_STRAWBERRY_IMAGE_SIZE_PX = 128.059;
export const ABOUT_PAGE_STRAWBERRY_ROTATE_DEG = 59.67;

export const ABOUT_PAGE_CANVAS_HEIGHT_PX =
  ABOUT_PAGE_GALLERY_TOP_PX + ABOUT_PAGE_GALLERY_HEIGHT_PX;

/** Mobile stack. */
export const ABOUT_PAGE_MOBILE_PADDING_X_PX = 16;
export const ABOUT_PAGE_MOBILE_PADDING_TOP_PX = 8;
export const ABOUT_PAGE_MOBILE_PADDING_BOTTOM_PX = 48;
export const ABOUT_PAGE_MOBILE_TITLE_MAX_WIDTH_PX = 320;
export const ABOUT_PAGE_MOBILE_HERO_MAX_WIDTH_PX = 320;
export const ABOUT_PAGE_MOBILE_HERO_HEIGHT_PX = 420;
export const ABOUT_PAGE_MOBILE_SECTION_GAP_PX = 24;
export const ABOUT_PAGE_MOBILE_GALLERY_GAP_PX = 16;
export const ABOUT_PAGE_MOBILE_CARD_RADIUS_PX = 28;
export const ABOUT_PAGE_MOBILE_PINK_PADDING_PX = 24;
