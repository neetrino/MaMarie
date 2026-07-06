import { BRAND_COLORS } from './brand';
import { HERO_GENDER_BUTTON_INSET_SHADOW } from './hero';
import { PROFILE_DESKTOP_ASSETS } from './profile-desktop-page';

/** Figma `222:491` — login page artboard. */
export const LOGIN_PAGE_BG_HEIGHT_PX = 854;
/** Exported PNG height — prevents top crop of clay letters. */
export const LOGIN_POD_FORM_BG_HEIGHT_PX = 864;
export const LOGIN_PAGE_BG_COLOR = '#ffffff';
export const LOGIN_PAGE_SECTION_PADDING_X_PX = 16;
export const LOGIN_PAGE_SECTION_PADDING_TOP_PX = 24;
export const LOGIN_PAGE_SECTION_PADDING_BOTTOM_PX = 0;
/** Mobile auth — breathing room below fixed navbar. */
export const LOGIN_PAGE_SECTION_PADDING_TOP_MOBILE_PX = 16;
/** Mobile auth — no extra gap under the sign-in card (shell handles bottom nav). */
export const LOGIN_PAGE_SECTION_PADDING_BOTTOM_MOBILE_PX = 0;
/** Pull login section into footer — Figma `222:492` meets `222:654` with no white gap. */
export const LOGIN_SECTION_FOOTER_OVERLAP_PX = 58;
/** Sign-in card vertical offset (lower = higher on page). */
export const SIGN_IN_CARD_OFFSET_TOP_PX = 50;
export const SIGN_IN_CARD_OFFSET_TOP_MOBILE_PX = 20;
/** Register card vertical offset (lower = higher on page). */
export const REGISTER_CARD_OFFSET_TOP_PX = 0;
export const REGISTER_CARD_OFFSET_TOP_MOBILE_PX = 12;

/** Figma `222:492` — clay pod-form background behind the login card. */
export const LOGIN_POD_FORM_BG = '/assets/auth/login-pod-form-bg.png';
export const LOGIN_POD_FORM_LEFT_PERCENT = -3.6;
export const LOGIN_POD_FORM_WIDTH_PERCENT = 105.41;

/** Figma `222:539` — gray login card (no white outer frame). */
export const LOGIN_CARD_MAX_WIDTH_PX = 420;
/** Wider card for register — two-column fields. */
export const REGISTER_CARD_MAX_WIDTH_PX = 520;
export const LOGIN_CARD_PADDING_X_PX = 28;
export const LOGIN_CARD_PADDING_Y_PX = 45;
export const LOGIN_CARD_PADDING_Y_MOBILE_PX = 32;

/** Figma `222:539` — inner gray card. */
export const LOGIN_CARD_INNER_BG = '#f4f4f4';
export const LOGIN_CARD_INNER_RADIUS_PX = 30;
export const LOGIN_CARD_INNER_GAP_PX = 22;
export const LOGIN_CARD_INNER_GAP_MOBILE_PX = 24;

/** Figma `222:543` — title block. */
export const LOGIN_TITLE_FONT_SIZE_PX = 26;
export const LOGIN_TITLE_LINE_HEIGHT = 1.1;
export const LOGIN_TITLE_COLOR = '#232323';
export const LOGIN_TITLE_TRACKING_PX = -0.45;
export const LOGIN_SUBTITLE_FONT_SIZE_PX = 14;
export const LOGIN_SUBTITLE_LINE_HEIGHT = 1.5;
export const LOGIN_SUBTITLE_COLOR = 'rgba(0, 0, 0, 0.24)';
export const LOGIN_HEADING_GAP_PX = 14;

/** Figma `222:546` — form stack. */
export const LOGIN_FORM_GAP_PX = 22;
export const LOGIN_FORM_GAP_MOBILE_PX = 24;
export const LOGIN_FIELDS_GAP_PX = 18;
export const LOGIN_FIELDS_GAP_MOBILE_PX = 20;
export const LOGIN_LABEL_FONT_SIZE_PX = 14;
export const LOGIN_LABEL_COLOR = '#232323';
export const LOGIN_LABEL_TO_INPUT_GAP_PX = 8;
export const LOGIN_SECONDARY_TEXT_FONT_SIZE_PX = 14;
export const LOGIN_CHECKBOX_SIZE_PX = 20;

