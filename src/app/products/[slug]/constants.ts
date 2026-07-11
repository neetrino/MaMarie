import { PRODUCTS_CATALOG_FILTER_ACCENT } from '../../../constants/products-catalog';

// Reserved routes that should not be treated as product slugs
export const RESERVED_ROUTES = [
  'admin', 'login', 'register', 'cart', 'checkout', 'profile', 
  'orders', 'wishlist', 'compare', 'categories', 'products', 
  'about', 'contact', 'delivery', 'shipping', 'returns',
  'faq', 'support', 'stores', 'privacy', 'terms'
];

export const WISHLIST_KEY = 'shop_wishlist';
export const COMPARE_KEY = 'shop_compare';
export const THUMBNAILS_PER_VIEW = 3;

/** PDP gallery vertical thumbnail frame — brand blue. */
export const PRODUCT_PDP_THUMBNAIL_BORDER_COLOR = PRODUCTS_CATALOG_FILTER_ACCENT;

export const PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS =
  'relative aspect-[3/4] shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300';

export const PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS =
  'border-gray-200 hover:border-gray-300';

export const PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS = 'border-[#5281e1]';

/** Mobile PDP — main image centered, thumbnails in a row below. */
export const PRODUCT_PDP_GALLERY_LAYOUT_CLASS =
  'flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6';

export const PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS = 'order-1 w-full lg:order-2 lg:flex-1';

export const PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS =
  'relative mx-auto aspect-square w-full max-w-[min(100%,28rem)] overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] group lg:mx-0 lg:max-w-none';

export const PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS =
  'order-2 w-full lg:order-1 lg:w-28 lg:flex-shrink-0';

export const PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS =
  'flex w-full flex-row justify-start gap-3 overflow-x-auto overscroll-contain py-1 lg:flex-col lg:justify-start lg:gap-4 lg:max-h-[29.5rem] lg:overflow-y-auto lg:overflow-x-visible lg:py-0';

export const PRODUCT_PDP_THUMBNAIL_FRAME_SIZE_CLASS = 'w-[4.5rem] lg:w-full';

/** Main image prev/next — round pills (48px), visible on gallery hover. */
export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS =
  'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/80 text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-opacity duration-300 hover:bg-white/90 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS = 'left-4';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS = 'right-4';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS = 'h-5 w-5 shrink-0';

/** Mobile PDP — compact quantity stepper (- 1 +). */
export const PRODUCT_PDP_QUANTITY_STEPPER_CLASS =
  'flex items-center overflow-hidden rounded-full border bg-gray-50 min-[744px]:h-12';

export const PRODUCT_PDP_QUANTITY_STEPPER_BUTTON_CLASS =
  'flex h-9 w-9 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 min-[744px]:h-12 min-[744px]:w-12';

export const PRODUCT_PDP_QUANTITY_STEPPER_VALUE_CLASS =
  'w-8 text-center text-sm font-bold min-[744px]:w-12 min-[744px]:text-base';

/** Below-the-fold related row — reserve space before lazy mount. */
export const PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX = 420;

/** Reviews block skeleton height before lazy mount. */
export const PRODUCT_PDP_REVIEWS_PLACEHOLDER_MIN_HEIGHT_PX = 280;
