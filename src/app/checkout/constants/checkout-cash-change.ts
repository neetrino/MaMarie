/** Cash-on-delivery change (ՄԱՆՐ) — matches Grill.am checkout layout. */

export const CASH_CHANGE_NONE = 'none' as const;

export const CASH_CHANGE_DENOMINATIONS_AMD = [
  2000, 5000, 10000, 20000, 50000, 100000,
] as const;

export type CashChangeDenominationAmd = (typeof CASH_CHANGE_DENOMINATIONS_AMD)[number];

export type CashChangeFor =
  | typeof CASH_CHANGE_NONE
  | `${CashChangeDenominationAmd}`;

export const CASH_CHANGE_FOR_VALUES: readonly CashChangeFor[] = [
  CASH_CHANGE_NONE,
  ...CASH_CHANGE_DENOMINATIONS_AMD.map(String) as CashChangeFor[],
];

export const DEFAULT_CASH_CHANGE_FOR: CashChangeFor = CASH_CHANGE_NONE;

/** Banknote image paths (real AMD notes, WebP). */
export const CASH_CHANGE_BANKNOTE_SRC: Record<CashChangeDenominationAmd, string> = {
  2000: '/assets/payments/amd/2000.webp',
  5000: '/assets/payments/amd/5000.webp',
  10000: '/assets/payments/amd/10000.webp',
  20000: '/assets/payments/amd/20000.webp',
  50000: '/assets/payments/amd/50000.webp',
  100000: '/assets/payments/amd/100000.webp',
};

export const CHECKOUT_CASH_CHANGE_SECTION_CLASS =
  'rounded-[18px] border border-gray-200 bg-white p-4 sm:p-5';

export const CHECKOUT_CASH_CHANGE_TITLE_CLASS =
  'text-base font-bold tracking-wide text-gray-900';

export const CHECKOUT_CASH_CHANGE_HINT_CLASS = 'mt-2 text-sm leading-snug text-gray-600';

/** Shown after a banknote is selected — change the courier must prepare. */
export const CHECKOUT_CASH_CHANGE_RETURN_CLASS =
  'mt-3 text-sm font-medium leading-snug text-gray-800';

export const CHECKOUT_CASH_CHANGE_NO_ELIGIBLE_CLASS = 'mt-4 text-sm text-gray-600';

/** Mobile: 2 columns; sm+: 3 columns (notes scale to cell width). */
export const CHECKOUT_CASH_CHANGE_GRID_CLASS =
  'mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3';

export const CHECKOUT_CASH_CHANGE_OPTION_BASE_CLASS =
  'flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border-2 outline-none transition-all [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-50';

export const CHECKOUT_CASH_CHANGE_OPTION_SELECTED_CLASS =
  'border-brand-pink bg-brand-pink/10';

export const CHECKOUT_CASH_CHANGE_OPTION_DEFAULT_CLASS =
  'border-gray-200 bg-white hover:border-gray-300';

/** “No change” — same cell aspect as notes. */
export const CHECKOUT_CASH_CHANGE_NONE_CLASS =
  'aspect-[2/1] px-2 text-center text-xs font-semibold leading-snug text-gray-900 sm:text-sm';

/** Note button — fixed aspect so image can cover edge-to-edge. */
export const CHECKOUT_CASH_CHANGE_NOTE_BUTTON_CLASS = 'relative aspect-[2/1] p-0';

export const CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS =
  'object-cover object-center';
