import type { AuthUser } from "./auth";

/**
 * Admin screens fire several API calls at once and each one repeated the same `users`
 * lookup before any domain query could start. Concurrent requests share one in-flight
 * lookup, and the resolved session is reused for a short window. JWT signature/expiry
 * is still verified on every request; only the DB user row is reused.
 */
const AUTH_USER_CACHE_TTL_MS = 5_000;

/** Bounds memory for long-lived server processes; oldest keys are evicted first. */
const AUTH_USER_CACHE_MAX_ENTRIES = 1_000;

interface CacheEntry {
  userId: string;
  user: AuthUser | null;
  expiresAt: number;
}

const resolvedSessions = new Map<string, CacheEntry>();
const pendingSessions = new Map<string, Promise<AuthUser | null>>();

function evictOldestWhenFull(): void {
  if (resolvedSessions.size < AUTH_USER_CACHE_MAX_ENTRIES) {
    return;
  }
  const oldestKey = resolvedSessions.keys().next().value;
  if (oldestKey !== undefined) {
    resolvedSessions.delete(oldestKey);
  }
}

function readFresh(token: string): CacheEntry | null {
  const entry = resolvedSessions.get(token);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    resolvedSessions.delete(token);
    return null;
  }
  return entry;
}

/**
 * Resolve the session behind a verified token, deduplicating concurrent lookups.
 * @param token Raw JWT; used only as an in-memory map key and never logged.
 */
export async function resolveCachedAuthUser(
  token: string,
  userId: string,
  loadUser: () => Promise<AuthUser | null>
): Promise<AuthUser | null> {
  const cached = readFresh(token);
  if (cached) {
    return cached.user;
  }

  const pending = pendingSessions.get(token);
  if (pending) {
    return pending;
  }

  const lookup = loadUser()
    .then((user) => {
      evictOldestWhenFull();
      resolvedSessions.set(token, { userId, user, expiresAt: Date.now() + AUTH_USER_CACHE_TTL_MS });
      return user;
    })
    .finally(() => {
      pendingSessions.delete(token);
    });

  pendingSessions.set(token, lookup);
  return lookup;
}

/** Drops every cached session of a user — call after block, delete, role or profile change. */
export function invalidateCachedAuthUser(userId: string): void {
  for (const [token, entry] of resolvedSessions) {
    if (entry.userId === userId) {
      resolvedSessions.delete(token);
    }
  }
}
