import { CHECKOUT_PRIMARY_BUTTON_HEIGHT_PX } from '../../../constants/checkout-page';

/** Text inputs, option cards, alerts — 15px (`CHECKOUT_FORM_RADIUS_PX`). */
export const CHECKOUT_FORM_INPUT_CLASS = '!rounded-[15px]';
export const CHECKOUT_FORM_OPTION_RADIUS_CLASS = 'rounded-[15px]';
export const CHECKOUT_FORM_ALERT_CLASS = 'rounded-[15px]';

/** White section card — profile / order page pattern. */
export const CHECKOUT_SECTION_CARD_CLASS =
  'rounded-3xl bg-white px-5 py-6 shadow-sm ring-1 ring-gray-200/80 sm:px-6 sm:py-7';

export const CHECKOUT_SECTION_TITLE_CLASS = 'text-lg font-bold tracking-tight text-gray-900';

export const CHECKOUT_PAGE_TITLE_CLASS = 'text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl';

export const CHECKOUT_OPTION_BASE_CLASS = `flex cursor-pointer items-center border-2 p-4 outline-none transition-all [-webkit-tap-highlight-color:transparent] focus-within:outline-none focus-within:ring-0 ${CHECKOUT_FORM_OPTION_RADIUS_CLASS}`;

export const CHECKOUT_OPTION_SELECTED_CLASS = 'border-brand-pink bg-brand-pink/10';
export const CHECKOUT_OPTION_DEFAULT_CLASS = 'border-gray-200 hover:bg-gray-50/80';

export const CHECKOUT_PRIMARY_BUTTON_CLASS =
  'inline-flex w-full items-center justify-center rounded-full bg-brand-pink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-50';

export const CHECKOUT_PRIMARY_BUTTON_STYLE = {
  minHeight: CHECKOUT_PRIMARY_BUTTON_HEIGHT_PX,
} as const;

export const CHECKOUT_SECONDARY_BUTTON_CLASS =
  'inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 disabled:cursor-not-allowed disabled:opacity-50';

/** Order summary — full width on mobile; narrow column on desktop. */
export const CHECKOUT_ORDER_SUMMARY_WRAP_CLASS =
  'w-full lg:ml-auto lg:mr-0 lg:max-w-[300px]';

/** Order items preview — top of checkout (Figma). */
export const CHECKOUT_ORDER_ITEMS_PREVIEW_CARD_CLASS =
  'rounded-[15px] border border-gray-200 bg-white px-5 py-4 sm:px-6 sm:py-5';

export const CHECKOUT_ORDER_ITEMS_PREVIEW_TITLE_CLASS =
  'text-sm font-bold uppercase tracking-wide text-gray-900';

export const CHECKOUT_ORDER_ITEMS_PREVIEW_COUNT_CLASS = 'shrink-0 text-sm text-gray-500';

export const CHECKOUT_ORDER_ITEMS_PREVIEW_LIST_CLASS =
  'flex gap-6 overflow-x-auto overscroll-x-contain pt-4';

export const CHECKOUT_ORDER_ITEMS_THUMB_FRAME_CLASS =
  'relative overflow-hidden rounded-xl border border-gray-200 bg-white';

export const CHECKOUT_ORDER_ITEMS_REMOVE_BUTTON_CLASS =
  'absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800';

export const CHECKOUT_ORDER_ITEMS_NAME_CLASS =
  'mt-2 max-w-[6.5rem] text-center text-xs font-bold uppercase leading-snug text-gray-900';

export const CHECKOUT_ORDER_ITEMS_PREVIEW_MARGIN_CLASS = 'mb-6';

/** Custom select — re-exported from shared clay select (checkout city picker). */
export {
  CLAY_SELECT_BORDER_CLASS as CHECKOUT_SELECT_BORDER_CLASS,
  CLAY_SELECT_BORDER_OPEN_CLASS as CHECKOUT_SELECT_BORDER_OPEN_CLASS,
  CLAY_SELECT_CHEVRON_SIZE_PX as CHECKOUT_SELECT_CHEVRON_SIZE_PX,
  CLAY_SELECT_DROPDOWN_ANIMATION_MS as CHECKOUT_SELECT_DROPDOWN_ANIMATION_MS,
  CLAY_SELECT_DROPDOWN_GAP_PX as CHECKOUT_SELECT_DROPDOWN_GAP_PX,
  CLAY_SELECT_TRIGGER_MIN_HEIGHT_PX as CHECKOUT_SELECT_TRIGGER_MIN_HEIGHT_PX,
} from '../../../constants/clay-select';
