'use client';

import { usePathname } from 'next/navigation';

/**
 * Returns a stable pathname for route-based layout logic.
 * Falls back to `window.location.pathname` when Next pathname is temporarily unavailable.
 */
export function useResolvedPathname(): string {
  const pathname = usePathname();

  if (pathname) {
    return pathname;
  }

  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }

  return '/';
}
