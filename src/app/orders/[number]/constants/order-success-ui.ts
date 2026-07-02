/**
 * Storefront order confirmation / success (receipt panel).
 */

/** Wrapper around receipt clip panel (shadow follows zigzag). */
export const ORDER_SUCCESS_RECEIPT_OUTER_CLASS =
  'mb-10 w-full [filter:drop-shadow(0_2px_10px_rgba(15,23,42,0.07))]';

/** Inner receipt body: rounded top only; bottom edge comes from clip-path. */
export const ORDER_SUCCESS_RECEIPT_INNER_CLASS =
  'rounded-t-2xl border border-b-0 border-gray-200 bg-white px-6 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8';
