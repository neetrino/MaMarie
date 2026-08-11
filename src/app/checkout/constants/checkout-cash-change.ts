/** Cash-on-delivery change (ՄԱՆՐ) — banknote denominations in AMD. */

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

/** Banknote image paths (stylized AMD notes). */
export const CASH_CHANGE_BANKNOTE_SRC: Record<CashChangeDenominationAmd, string> = {
  2000: '/assets/payments/amd/2000.svg',
  5000: '/assets/payments/amd/5000.svg',
  10000: '/assets/payments/amd/10000.svg',
  20000: '/assets/payments/amd/20000.svg',
  50000: '/assets/payments/amd/50000.svg',
  100000: '/assets/payments/amd/100000.svg',
};

export const CHECKOUT_CASH_CHANGE_SECTION_CLASS =
  'mt-4 rounded-[15px] border border-gray-200 bg-white p-4 sm:p-5';

export const CHECKOUT_CASH_CHANGE_TITLE_CLASS =
  'text-sm font-bold uppercase tracking-wide text-gray-900';

export const CHECKOUT_CASH_CHANGE_HINT_CLASS = 'mt-2 text-sm text-gray-600';

export const CHECKOUT_CASH_CHANGE_GRID_CLASS =
  'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3';

export const CHECKOUT_CASH_CHANGE_OPTION_BASE_CLASS =
  'flex cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border-2 bg-white p-2 outline-none transition-all [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-50';

export const CHECKOUT_CASH_CHANGE_OPTION_SELECTED_CLASS =
  'border-brand-pink bg-brand-pink/10';

export const CHECKOUT_CASH_CHANGE_OPTION_DEFAULT_CLASS =
  'border-gray-200 hover:bg-gray-50/80';

export const CHECKOUT_CASH_CHANGE_NONE_CLASS =
  'min-h-[72px] px-3 text-center text-sm font-semibold text-gray-900';

export const CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS =
  'h-auto w-full max-h-[72px] object-contain';
