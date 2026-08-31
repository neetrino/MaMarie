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

/** Show thumbnail rail + prev/next only when the gallery has at least this many images. */
export const PRODUCT_PDP_THUMBNAIL_MIN_IMAGE_COUNT = 2;

/** PDP gallery vertical thumbnail frame — brand blue. */
export const PRODUCT_PDP_THUMBNAIL_BORDER_COLOR = PRODUCTS_CATALOG_FILTER_ACCENT;

/** Same aspect as main PDP image (`aspect-square`). */
export const PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS =
  'relative aspect-square shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300';

export const PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS =
  'border-gray-200 hover:border-gray-300';

export const PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS = 'border-[#5281e1]';

/** Desktop grid — gallery column width (info column takes the remainder). */
export const PRODUCT_PDP_GRID_CLASS =
  'grid grid-cols-1 gap-12 items-start lg:grid-cols-[48%_52%] lg:items-stretch [&>*]:min-w-0';

/** Product long description — narrow measure for fewer words per line. */
export const PRODUCT_PDP_DESCRIPTION_CLASS =
  'prose prose-sm mb-8 min-w-0 max-w-[36ch] break-words text-gray-600 [overflow-wrap:anywhere] [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere]';

/** Info column — allow grid track to shrink so text wraps. */
export const PRODUCT_PDP_INFO_COLUMN_CLASS =
  'flex h-full min-h-0 min-w-0 max-w-full flex-col';

/** Responsive `sizes` hint for PDP hero images (matches gallery column width). */
export const PRODUCT_PDP_MAIN_IMAGE_SIZES = '(max-width: 1024px) 100vw, 48vw';

/** Mobile PDP — main image centered, thumbnails in a row below. */
export const PRODUCT_PDP_GALLERY_LAYOUT_CLASS =
  'flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6';

export const PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS = 'order-1 w-full lg:order-2 lg:flex-1';

export const PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS =
  'relative mx-auto aspect-square w-full max-w-[min(100%,34rem)] overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] group lg:mx-0 lg:max-w-[min(100%,36rem)]';

/** Mobee-style horizontal snap track for PDP main images. */
export const PRODUCT_PDP_MAIN_IMAGE_CAROUSEL_CLASS =
  'scrollbar-hide absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain';

export const PRODUCT_PDP_MAIN_IMAGE_SLIDE_CLASS =
  'relative h-full w-full shrink-0 snap-center snap-always';

export const PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS =
  'order-2 w-full lg:order-1 lg:w-28 lg:flex-shrink-0';

export const PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS =
  'scrollbar-hide flex w-full flex-row justify-center gap-3 overflow-x-auto overscroll-contain py-1 lg:flex-col lg:justify-start lg:gap-4 lg:max-h-[36rem] lg:overflow-y-auto lg:overflow-x-visible lg:py-0';

export const PRODUCT_PDP_THUMBNAIL_FRAME_SIZE_CLASS = 'w-[4.5rem] lg:w-full';

/** Read-only info attributes (e.g. material) — «Նյութ ' value». */
export const PRODUCT_PDP_INFO_ATTRIBUTE_ROW_CLASS =
  'flex w-fit max-w-[28ch] flex-wrap items-baseline gap-x-1 text-sm';

export const PRODUCT_PDP_INFO_ATTRIBUTE_LABEL_CLASS =
  'shrink-0 text-xs font-bold uppercase text-blue-600';

export const PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR = "'";

export const PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR_CLASS = 'shrink-0 text-gray-400';

export const PRODUCT_PDP_INFO_ATTRIBUTE_VALUE_CLASS = 'text-gray-900';

/** Main image prev/next — desktop hover-reveal only (mobile uses swipe). */
export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS =
  'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/80 text-gray-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-opacity duration-300 hover:bg-white/90 lg:flex lg:group-hover:opacity-100 lg:focus-visible:opacity-100 motion-reduce:transition-none';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS = 'left-1.5';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS = 'right-1.5';

export const PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS = 'h-4 w-4 shrink-0';

/** Below-the-fold related row — reserve space before lazy mount. */
export const PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX = 420;

