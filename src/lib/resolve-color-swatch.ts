const COLOR_NAME_TO_HEX: Record<string, string> = {
  white: '#ffffff',
  black: '#111827',
  beige: '#f5f5dc',
  cream: '#fff7d6',
  ivory: '#fffff0',
  gray: '#9ca3af',
  grey: '#9ca3af',
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  pink: '#ec4899',
  brown: '#92400e',
  yellow: '#facc15',
  orange: '#f97316',
  purple: '#a855f7',
  navy: '#1e3a8a',
  'белый': '#ffffff',
  'черный': '#111827',
  'чёрный': '#111827',
  'бежевый': '#f5f5dc',
  'серый': '#9ca3af',
  'синий': '#3b82f6',
  'красный': '#ef4444',
  'зеленый': '#22c55e',
  'зелёный': '#22c55e',
  'розовый': '#ec4899',
  'коричневый': '#92400e',
  'желтый': '#facc15',
  'жёлтый': '#facc15',
  'оранжевый': '#f97316',
  'фиолетовый': '#a855f7',
  'սպիտակ': '#ffffff',
  'սև': '#111827',
  'սեւ': '#111827',
  'բեժ': '#f5f5dc',
  'մոխրագույն': '#9ca3af',
  'կապույտ': '#3b82f6',
  'կարմիր': '#ef4444',
  'կանաչ': '#22c55e',
  'վարդագույն': '#ec4899',
  'շագանակագույն': '#92400e',
  'դեղին': '#facc15',
  'նարնջագույն': '#f97316',
  'մանուշակագույն': '#a855f7',
};

const FALLBACK_SWATCH_HEX = '#cbd5e1';

/** Resolves a color name or CSS color string to a swatch hex/CSS value. */
export function resolveColorSwatch(color: string | null | undefined): string {
  if (!color) {
    return FALLBACK_SWATCH_HEX;
  }

  const value = color.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) || /^(rgb|hsl)a?\(/i.test(value)) {
    return color;
  }

  return COLOR_NAME_TO_HEX[value] ?? FALLBACK_SWATCH_HEX;
}