/** Figma `222:550` / `222:555` — pill inputs. */
export const LOGIN_INPUT_HEIGHT_PX = 52;
export const LOGIN_INPUT_RADIUS_PX = 36;
export const LOGIN_INPUT_BORDER_COLOR = '#ededed';
export const LOGIN_INPUT_BORDER_WIDTH_PX = 1.5;
export const LOGIN_INPUT_PADDING_X_PX = 14;
export const LOGIN_INPUT_PADDING_Y_PX = 14;
export const LOGIN_INPUT_ICON_SIZE_PX = 20;
export const LOGIN_INPUT_ICON_GAP_PX = 10;
export const LOGIN_INPUT_FONT_SIZE_PX = 14;
/** iOS Safari auto-zooms focused inputs below 16px. */
export const LOGIN_INPUT_FONT_SIZE_MOBILE_PX = 16;
export const LOGIN_INPUT_TEXT_COLOR = '#232323';
export const LOGIN_INPUT_BG = '#ffffff';

/** Figma `222:592` — pink clay submit. */
export const LOGIN_SUBMIT_HEIGHT_PX = 52;
export const LOGIN_SUBMIT_FONT_SIZE_PX = 15;
export const LOGIN_SUBMIT_LINE_HEIGHT_PX = 24;
export const LOGIN_SUBMIT_BG = BRAND_COLORS.pink;
export const LOGIN_SUBMIT_INSET_SHADOW = HERO_GENDER_BUTTON_INSET_SHADOW;
export const LOGIN_ACTIONS_GAP_PX = 24;
/** Mobile remember-me row — keep «Հիշել ինձ» + forgot password on one line. */
export const LOGIN_ACTIONS_ROW_MOBILE_GAP_PX = 8;
export const LOGIN_SECONDARY_TEXT_FONT_SIZE_MOBILE_PX = 12;
export const LOGIN_CHECKBOX_GAP_PX = 8;
export const LOGIN_ACTIONS_TOP_GAP_PX = 18;

/** Remember me + forgot password — single row on mobile, wraps on desktop if needed. */
export const LOGIN_ACTIONS_ROW_CLASS =
  'flex w-full items-center justify-between max-lg:flex-nowrap max-lg:gap-2 lg:flex-wrap lg:gap-x-6 lg:gap-y-2';

export const LOGIN_SECONDARY_TEXT_CLASS =
  'font-medium max-lg:text-xs max-lg:leading-4 lg:text-sm lg:leading-normal';

export const LOGIN_FORGOT_PASSWORD_LINK_CLASS = `${LOGIN_SECONDARY_TEXT_CLASS} shrink-0 underline decoration-solid underline-offset-2 max-lg:text-right`;

export const LOGIN_MUTED_TEXT_COLOR = '#9c9c9c';
export const LOGIN_SIGNUP_LINK_COLOR = '#256dff';
export const LOGIN_FOOTER_TEXT_COLOR = '#6c6c6c';

export const LOGIN_ERROR_CLASS =
  'rounded-[15px] border border-red-200 bg-red-50 p-4 text-sm text-red-600';

export const LOGIN_INPUT_CLASS =
  'min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-[#232323] placeholder:text-neutral-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60';

/** Mobile 16px / desktop Figma 14px — avoids iOS input focus zoom. */
export const LOGIN_INPUT_FIELD_CLASS = `${LOGIN_INPUT_CLASS} text-base lg:text-sm`;

/** Mobile Figma pill / desktop `rounded-full` — same as clay Mutq submit. */
export const LOGIN_INPUT_SHELL_RADIUS_CLASS = 'rounded-[36px] lg:rounded-full' as const;

/** Figma `222:551` / `222:556` / `222:558` — login field icons. */
export const LOGIN_FIELD_ASSETS = {
  iconMail: '/assets/auth/icon-mail.svg',
  iconLock: '/assets/auth/icon-lock.svg',
  iconEyeOff: '/assets/auth/icon-eye-off.svg',
} as const;

/** Figma decoration — bow above card. */
export const LOGIN_PAGE_ASSETS = {
  bow: PROFILE_DESKTOP_ASSETS.decoBow,
} as const;

export const LOGIN_DECO_BOW_SIZE_PX = 247;
export const LOGIN_DECO_BOW_TOP_PX = -8;
export const LOGIN_DECO_BOW_LEFT_PX = -40;
