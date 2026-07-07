import {
  persistAdminQueryEntry,
  readPersistedAdminQueryEntries,
  removePersistedAdminQueryEntry,
  removePersistedAdminQueryPrefix,
} from './admin-query-persist';
import { ADMIN_QUERY_PREFIX } from './admin-query-keys';

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<(data: unknown) => void>>();

let hydratedFromStorage = false;

export interface AdminQueryOptions {
  staleTimeMs?: number;
  force?: boolean;
}

const DEFERRED_REVALIDATION_MS = 4_000;
const DEFERRED_REVALIDATION_PREFIXES = [
  `${ADMIN_QUERY_PREFIX.products}`,
  `${ADMIN_QUERY_PREFIX.orders}`,
  `${ADMIN_QUERY_PREFIX.users}`,
  `${ADMIN_QUERY_PREFIX.messages}`,
] as const;

function shouldDeferBackgroundRevalidation(key: string): boolean {
  return DEFERRED_REVALIDATION_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function scheduleBackgroundRevalidation<T>(key: string, fetcher: () => Promise<T>): void {
  const run = () => {
    void fetchAndStore(key, fetcher).catch(() => {
      /* keep stale data on background failure */
    });
  };

  if (shouldDeferBackgroundRevalidation(key)) {
    setTimeout(run, DEFERRED_REVALIDATION_MS);
    return;
  }

  run();
}

function notifyListeners(key: string, data: unknown): void {
  const keyListeners = listeners.get(key);
  if (!keyListeners) {
    return;
  }
  for (const listener of keyListeners) {
    listener(data);
  }
}

function writeCacheEntry<T>(key: string, data: T): void {
  const fetchedAt = Date.now();
  cache.set(key, { data, fetchedAt });
  persistAdminQueryEntry(key, data, fetchedAt);
  notifyListeners(key, data);
}

async function fetchAndStore<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      writeCacheEntry(key, data);
      return data;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

/**
 * Hydrate in-memory cache from sessionStorage (once per tab).
 */
export function hydrateAdminQueryCacheFromStorage(): void {
  if (hydratedFromStorage || typeof window === 'undefined') {
    return;
  }
  hydratedFromStorage = true;

  const stored = readPersistedAdminQueryEntries();
  for (const [key, entry] of Object.entries(stored)) {
    if (!cache.has(key) && entry && typeof entry === 'object' && 'data' in entry) {
      cache.set(key, {
        data: entry.data,
        fetchedAt: entry.fetchedAt ?? 0,
      });
    }
  }
}

/**
 * Deduplicated admin read cache with stale-while-revalidate and in-flight coalescing.
 */
export async function fetchAdminQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: AdminQueryOptions = {}
): Promise<T> {
  hydrateAdminQueryCacheFromStorage();

  const staleTimeMs = options.staleTimeMs ?? 60_000;
  const cached = cache.get(key);

  if (!options.force && cached) {
    const isFresh = Date.now() - cached.fetchedAt < staleTimeMs;
    if (isFresh) {
      return cached.data as T;
    }

    if (!inflight.has(key)) {
      scheduleBackgroundRevalidation(key, fetcher);
    }
    return cached.data as T;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  return fetchAndStore(key, fetcher);
}

export function peekAdminQuery<T>(key: string): T | null {
  hydrateAdminQueryCacheFromStorage();
  const entry = cache.get(key);
  return entry ? (entry.data as T) : null;
}

/** True when cached data exists and is within the stale window. */
export function isAdminQueryFresh(key: string, staleTimeMs: number): boolean {
  hydrateAdminQueryCacheFromStorage();
  const entry = cache.get(key);
  if (!entry) {
    return false;
  }
  return Date.now() - entry.fetchedAt < staleTimeMs;
}

export function subscribeAdminQuery<T>(
  key: string,
  listener: (data: T) => void
): () => void {
  hydrateAdminQueryCacheFromStorage();

  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  const keyListeners = listeners.get(key)!;
  keyListeners.add(listener as (data: unknown) => void);

  return () => {
    keyListeners.delete(listener as (data: unknown) => void);
    if (keyListeners.size === 0) {
      listeners.delete(key);
    }
  };
}

export function invalidateAdminQuery(key: string): void {
  cache.delete(key);
  inflight.delete(key);
  removePersistedAdminQueryEntry(key);
}

export function invalidateAdminQueryPrefix(prefix: string): void {
  for (const cacheKey of cache.keys()) {
    if (cacheKey.startsWith(prefix)) {
      cache.delete(cacheKey);
    }
  }
  for (const cacheKey of inflight.keys()) {
    if (cacheKey.startsWith(prefix)) {
      inflight.delete(cacheKey);
    }
  }
  removePersistedAdminQueryPrefix(prefix);
}

/** Fire-and-forget prefetch (same SWR semantics as fetchAdminQuery). */
export function prefetchAdminQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: AdminQueryOptions = {}
): void {
  void fetchAdminQuery(key, fetcher, options).catch(() => {
    /* prefetch failures are non-blocking */
  });
}
