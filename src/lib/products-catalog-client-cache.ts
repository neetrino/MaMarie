const CATALOG_CACHE_STORAGE_PREFIX = 'mamarie:catalog:';
const CATALOG_CACHE_INDEX_KEY = `${CATALOG_CACHE_STORAGE_PREFIX}index`;

export const PRODUCTS_CATALOG_CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;
export const PRODUCTS_CATALOG_CLIENT_CACHE_MAX_ENTRIES = 100;

interface CatalogCacheEntry<T> {
  expiresAt: number;
  value: T;
}

const memoryCache = new Map<string, CatalogCacheEntry<unknown>>();

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readStorageEntry<T>(key: string): CatalogCacheEntry<T> | null {
  if (!isBrowser()) {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(`${CATALOG_CACHE_STORAGE_PREFIX}${key}`);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CatalogCacheEntry<T>;
    if (!parsed || typeof parsed.expiresAt !== 'number') {
      return null;
    }
    if (Date.now() > parsed.expiresAt) {
      window.sessionStorage.removeItem(`${CATALOG_CACHE_STORAGE_PREFIX}${key}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStorageEntry<T>(key: string, entry: CatalogCacheEntry<T>): void {
  if (!isBrowser()) {
    return;
  }
  try {
    window.sessionStorage.setItem(
      `${CATALOG_CACHE_STORAGE_PREFIX}${key}`,
      JSON.stringify(entry)
    );
    touchStorageIndex(key);
    trimStorageIndex();
  } catch {
    // sessionStorage full or unavailable — memory cache still works.
  }
}

function readStorageIndex(): string[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(CATALOG_CACHE_INDEX_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorageIndex(keys: string[]): void {
  if (!isBrowser()) {
    return;
  }
  try {
    window.sessionStorage.setItem(CATALOG_CACHE_INDEX_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

function touchStorageIndex(key: string): void {
  const index = readStorageIndex().filter((entry) => entry !== key);
  index.push(key);
  writeStorageIndex(index);
}

function trimStorageIndex(): void {
  const index = readStorageIndex();
  while (index.length > PRODUCTS_CATALOG_CLIENT_CACHE_MAX_ENTRIES) {
    const oldest = index.shift();
    if (oldest) {
      window.sessionStorage.removeItem(`${CATALOG_CACHE_STORAGE_PREFIX}${oldest}`);
    }
  }
  writeStorageIndex(index);
}

/** Builds a stable cache key from sorted param entries. */
export function buildCatalogClientCacheKey(
  scope: string,
  params: Record<string, string | undefined>
): string {
  const canonical = Object.entries(params)
    .filter(([, value]) => value !== undefined && value.trim() !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value?.trim()}`)
    .join('&');
  return `${scope}:${canonical || 'default'}`;
}

export function readCatalogClientCache<T>(key: string): T | null {
  const now = Date.now();
  const memoryEntry = memoryCache.get(key) as CatalogCacheEntry<T> | undefined;
  if (memoryEntry) {
    if (now > memoryEntry.expiresAt) {
      memoryCache.delete(key);
    } else {
      return memoryEntry.value;
    }
  }

  const storageEntry = readStorageEntry<T>(key);
  if (!storageEntry) {
    return null;
  }

  memoryCache.set(key, storageEntry);
  return storageEntry.value;
}

export function writeCatalogClientCache<T>(
  key: string,
  value: T,
  ttlMs: number = PRODUCTS_CATALOG_CLIENT_CACHE_TTL_MS
): void {
  const entry: CatalogCacheEntry<T> = {
    expiresAt: Date.now() + ttlMs,
    value,
  };
  memoryCache.set(key, entry);
  writeStorageEntry(key, entry);
}

export function hasFreshCatalogClientCache(key: string): boolean {
  return readCatalogClientCache(key) !== null;
}
