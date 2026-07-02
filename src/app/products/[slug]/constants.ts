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
  'relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0';

export const PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS =
  'border-gray-200 hover:border-gray-300';

export const PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS = 'border-[#5281e1]';

/** Scrollable thumbnail column — ~{THUMBNAILS_PER_VIEW} frames tall. */
export const PRODUCT_PDP_THUMBNAIL_LIST_CLASS =
  'flex flex-col gap-4 max-h-[29.5rem] overflow-y-auto overscroll-contain';

/** Main image prev/next — round pills (48px), visible on gallery hover. */
export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS =
  'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/80 text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-opacity duration-300 hover:bg-white/90 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS = 'left-4';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS = 'right-4';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS = 'h-5 w-5 shrink-0';
