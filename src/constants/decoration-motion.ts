/** Idle float / sway for clay decorations across the site (CSS keyframes). */
export type DecorationMotion =
  | 'float'
  | 'floatSoft'
  | 'bounce'
  | 'sway'
  | 'archDrift'
  | 'archDriftAlt';

/** Duration / phase offset — staggered so icons don’t move in sync. */
export const DECORATION_MOTION_TIMING = {
  float: { durationMs: 5200, delayMs: 0 },
  floatSoft: { durationMs: 6800, delayMs: 900 },
  bounce: { durationMs: 4200, delayMs: 350 },
  sway: { durationMs: 5800, delayMs: 1200 },
  /** Slow breath for large inscription arches. */
  archDrift: { durationMs: 7800, delayMs: 200 },
  archDriftAlt: { durationMs: 8200, delayMs: 1800 },
} as const satisfies Record<DecorationMotion, { durationMs: number; delayMs: number }>;

/** Cycle for lists of decorations (About Us, Why Us, footer, …). */
export const DECORATION_MOTION_CYCLE: readonly DecorationMotion[] = [
  'float',
  'bounce',
  'sway',
  'floatSoft',
] as const;

export function decorationMotionAt(index: number): DecorationMotion {
  return DECORATION_MOTION_CYCLE[index % DECORATION_MOTION_CYCLE.length]!;
}