/** Reviews block skeleton height before lazy mount. */
export const PRODUCT_PDP_REVIEWS_PLACEHOLDER_MIN_HEIGHT_PX = 280;

/** PDP action row — Add to cart / size guide height (`h-12`). */
export const PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX = 48;

/** Mobile PDP — wishlist control overlaid on the main image (Kamancha-style). */
export const PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX = 44;
export const PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX = 12;
export const PRODUCT_PDP_MOBILE_WISHLIST_ICON_SIZE_PX = 22;

/** Pink clay −/+ quantity stepper — slightly under compact CTA. */
export const PRODUCT_QUANTITY_STEPPER_HEIGHT_PX = 44;
/** Mobile: equal width with size guide; desktop keeps compact pill. */
export const PRODUCT_QUANTITY_STEPPER_SHELL_CLASS =
  'min-w-0 flex-1 gap-0 overflow-hidden !px-0 lg:w-auto lg:min-w-[7.5rem] lg:flex-none lg:shrink-0';
export const PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS =
  'flex h-full flex-1 items-center justify-center text-base font-bold text-white lg:flex-none lg:w-10';
export const PRODUCT_QUANTITY_STEPPER_VALUE_CLASS =
  'min-w-[1.75rem] shrink-0 text-center text-base font-bold text-white';

/**
 * Mobile PDP actions:
 * row 1 — qty + size guide (equal width)
 * row 2 — add to cart (full width)
 * Desktop — qty + cart + wishlist in one row.
 */
export const PRODUCT_PDP_ACTIONS_ROW_CLASS =
  'flex flex-col gap-3 lg:flex-row lg:items-center';
export const PRODUCT_PDP_ACTIONS_TOP_ROW_CLASS =
  'flex w-full items-center gap-3 lg:contents';
export const PRODUCT_PDP_SIZE_GUIDE_ACTION_CLASS =
  'min-w-0 flex-1 lg:hidden';
export const PRODUCT_PDP_ADD_TO_CART_BUTTON_CLASS =
  'w-full rounded-full bg-brand-cart font-bold text-gray-900 transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 lg:flex-1';

/**
 * PDP image zoom modal — above header (80), bottom nav (70), cart (90),
 * and clay select portals (110).
 */
export const PRODUCT_PDP_IMAGE_ZOOM_Z_INDEX = 120;

/** Desktop gap between the viewport edge and the zoom modal panel. */
export const PRODUCT_PDP_IMAGE_ZOOM_INSET_PX = 40;

/** Mobile side inset — tighter than desktop. */
export const PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_X_PX = 16;

/** Mobile top/bottom inset — keeps the panel shorter on tall phones. */
export const PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_Y_PX = 120;

/** Desktop / mobile breakpoint for zoom modal layout (matches Tailwind `lg`). */
export const PRODUCT_PDP_IMAGE_ZOOM_DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

/** Inner padding around the image inside the zoom modal. */
export const PRODUCT_PDP_IMAGE_ZOOM_PANEL_PADDING_PX = 8;

export const PRODUCT_PDP_IMAGE_ZOOM_PANEL_RADIUS_CLASS = 'rounded-2xl';

export const PRODUCT_PDP_IMAGE_ZOOM_CLOSE_BUTTON_CLASS =
  'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.28)] transition-colors hover:bg-brand-pink hover:text-white lg:right-4 lg:top-4 lg:h-10 lg:w-10';

export const PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_CLASS =
  'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.28)] transition-colors hover:bg-brand-pink hover:text-white lg:h-12 lg:w-12';

export const PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_LEFT_CLASS = 'left-0.5 lg:left-1.5';
export const PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_RIGHT_CLASS = 'right-0.5 lg:right-1.5';
export const PRODUCT_PDP_IMAGE_ZOOM_NAV_ICON_CLASS = 'h-6 w-6 shrink-0 lg:h-7 lg:w-7';
export const PRODUCT_PDP_IMAGE_ZOOM_CLOSE_ICON_CLASS = 'h-4 w-4 shrink-0 lg:h-5 lg:w-5';

/** Min horizontal travel to count as an image swipe in the zoom modal. */
export const PRODUCT_PDP_IMAGE_ZOOM_SWIPE_MIN_DISTANCE_PX = 48;
