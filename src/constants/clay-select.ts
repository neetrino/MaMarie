/** Shared clay dropdown — same as checkout city picker. */
export const CLAY_SELECT_FORM_INPUT_CLASS = '!rounded-[15px]';

export const CLAY_SELECT_BORDER_CLASS = 'border-gray-300';
export const CLAY_SELECT_BORDER_OPEN_CLASS = 'border-[#71b5f5]';

export const CLAY_SELECT_DROPDOWN_ANIMATION_MS = 150;
export const CLAY_SELECT_DROPDOWN_GAP_PX = 6;
export const CLAY_SELECT_TRIGGER_MIN_HEIGHT_PX = 42;
export const CLAY_SELECT_CHEVRON_SIZE_PX = 16;

/** Show this many options; remainder scrolls. */
export const CLAY_SELECT_VISIBLE_OPTIONS = 5;
/** Matches `py-3` + `text-sm` line-height on option buttons. */
export const CLAY_SELECT_OPTION_PADDING_Y_PX = 12;
export const CLAY_SELECT_OPTION_LINE_HEIGHT_PX = 20;
export const CLAY_SELECT_DROPDOWN_MAX_HEIGHT_PX =
  CLAY_SELECT_VISIBLE_OPTIONS *
  (CLAY_SELECT_OPTION_PADDING_Y_PX * 2 + CLAY_SELECT_OPTION_LINE_HEIGHT_PX);

export const CLAY_SELECT_DROPDOWN_PANEL_CLASS =
  'absolute left-0 z-50 w-full origin-top overflow-y-auto overflow-x-hidden border border-[#f0f0f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all ease-out';

/** Fixed portal menu — above admin table overflow clips and side sheets. */
export const CLAY_SELECT_PORTAL_Z_INDEX = 110;

export const CLAY_SELECT_PORTAL_DROPDOWN_PANEL_CLASS =
  'fixed origin-top overflow-y-auto overflow-x-hidden border border-[#f0f0f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all ease-out';

export const CLAY_SELECT_OPTION_CLASS =
  'w-full px-5 py-3 text-left text-sm leading-5 transition-colors text-gray-800 hover:bg-gray-50';

export const CLAY_SELECT_OPTION_SELECTED_CLASS = 'bg-gray-50 font-medium text-gray-900';

export const CLAY_SELECT_TRIGGER_BASE_CLASS = `flex w-full items-center justify-between gap-3 border bg-white px-4 py-2 text-left transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 ${CLAY_SELECT_FORM_INPUT_CLASS}`;

/** Tailwind needs a literal; keep in sync with `CLAY_SELECT_DROPDOWN_MAX_HEIGHT_PX`. */
export const CLAY_SELECT_MULTI_PANEL_CLASS = `${CLAY_SELECT_DROPDOWN_PANEL_CLASS} ${CLAY_SELECT_FORM_INPUT_CLASS} max-h-[220px]`;

export function getClaySelectTriggerClass(isOpen: boolean, extra = ''): string {
  const borderClass = isOpen ? CLAY_SELECT_BORDER_OPEN_CLASS : CLAY_SELECT_BORDER_CLASS;
  return `${CLAY_SELECT_TRIGGER_BASE_CLASS} ${borderClass} ${extra}`.trim();
}
