import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  fetchAdminQuery,
  invalidateAdminQuery,
  peekAdminQuery,
  subscribeAdminQuery,
} from './admin-query-cache';

describe('admin-query-cache', () => {
  beforeEach(() => {
    invalidateAdminQuery('test:dedupe');
    invalidateAdminQuery('test:stale');
    invalidateAdminQuery('test:invalidate');
    invalidateAdminQuery('test:swr');
  });

  it('deduplicates in-flight requests', async () => {
    const fetcher = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return { ok: true };
    });

    const [first, second] = await Promise.all([
      fetchAdminQuery('test:dedupe', fetcher, { staleTimeMs: 0 }),
      fetchAdminQuery('test:dedupe', fetcher, { staleTimeMs: 0 }),
    ]);

    expect(first).toEqual({ ok: true });
    expect(second).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('deduplicates concurrent calls started in the same tick', async () => {
    const fetcher = vi.fn(async () => ({ ok: true }));

    const results = await Promise.all([
      fetchAdminQuery('test:dedupe', fetcher, { staleTimeMs: 0 }),
      fetchAdminQuery('test:dedupe', fetcher, { staleTimeMs: 0 }),
      fetchAdminQuery('test:dedupe', fetcher, { staleTimeMs: 0 }),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('returns cached data within stale window', async () => {
    const fetcher = vi.fn(async () => ({ count: 1 }));

    await fetchAdminQuery('test:stale', fetcher, { staleTimeMs: 60_000 });
    const cached = await fetchAdminQuery('test:stale', fetcher, { staleTimeMs: 60_000 });

    expect(cached).toEqual({ count: 1 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(peekAdminQuery<{ count: number }>('test:stale')).toEqual({ count: 1 });
  });

  it('returns stale data immediately and revalidates in background', async () => {
    let resolveFetch: (value: { count: number }) => void = () => undefined;
    const fetcher = vi.fn(
      () =>
        new Promise<{ count: number }>((resolve) => {
          resolveFetch = resolve;
        })
    );

    await fetchAdminQuery('test:swr', async () => ({ count: 1 }), { staleTimeMs: 1 });
    await new Promise((resolve) => setTimeout(resolve, 5));

    const stale = await fetchAdminQuery('test:swr', fetcher, { staleTimeMs: 1 });

    expect(stale).toEqual({ count: 1 });
    expect(fetcher).toHaveBeenCalledTimes(1);

    resolveFetch({ count: 2 });
    await new Promise((resolve) => setTimeout(resolve, 5));

    expect(peekAdminQuery<{ count: number }>('test:swr')).toEqual({ count: 2 });
  });

  it('notifies subscribers when cache updates', async () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAdminQuery<{ count: number }>('test:swr', listener);

    await fetchAdminQuery('test:swr', async () => ({ count: 1 }), { staleTimeMs: 0 });
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsubscribe();
  });

  it('invalidates cache entries', async () => {
    const fetcher = vi.fn(async () => ({ count: 2 }));

    await fetchAdminQuery('test:invalidate', fetcher, { staleTimeMs: 60_000 });
    invalidateAdminQuery('test:invalidate');
    await fetchAdminQuery('test:invalidate', fetcher, { staleTimeMs: 60_000 });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
