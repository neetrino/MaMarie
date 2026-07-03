'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HEADER_HOME_SCROLL_THRESHOLD_PX } from '../../constants/header';

function resolveWindowScrollTop(): number {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

/**
 * Returns true when the page has scrolled past the navbar pill threshold.
 * Also listens to profile desktop internal scroll (iPad Pro `lg` layout).
 */
export function useHeaderScrolled(): boolean {
  const pathname = usePathname() ?? '';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const profileScrollArea = document.querySelector('.profile-scroll-area');

    const updateScrollState = () => {
      let scrolled = resolveWindowScrollTop() > HEADER_HOME_SCROLL_THRESHOLD_PX;

      if (pathname.startsWith('/profile') && profileScrollArea instanceof HTMLElement) {
        scrolled =
          scrolled || profileScrollArea.scrollTop > HEADER_HOME_SCROLL_THRESHOLD_PX;
      }

      setIsScrolled(scrolled);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    profileScrollArea?.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      profileScrollArea?.removeEventListener('scroll', updateScrollState);
    };
  }, [pathname]);

  return isScrolled;
}
