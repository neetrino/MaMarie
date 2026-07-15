/** Custom event dispatched to open the cart drawer. */
export const CART_DRAWER_OPEN_EVENT = 'cart-drawer-open';

/** Custom event dispatched to close the cart drawer. */
export const CART_DRAWER_CLOSE_EVENT = 'cart-drawer-close';

/** Stacked above header (80) and mobile bottom nav (70). */
export const CART_DRAWER_Z_INDEX = 90;

/** Desktop drawer width in pixels. */
export const CART_DRAWER_MAX_WIDTH_PX = 420;

/** Mobile drawer width as a percentage of the viewport (leaves room for close tab + backdrop tap). */
export const CART_DRAWER_MOBILE_WIDTH_PERCENT = 87;

/** Side-tab close pill — total width (px); half sits under drawer edge. */
export const CART_DRAWER_CLOSE_TAB_WIDTH_PX = 80;

/** Side-tab close pill — height (px). */
export const CART_DRAWER_CLOSE_TAB_HEIGHT_PX = 38;

/** Side-tab close control — offset from drawer top (px). */
export const CART_DRAWER_CLOSE_BUTTON_TOP_PX = 22;

/** Side-tab close icon size (px). */
export const CART_DRAWER_CLOSE_ICON_SIZE_PX = 16;

/** Side-tab close icon stroke width — bold X. */
export const CART_DRAWER_CLOSE_ICON_STROKE_WIDTH = 3;

/** Side-tab close icon horizontal nudge (px). */
export const CART_DRAWER_CLOSE_ICON_OFFSET_X_PX = 2;

/** Close tab hover scale multiplier. */
export const CART_DRAWER_CLOSE_TAB_HOVER_SCALE = 1.06;

/** Close tab hover transition duration (ms). */
export const CART_DRAWER_CLOSE_TAB_TRANSITION_MS = 200;

/** Drawer panel stacks above the close tab so the pill tucks under the edge. */
export const CART_DRAWER_PANEL_Z_INDEX = 2;

/** Close tab sits beneath the drawer panel. */
export const CART_DRAWER_CLOSE_TAB_Z_INDEX = 1;

/** Panel slide animation duration (ms) — sync with `duration-300`. */
export const CART_DRAWER_PANEL_TRANSITION_MS = 300;

/** Backdrop fade duration (ms) — sync with `duration-200`. */
export const CART_DRAWER_BACKDROP_TRANSITION_MS = 200;

/** Checkout CTA pill height (px). */
export const CART_DRAWER_CHECKOUT_BUTTON_HEIGHT_PX = 50;

/** Line item thumbnail — tall enough to align with color/size row. */
export const CART_DRAWER_ITEM_THUMB_SIZE_PX = 96;
export const CART_DRAWER_ITEM_THUMB_RADIUS_PX = 16;
