import { useEffect } from 'react';
import { peekAdminQuery, subscribeAdminQuery } from '@/lib/admin/admin-query-cache';

/**
 * Show cached list data immediately; only set loading when cache is empty.
 */
export function hydrateAdminListFromCache<T>(
  cacheKey: string,
  force: boolean,
  setLoading: (loading: boolean) => void,
  apply: (data: T) => void
): void {
  if (force) {
    setLoading(true);
    return;
  }

  const cached = peekAdminQuery<T>(cacheKey);
  if (cached !== null) {
    apply(cached);
    setLoading(false);
    return;
  }

  setLoading(true);
}

/** Subscribe to silent background revalidation for a list/resource cache key. */
export function useAdminQuerySubscription<T>(
  cacheKey: string,
  enabled: boolean,
  apply: (data: T) => void
): void {
  useEffect(() => {
    if (!enabled || !cacheKey) {
      return;
    }

    return subscribeAdminQuery<T>(cacheKey, apply);
  }, [cacheKey, enabled, apply]);
}
