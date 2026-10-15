import { db } from '@white-shop/db';
import { revalidateTag, unstable_cache } from 'next/cache';
import { logger } from '@/lib/utils/logger';

/** Settings key — when false, storefront hides `/stores` and its nav links. */
export const STORES_PAGE_ENABLED_SETTING_KEY = 'storesPageEnabled';

const STORES_PAGE_ENABLED_CACHE_TAG = 'settings:stores-page-enabled';
const STORES_PAGE_ENABLED_REVALIDATE_SECONDS = 60;

/** Default on so existing shops keep the partners page visible. */
export const STORES_PAGE_ENABLED_DEFAULT = true;

function parseStoresPageEnabled(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true' || value === 1 || value === '1') {
    return true;
  }
  if (value === 'false' || value === 0 || value === '0') {
    return false;
  }
  return STORES_PAGE_ENABLED_DEFAULT;
}

async function loadStoresPageEnabled(): Promise<boolean> {
  const row = await db.settings.findUnique({
    where: { key: STORES_PAGE_ENABLED_SETTING_KEY },
    select: { value: true },
  });

  if (!row) {
    return STORES_PAGE_ENABLED_DEFAULT;
  }

  return parseStoresPageEnabled(row.value);
}

const getStoresPageEnabledCached = unstable_cache(
  loadStoresPageEnabled,
  ['settings-stores-page-enabled-v1'],
  { revalidate: STORES_PAGE_ENABLED_REVALIDATE_SECONDS, tags: [STORES_PAGE_ENABLED_CACHE_TAG] },
);

/**
 * Cached storefront read — used by root layout and `/stores` page.
 * Must stay request-agnostic (no `noStore`/cookies) so storefront pages can be ISR.
 * Errors fall back to the default without being cached, so a DB blip never breaks the layout.
 */
export async function getStoresPageEnabled(): Promise<boolean> {
  try {
    return await getStoresPageEnabledCached();
  } catch (error: unknown) {
    logger.error('Failed to read storesPageEnabled setting', { error });
    return STORES_PAGE_ENABLED_DEFAULT;
  }
}

export function invalidateStoresPageEnabledCache(): void {
  revalidateTag(STORES_PAGE_ENABLED_CACHE_TAG, { expire: 0 });
}
