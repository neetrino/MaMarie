import type { CSSProperties } from 'react';
import {
  HERO_GENDER_BUTTON_FONT_SIZE_PX,
  HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
  HERO_GENDER_BUTTON_HEIGHT_PX,
  HERO_GENDER_BUTTON_HOVER_LIFT_PX,
  HERO_GENDER_BUTTON_HOVER_TRANSITION_MS,
  HERO_GENDER_BUTTON_INSET_SHADOW,
  HERO_GENDER_BUTTON_LINE_HEIGHT_PX,
  HERO_GENDER_BUTTON_PADDING_X_PX,
} from './hero';

/** Shared clay CTA — home hero girls button (`51:338`). */
const CLAY_BUTTON_MOTION_CLASS =
  'relative inline-flex items-center justify-center rounded-full font-bold transition-transform ease-out hover:-translate-y-[var(--clay-btn-lift)] focus-visible:-translate-y-[var(--clay-btn-lift)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0';

export const CLAY_PRIMARY_BUTTON_CLASS = `${CLAY_BUTTON_MOTION_CLASS} border-0 text-white focus-visible:outline-brand-pink`;

export const CLAY_SECONDARY_BUTTON_CLASS = `${CLAY_BUTTON_MOTION_CLASS} border border-gray-200 text-gray-900 focus-visible:outline-gray-400`;

export const CLAY_DANGER_BUTTON_CLASS = `${CLAY_BUTTON_MOTION_CLASS} border-0 text-white focus-visible:outline-red-700`;

export function getClayPrimaryButtonStyle(
  backgroundColor: string = HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
): CSSProperties {
  return {
    height: HERO_GENDER_BUTTON_HEIGHT_PX,
    paddingLeft: HERO_GENDER_BUTTON_PADDING_X_PX,
    paddingRight: HERO_GENDER_BUTTON_PADDING_X_PX,
    backgroundColor,
    fontSize: HERO_GENDER_BUTTON_FONT_SIZE_PX,
    lineHeight: `${HERO_GENDER_BUTTON_LINE_HEIGHT_PX}px`,
    boxShadow: HERO_GENDER_BUTTON_INSET_SHADOW,
    transitionDuration: `${HERO_GENDER_BUTTON_HOVER_TRANSITION_MS}ms`,
    ['--clay-btn-lift' as string]: `${HERO_GENDER_BUTTON_HOVER_LIFT_PX}px`,
  };
}

/** Compact clay CTA — profile forms (same look, smaller footprint). */
export const CLAY_PRIMARY_BUTTON_COMPACT_HEIGHT_PX = 44;
export const CLAY_PRIMARY_BUTTON_COMPACT_PADDING_X_PX = 24;
export const CLAY_PRIMARY_BUTTON_COMPACT_FONT_SIZE_PX = 14;
export const CLAY_PRIMARY_BUTTON_COMPACT_LINE_HEIGHT_PX = 20;
export const CLAY_PRIMARY_BUTTON_COMPACT_HOVER_LIFT_PX = 2;

export const CLAY_SECONDARY_BUTTON_BG = '#ffffff';
export const CLAY_SECONDARY_BUTTON_INSET_SHADOW =
  'inset 0px -3px 6px 0px rgba(0, 0, 0, 0.1), inset 0px 3px 4px 0px rgba(255, 255, 255, 0.95), inset 0px 14px 28px -10px rgba(0, 0, 0, 0.05)';

export const CLAY_DANGER_BUTTON_BG = '#b91c1c';
export const CLAY_DANGER_BUTTON_INSET_SHADOW =
  'inset 0px -3px 6px 0px rgba(0, 0, 0, 0.22), inset 0px 3px 4px 0px rgba(255, 255, 255, 0.35), inset 0px 14px 28px -10px rgba(127, 29, 29, 0.25)';

function getClayButtonCompactBaseStyle(
  backgroundColor: string,
  boxShadow: string,
): CSSProperties {
  return {
    height: CLAY_PRIMARY_BUTTON_COMPACT_HEIGHT_PX,
    paddingLeft: CLAY_PRIMARY_BUTTON_COMPACT_PADDING_X_PX,
    paddingRight: CLAY_PRIMARY_BUTTON_COMPACT_PADDING_X_PX,
    backgroundColor,
    fontSize: CLAY_PRIMARY_BUTTON_COMPACT_FONT_SIZE_PX,
    lineHeight: `${CLAY_PRIMARY_BUTTON_COMPACT_LINE_HEIGHT_PX}px`,
    boxShadow,
    transitionDuration: `${HERO_GENDER_BUTTON_HOVER_TRANSITION_MS}ms`,
    ['--clay-btn-lift' as string]: `${CLAY_PRIMARY_BUTTON_COMPACT_HOVER_LIFT_PX}px`,
  };
}

export function getClayPrimaryButtonCompactStyle(
  backgroundColor: string = HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
): CSSProperties {
  return getClayButtonCompactBaseStyle(backgroundColor, HERO_GENDER_BUTTON_INSET_SHADOW);
}

export function getClaySecondaryButtonCompactStyle(): CSSProperties {
  return getClayButtonCompactBaseStyle(CLAY_SECONDARY_BUTTON_BG, CLAY_SECONDARY_BUTTON_INSET_SHADOW);
}

export function getClayDangerButtonCompactStyle(): CSSProperties {
  return getClayButtonCompactBaseStyle(CLAY_DANGER_BUTTON_BG, CLAY_DANGER_BUTTON_INSET_SHADOW);
}
