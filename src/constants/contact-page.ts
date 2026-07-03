/** Contact page info blocks — clay 3D icons. */
import { HEADER_MOBILE_PADDING_X_PX } from './header';
import { MOBILE_HOME_BG, MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX } from './mobile-home';

export const CONTACT_INFO_ICON_SIZE_PX = 64;
/** PNG artboards include extra transparent padding — scale visible icon up. */
export const CONTACT_INFO_ICON_IMAGE_SCALE = 1.55;
export const CONTACT_INFO_ICON_TO_TITLE_GAP_PX = 12;

export const CONTACT_INFO_TITLE_FONT_SIZE_PX = 22;
export const CONTACT_INFO_TITLE_LINE_HEIGHT_PX = 28;

/** Heading row → body text in the title column. */
export const CONTACT_INFO_HEADING_TO_BODY_GAP_PX = 12;

/** Two-column contact page layout — equal width left/right. */
export const CONTACT_PAGE_COLUMN_GAP_PX = 48;

/** Mobile — same horizontal track as navbar (`74:729`). */
export const CONTACT_PAGE_MOBILE_HORIZONTAL_PADDING_PX = HEADER_MOBILE_PADDING_X_PX;
export const CONTACT_PAGE_MOBILE_BG = MOBILE_HOME_BG;
export const CONTACT_PAGE_MOBILE_PADDING_TOP_PX = 28;
export const CONTACT_PAGE_MOBILE_PADDING_BOTTOM_PX = MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX;

/** Desktop shell — matches previous `lg:px-8`. */
export const CONTACT_PAGE_DESKTOP_HORIZONTAL_PADDING_PX = 32;
export const CONTACT_PAGE_VERTICAL_PADDING_PX = 48;

export const CONTACT_PAGE_ASSETS = {
  iconPhone: '/assets/contact/icon-phone.png',
  iconMail: '/assets/contact/icon-mail.png',
  iconLocation: '/assets/contact/icon-location.png',
} as const;
