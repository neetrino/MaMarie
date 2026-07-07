interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface ServerReadCacheState {
  store: Map<string, CacheEntry<unknown>>;
  inflight: Map<string, Promise<unknown>>;
}

declare global {
  var __serverReadCache: ServerReadCacheState | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  __serverReadCache?: ServerReadCacheState;
};

function getServerReadCacheState(): ServerReadCacheState {
  if (!globalCache.__serverReadCache) {
    globalCache.__serverReadCache = {
      store: new Map(),
      inflight: new Map(),
    };
  }
  return globalCache.__serverReadCache;
}

/**
 * Short-lived in-process cache for expensive admin read endpoints.
 * Coalesces concurrent misses for the same key into one fetcher call.
 * Uses globalThis so Turbopack route bundles share one cache in dev.
 */
export async function withServerReadCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const { store, inflight } = getServerReadCacheState();
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expiresAt > now) {
    return hit.data as T;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      store.set(key, { data, expiresAt: Date.now() + ttlMs });
      return data;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

export function invalidateServerReadCache(key: string): void {
  const { store, inflight } = getServerReadCacheState();
  store.delete(key);
  inflight.delete(key);
}

export function invalidateServerReadCachePrefix(prefix: string): void {
  const { store, inflight } = getServerReadCacheState();
  for (const cacheKey of store.keys()) {
    if (cacheKey.startsWith(prefix)) {
      store.delete(cacheKey);
    }
  }
  for (const cacheKey of inflight.keys()) {
    if (cacheKey.startsWith(prefix)) {
      inflight.delete(cacheKey);
    }
  }
}
