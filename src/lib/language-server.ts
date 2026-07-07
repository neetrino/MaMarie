import { cookies } from 'next/headers';
import { cache } from 'react';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  SHOP_LANGUAGE_COOKIE,
  type LanguageCode,
} from './language';

/** Reads storefront language from the SSR cookie (when set). */
export function readLanguageFromCookieValue(raw: string | undefined): LanguageCode {
  if (raw && raw in LANGUAGES) {
    return raw as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

/** Per-request storefront language for SSR — aligned with the client cookie when present. */
export const getServerLanguage = cache(async (): Promise<LanguageCode> => {
  const cookieStore = await cookies();
  return readLanguageFromCookieValue(cookieStore.get(SHOP_LANGUAGE_COOKIE)?.value);
});
