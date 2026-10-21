/**
 * LocalStorage key for guest cart
 */
export const CART_KEY = 'shop_cart_guest';

/**
 * Legacy key that used to store full cart lines.
 * Product lines are no longer cached; the key is only removed.
 */
export const CART_SNAPSHOT_KEY = 'shop_cart_snapshot';

/** Badge counts for a logged-in cart. Never stores product lines. */
export const CART_SUMMARY_KEY = 'shop_cart_summary';

/** Last confirmed logged-in cart, used only to paint the drawer before refresh. */
export const CART_DISPLAY_KEY = 'shop_cart_display';

/** City used to estimate delivery on the cart page (before checkout address). */
export const CART_DELIVERY_ESTIMATE_CITY = 'Yerevan';


