import { buildPersistableAdminListKeys } from '@/lib/admin/admin-list-default-params';

const STORAGE_KEY = 'mamarie:admin-query-cache:v1';
const PERSIST_FLUSH_DEBOUNCE_MS = 300;

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

let pendingStore: Record<string, PersistedEntry> | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

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

function getMutableStore(): Record<string, PersistedEntry> {
  if (!pendingStore) {
    pendingStore = readStorage();
  }
  return pendingStore;
}

/** Flush debounced sessionStorage writes immediately (e.g. before tab close). */
export function flushPersistedAdminQueryCache(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!pendingStore) {
    return;
  }
  writeStorage(pendingStore);
  pendingStore = null;
}

function schedulePersistFlush(): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (flushTimer) {
    return;
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushPersistedAdminQueryCache();
  }, PERSIST_FLUSH_DEBOUNCE_MS);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushPersistedAdminQueryCache);
}

/** Load persisted entries into the in-memory admin query cache. */
export function readPersistedAdminQueryEntries(): Record<string, PersistedEntry> {
  flushPersistedAdminQueryCache();
  return readStorage();
}

/** Persist a single cache entry (no-op for non-persistable keys). */
export function persistAdminQueryEntry(key: string, data: unknown, fetchedAt: number): void {
  if (!shouldPersistAdminQueryKey(key)) {
    return;
  }
  const store = getMutableStore();
  store[key] = { data, fetchedAt };
  schedulePersistFlush();
}

/** Remove a key from sessionStorage when invalidated. */
export function removePersistedAdminQueryEntry(key: string): void {
  const store = getMutableStore();
  if (!(key in store)) {
    return;
  }
  delete store[key];
  schedulePersistFlush();
}

/** Clear persisted entries whose keys match a prefix. */
export function removePersistedAdminQueryPrefix(prefix: string): void {
  const store = getMutableStore();
  let changed = false;
  for (const key of Object.keys(store)) {
    if (key.startsWith(prefix)) {
      delete store[key];
      changed = true;
    }
  }
  if (changed) {
    schedulePersistFlush();
  }
}
