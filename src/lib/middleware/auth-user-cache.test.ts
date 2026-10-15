import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AuthUser } from './auth';
import { invalidateCachedAuthUser, resolveCachedAuthUser } from './auth-user-cache';

const USER_ID = 'user-1';
const TTL_PLUS_MARGIN_MS = 5_001;

function makeUser(locale: string): AuthUser {
  return { id: USER_ID, email: 'a@b.c', phone: null, locale, roles: ['admin'] };
}

afterEach(() => {
  invalidateCachedAuthUser(USER_ID);
  vi.useRealTimers();
});

describe('resolveCachedAuthUser', () => {
  it('shares one lookup between concurrent requests', async () => {
    const loadUser = vi.fn(async () => makeUser('hy'));
    const results = await Promise.all([
      resolveCachedAuthUser('token-a', USER_ID, loadUser),
      resolveCachedAuthUser('token-a', USER_ID, loadUser),
      resolveCachedAuthUser('token-a', USER_ID, loadUser),
    ]);
    expect(loadUser).toHaveBeenCalledTimes(1);
    expect(results.every((user) => user?.locale === 'hy')).toBe(true);
  });

  it('reloads after the TTL expires', async () => {
    vi.useFakeTimers();
    const loadUser = vi.fn(async () => makeUser('hy'));
    await resolveCachedAuthUser('token-b', USER_ID, loadUser);
    vi.advanceTimersByTime(TTL_PLUS_MARGIN_MS);
    await resolveCachedAuthUser('token-b', USER_ID, loadUser);
    expect(loadUser).toHaveBeenCalledTimes(2);
  });

  it('drops every session of a user on invalidation', async () => {
    await resolveCachedAuthUser('token-c', USER_ID, async () => makeUser('hy'));
    await resolveCachedAuthUser('token-d', USER_ID, async () => makeUser('hy'));
    invalidateCachedAuthUser(USER_ID);

    const blocked = vi.fn(async () => null);
    expect(await resolveCachedAuthUser('token-c', USER_ID, blocked)).toBeNull();
    expect(await resolveCachedAuthUser('token-d', USER_ID, blocked)).toBeNull();
    expect(blocked).toHaveBeenCalledTimes(2);
  });
});
