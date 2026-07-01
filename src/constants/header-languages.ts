import { DEFAULT_LANGUAGE, type LanguageCode } from '../lib/language';

export const HEADER_LANGUAGES: ReadonlyArray<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'AM' },
  { code: 'ru', label: 'RU' },
];

/** Segmented switcher slide — matches currency / mobile dropdown timing. */
export const HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS = 300;
export const HEADER_LANGUAGE_SWITCHER_HEIGHT_PX = 41;
/** Fixed track width — keeps EN / AM / RU fully visible on mobile dropdown. */
export const HEADER_LANGUAGE_SWITCHER_WIDTH_PX = 168;

/** AM tab index — used when stored language is not shown in the header switcher. */
const ARMENIAN_TAB_INDEX = HEADER_LANGUAGES.findIndex(({ code }) => code === DEFAULT_LANGUAGE);

export function resolveHeaderLanguageTabIndex(lang: LanguageCode): number {
  const index = HEADER_LANGUAGES.findIndex(({ code }) => code === lang);
  return index >= 0 ? index : ARMENIAN_TAB_INDEX;
}
