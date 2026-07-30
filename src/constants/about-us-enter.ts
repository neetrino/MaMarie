/** /about «ABOUT» title — slow soft fade + rise. */
export const ABOUT_PAGE_TITLE_APPEAR_DURATION_MS = 1800;

/** About Us / About page cards — slide in from sides when in view. */
export const ABOUT_US_CARD_ENTER_DURATION_MS = 1700;
export const ABOUT_US_CARD_ENTER_DISTANCE_PX = 48;
/** Home About Us: left intro, story, yellow. */
export const ABOUT_US_CARD_ENTER_STAGGER_MS = {
  left: 0,
  story: 240,
  yellow: 460,
} as const;

/** /about gallery: 2 from left, 2 from right. */
export const ABOUT_PAGE_GALLERY_ENTER_STAGGER_MS = {
  leftOuter: 0,
  leftInner: 180,
  rightInner: 180,
  rightOuter: 360,
} as const;
