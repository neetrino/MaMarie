import { CHECKOUT_PRIMARY_BUTTON_HEIGHT_PX } from '../../../constants/checkout-page';
import {
  ORDER_SUCCESS_RECEIPT_OUTER_CLASS,
} from '../../orders/[number]/constants/order-success-ui';

/** Text inputs, option cards, alerts — 15px (`CHECKOUT_FORM_RADIUS_PX`). */
export const CHECKOUT_FORM_INPUT_CLASS = '!rounded-[15px]';
export const CHECKOUT_FORM_OPTION_RADIUS_CLASS = 'rounded-[15px]';
export const CHECKOUT_FORM_ALERT_CLASS = 'rounded-[15px]';

/** Native radio — pink accent, no focus ring. */
export const CHECKOUT_RADIO_INPUT_CLASS =
  'mr-4 shrink-0 accent-brand-pink outline-none [-webkit-tap-highlight-color:transparent] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none';

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

/** Order summary — slightly narrower receipt with tighter horizontal padding. */
export const CHECKOUT_ORDER_SUMMARY_WRAP_CLASS = 'mx-auto w-full lg:ml-auto lg:mr-0';

export const CHECKOUT_RECEIPT_OUTER_CLASS = ORDER_SUCCESS_RECEIPT_OUTER_CLASS;

export const CHECKOUT_RECEIPT_INNER_CLASS =
  'rounded-t-2xl border border-b-0 border-gray-200 bg-white px-5 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8';
