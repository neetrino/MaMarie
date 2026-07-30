/** About Us / About page cards — slide in from sides when in view. */
export const ABOUT_US_CARD_ENTER_DURATION_MS = 1450;
export const ABOUT_US_CARD_ENTER_DISTANCE_PX = 48;
/** Home About Us: left intro, story, yellow. */
export const ABOUT_US_CARD_ENTER_STAGGER_MS = {
  left: 0,
  story: 200,
  yellow: 380,
} as const;

/** /about gallery: 2 from left, 2 from right. */
export const ABOUT_PAGE_GALLERY_ENTER_STAGGER_MS = {
  leftOuter: 0,
  leftInner: 180,
  rightInner: 180,
  rightOuter: 360,
} as const;
