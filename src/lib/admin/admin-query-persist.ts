import { buildPersistableAdminListKeys } from '@/lib/admin/admin-list-default-params';

const STORAGE_KEY = 'mamarie:admin-query-cache:v1';

const PERSIST_EXACT_KEYS = new Set([
  'admin:categories',
  'admin:brands',
  'admin:attributes',
  'admin:settings',
  'admin:dashboard:summary',
  'admin:coupons',
  'admin:delivery',
  'admin:settings:price-filter',
  'admin:stats',
]);

const PERSIST_LIST_DEFAULT_KEYS = buildPersistableAdminListKeys();

interface PersistedEntry {
  data: unknown;
  fetchedAt: number;
}

/** Whether a cache key should survive tab refresh via sessionStorage. */
export function shouldPersistAdminQueryKey(key: string): boolean {
  if (PERSIST_EXACT_KEYS.has(key)) {
    return true;
  }
  return PERSIST_LIST_DEFAULT_KEYS.has(key);
}

function readStorage(): Record<string, PersistedEntry> {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, PersistedEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(store: Record<string, PersistedEntry>): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota exceeded — drop persisted cache rather than breaking reads.
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Load persisted entries into the in-memory admin query cache. */
export function readPersistedAdminQueryEntries(): Record<string, PersistedEntry> {
  return readStorage();
}

/** Persist a single cache entry (no-op for non-persistable keys). */
export function persistAdminQueryEntry(key: string, data: unknown, fetchedAt: number): void {
  if (!shouldPersistAdminQueryKey(key)) {
    return;
  }
  const store = readStorage();
  store[key] = { data, fetchedAt };
  writeStorage(store);
}

/** Remove a key from sessionStorage when invalidated. */
export function removePersistedAdminQueryEntry(key: string): void {
  const store = readStorage();
  if (!(key in store)) {
    return;
  }
  delete store[key];
  writeStorage(store);
}

/** Clear persisted entries whose keys match a prefix. */
export function removePersistedAdminQueryPrefix(prefix: string): void {
  const store = readStorage();
  let changed = false;
  for (const key of Object.keys(store)) {
    if (key.startsWith(prefix)) {
      delete store[key];
      changed = true;
    }
  }
  if (changed) {
    writeStorage(store);
  }
}
