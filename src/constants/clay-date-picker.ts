import { BRAND_COLORS } from './brand';
import { CLAY_SELECT_PORTAL_Z_INDEX } from './clay-select';

export const CLAY_DATE_PICKER_RADIUS_CLASS = 'rounded-[15px]';
export const CLAY_DATE_PICKER_TRIGGER_CLASS =
  `flex w-full items-center justify-between gap-3 border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ef95aa]/focus:border-[#ef95aa] disabled:cursor-not-allowed disabled:bg-gray-50 ${CLAY_DATE_PICKER_RADIUS_CLASS}`;

export const CLAY_DATE_PICKER_PANEL_CLASS =
  `fixed overflow-hidden border border-[#f0f0f0] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.12)] ${CLAY_DATE_PICKER_RADIUS_CLASS}`;

export const CLAY_DATE_PICKER_DAY_BUTTON_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors';

export const CLAY_DATE_PICKER_DAY_SELECTED_CLASS = 'bg-brand-pink font-semibold text-white';
export const CLAY_DATE_PICKER_DAY_TODAY_CLASS = 'font-semibold text-brand-pink ring-1 ring-[#ef95aa]/60';
export const CLAY_DATE_PICKER_DAY_MUTED_CLASS = 'text-gray-300';
export const CLAY_DATE_PICKER_DAY_DEFAULT_CLASS = 'text-gray-800 hover:bg-[#fdeef2]';

export const CLAY_DATE_PICKER_TIME_OPTION_CLASS =
  'flex h-8 w-full items-center justify-center rounded-[10px] text-sm transition-colors';

export const CLAY_DATE_PICKER_TIME_SELECTED_CLASS = 'bg-brand-pink font-semibold text-white';
export const CLAY_DATE_PICKER_TIME_DEFAULT_CLASS = 'text-gray-700 hover:bg-[#fdeef2]';

export const CLAY_DATE_PICKER_PORTAL_Z_INDEX = CLAY_SELECT_PORTAL_Z_INDEX;
export const CLAY_DATE_PICKER_PANEL_GAP_PX = 6;
export const CLAY_DATE_PICKER_VIEWPORT_EDGE_PX = 8;
export const CLAY_DATE_PICKER_DATE_PANEL_MIN_WIDTH_PX = 308;
export const CLAY_DATE_PICKER_DATETIME_PANEL_MIN_WIDTH_PX = 420;
export const CLAY_DATE_PICKER_TIME_COLUMN_HEIGHT_PX = 220;
/** Approximate panel heights for flip-above placement. */
export const CLAY_DATE_PICKER_DATE_PANEL_ESTIMATED_HEIGHT_PX = 360;
export const CLAY_DATE_PICKER_DATETIME_PANEL_ESTIMATED_HEIGHT_PX = 360;

export const CLAY_DATE_PICKER_ACCENT = BRAND_COLORS.pink;
