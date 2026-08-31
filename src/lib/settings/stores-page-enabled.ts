import { db } from '@white-shop/db';
import { unstable_noStore as noStore } from 'next/cache';
import {
  invalidateServerReadCache,
  withServerReadCache,
} from '@/lib/cache/server-read-cache';

/** Settings key — when false, storefront hides `/stores` and its nav links. */
export const STORES_PAGE_ENABLED_SETTING_KEY = 'storesPageEnabled';

const STORES_PAGE_ENABLED_CACHE_KEY = 'settings:stores-page-enabled';
const STORES_PAGE_ENABLED_CACHE_TTL_MS = 60_000;

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

/** Cached storefront read — used by layout and `/stores` page. */
export async function getStoresPageEnabled(): Promise<boolean> {
  noStore();
  return withServerReadCache(
    STORES_PAGE_ENABLED_CACHE_KEY,
    STORES_PAGE_ENABLED_CACHE_TTL_MS,
    async () => {
      const row = await db.settings.findUnique({
        where: { key: STORES_PAGE_ENABLED_SETTING_KEY },
        select: { value: true },
      });

      if (!row) {
        return STORES_PAGE_ENABLED_DEFAULT;
      }

      return parseStoresPageEnabled(row.value);
    },
  );
}

export function invalidateStoresPageEnabledCache(): void {
  invalidateServerReadCache(STORES_PAGE_ENABLED_CACHE_KEY);
}
