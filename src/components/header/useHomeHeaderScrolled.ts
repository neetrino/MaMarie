'use client';

import { useEffect, useRef, useState } from 'react';
import { HEADER_HOME_SCROLL_THRESHOLD_PX } from '../../constants/header';
import { useResolvedPathname } from '../hooks/useResolvedPathname';

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
  const pathname = useResolvedPathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRafRef = useRef(0);

  useEffect(() => {
    const profileScrollArea = document.querySelector('.profile-scroll-area');

    const updateScrollState = () => {
      let scrolled = resolveWindowScrollTop() > HEADER_HOME_SCROLL_THRESHOLD_PX;

      if (pathname.startsWith('/profile') && profileScrollArea instanceof HTMLElement) {
        scrolled =
          scrolled || profileScrollArea.scrollTop > HEADER_HOME_SCROLL_THRESHOLD_PX;
      }

      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
    };

    const scheduleUpdate = () => {
      if (scrollRafRef.current) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        updateScrollState();
      });
    };

    updateScrollState();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    profileScrollArea?.addEventListener('scroll', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      profileScrollArea?.removeEventListener('scroll', scheduleUpdate);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [pathname]);

  return isScrolled;
}
