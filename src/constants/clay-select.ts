/** Shared clay dropdown — same as checkout city picker. */
export const CLAY_SELECT_FORM_INPUT_CLASS = '!rounded-[15px]';

export const CLAY_SELECT_BORDER_CLASS = 'border-gray-300';
export const CLAY_SELECT_BORDER_OPEN_CLASS = 'border-[#71b5f5]';

export const CLAY_SELECT_DROPDOWN_ANIMATION_MS = 150;
export const CLAY_SELECT_DROPDOWN_GAP_PX = 6;
export const CLAY_SELECT_TRIGGER_MIN_HEIGHT_PX = 42;
export const CLAY_SELECT_CHEVRON_SIZE_PX = 16;

export const CLAY_SELECT_DROPDOWN_PANEL_CLASS =
  'absolute left-0 z-50 w-full origin-top overflow-hidden border border-[#f0f0f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all ease-out';

export const CLAY_SELECT_OPTION_CLASS =
  'w-full px-5 py-3 text-left text-sm transition-colors text-gray-800 hover:bg-gray-50';

export const CLAY_SELECT_OPTION_SELECTED_CLASS = 'bg-gray-50 font-medium text-gray-900';

export const CLAY_SELECT_TRIGGER_BASE_CLASS = `flex w-full items-center justify-between gap-3 border bg-white px-4 py-2 text-left transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 ${CLAY_SELECT_FORM_INPUT_CLASS}`;

export const CLAY_SELECT_MULTI_PANEL_CLASS = `${CLAY_SELECT_DROPDOWN_PANEL_CLASS} ${CLAY_SELECT_FORM_INPUT_CLASS} max-h-60 overflow-y-auto`;

export function getClaySelectTriggerClass(isOpen: boolean, extra = ''): string {
  const borderClass = isOpen ? CLAY_SELECT_BORDER_OPEN_CLASS : CLAY_SELECT_BORDER_CLASS;
  return `${CLAY_SELECT_TRIGGER_BASE_CLASS} ${borderClass} ${extra}`.trim();
}
