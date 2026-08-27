/** Legal hub / policy document layout tokens — match site brand chrome. */

/** Match Grill.am legal sheet — ~40% of desktop viewport. */
export const LEGAL_POLICY_SHEET_DESKTOP_WIDTH_PERCENT = 40;

/** Soft mobile surface used on contact / home / legal. */
export const LEGAL_POLICY_PAGE_BG_CLASS =
  'mobile-legal-page flex min-h-full flex-1 flex-col max-lg:bg-[#f1f1f3] lg:bg-white';

export const LEGAL_POLICY_HUB_PAGE_CLASS = LEGAL_POLICY_PAGE_BG_CLASS;

export const LEGAL_POLICY_HUB_TITLE_CLASS =
  'w-full max-w-full px-1 text-left text-2xl font-bold leading-tight break-words text-brand-pink sm:text-3xl md:text-4xl';

export const LEGAL_POLICY_HUB_LIST_CLASS = 'mt-8 flex w-full flex-col gap-3';

export const LEGAL_POLICY_HUB_ROW_CLASS =
  'flex w-full items-center justify-between gap-3 rounded-[15px] bg-white px-4 py-4 text-left text-base font-semibold text-brand-brown shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-gray-100/80 transition hover:bg-white/80';

/** Standalone /privacy, /terms, etc. reading column. */
export const LEGAL_POLICY_DOCUMENT_SHELL_CLASS = `${LEGAL_POLICY_PAGE_BG_CLASS}`;

export const LEGAL_POLICY_DOCUMENT_INNER_CLASS =
  'mx-auto w-full max-w-3xl px-4 pb-10 pt-12 sm:px-6 md:max-w-4xl md:pt-16 lg:px-8';

export const LEGAL_POLICY_DOCUMENT_TITLE_CLASS =
  'text-2xl font-bold leading-tight text-brand-pink sm:text-3xl md:text-4xl';

export const LEGAL_POLICY_DOCUMENT_META_CLASS =
  'mt-2 text-sm leading-relaxed text-brand-muted';

export const LEGAL_POLICY_DOCUMENT_BODY_WRAP_CLASS = 'mt-8';

export const LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS =
  'text-lg font-bold text-brand-pink';

export const LEGAL_POLICY_SHEET_BODY_CLASS =
  'text-base leading-relaxed text-brand-muted';

export const LEGAL_POLICY_SHEET_LIST_CLASS =
  'list-disc list-inside space-y-1 text-base leading-relaxed text-brand-muted';

export const LEGAL_POLICY_SHEET_ORDERED_LIST_CLASS =
  'list-decimal list-inside space-y-1 text-base leading-relaxed text-brand-muted';

export const LEGAL_POLICY_SHEET_STACK_CLASS = 'flex flex-col gap-6';

export const LEGAL_POLICY_SHEET_SUBSECTION_TITLE_CLASS =
  'text-base font-semibold text-brand-brown';

export const LEGAL_POLICY_SHEET_LINK_CLASS =
  'font-medium text-brand-pink underline-offset-2 hover:underline';
