import { BRAND_COLORS } from './brand';
import { HERO_ASSETS } from './hero';

/** Contact page — white section background, gray form card. */
export const CONTACT_FORM_SECTION_BG = '#ffffff';
export const CONTACT_FORM_CARD_BG = '#f6f6f6';
export const CONTACT_FORM_CARD_RADIUS_PX = 20;
export const CONTACT_FORM_CARD_PADDING_X_PX = 32;
export const CONTACT_FORM_CARD_PADDING_Y_PX = 36;
export const CONTACT_FORM_CARD_PADDING_TOP_PX = 40;

/** Vertical spacing between field groups. */
export const CONTACT_FORM_FIELD_GAP_PX = 20;
export const CONTACT_FORM_LABEL_TO_INPUT_GAP_PX = 8;
export const CONTACT_FORM_SUBMIT_MARGIN_TOP_PX = 28;

export const CONTACT_FORM_LABEL_FONT_SIZE_PX = 16;
export const CONTACT_FORM_LABEL_LINE_HEIGHT_PX = 24;
export const CONTACT_FORM_LABEL_COLOR = '#1d1c16';

export const CONTACT_FORM_INPUT_HEIGHT_PX = 50;
export const CONTACT_FORM_INPUT_RADIUS_PX = 15;
export const CONTACT_FORM_INPUT_BORDER_COLOR = '#e5e7eb';
export const CONTACT_FORM_INPUT_FONT_SIZE_PX = 16;

export const CONTACT_FORM_TEXTAREA_MIN_HEIGHT_PX = 148;

export const CONTACT_FORM_SUBMIT_HEIGHT_PX = 56;
export const CONTACT_FORM_SUBMIT_BG = BRAND_COLORS.pink;
export const CONTACT_FORM_SUBMIT_FONT_SIZE_PX = 16;

/** Decorative strawberry — overlaps top-right card edge. */
export const CONTACT_FORM_STRAWBERRY_SIZE_PX = 118;
export const CONTACT_FORM_STRAWBERRY_TOP_PX = -52;
export const CONTACT_FORM_STRAWBERRY_RIGHT_PX = -20;
/** PNG artboard has extra transparent padding — scale visible fruit up. */
export const CONTACT_FORM_STRAWBERRY_IMAGE_SCALE = 1.48;
export const CONTACT_FORM_STRAWBERRY_ROTATE_DEG = -18;

export const CONTACT_FORM_ASSETS = {
  strawberry: HERO_ASSETS.decorationStrawberry,
} as const;

/** Shared Tailwind classes for text inputs and textarea. */
export const CONTACT_FORM_INPUT_CLASS =
  'w-full border bg-white px-4 text-[#1d1c16] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ef95aa]/35 focus:border-[#ef95aa] disabled:cursor-not-allowed disabled:opacity-60';
