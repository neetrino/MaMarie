declare global {
  // eslint-disable-next-line no-var
  var __inflightDedup: Map<string, Promise<unknown>> | undefined;
}

const globalDedup = globalThis as typeof globalThis & {
  __inflightDedup?: Map<string, Promise<unknown>>;
};

function getInflightMap(): Map<string, Promise<unknown>> {
  if (!globalDedup.__inflightDedup) {
    globalDedup.__inflightDedup = new Map();
  }
  return globalDedup.__inflightDedup;
}

/**
 * Coalesces concurrent in-flight fetches for the same key into one promise.
 * Uses globalThis so Turbopack route bundles share one dedup map in dev.
 */
export function dedupeInflight<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const inflight = getInflightMap();
  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise;
}
