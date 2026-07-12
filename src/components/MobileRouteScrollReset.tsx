'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** On mobile/tablet, start each route transition from the top. */
export function MobileRouteScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const currentUrl = query ? `${pathname}?${query}` : pathname;

    if (prevUrlRef.current !== null && prevUrlRef.current !== currentUrl) {
      const isMobileViewport = window.matchMedia('(max-width: 1023px)').matches;
      if (isMobileViewport) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }

    prevUrlRef.current = currentUrl;
  }, [pathname, searchParams]);

  return null;
}
