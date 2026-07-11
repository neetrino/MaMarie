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
  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    const profileScrollArea = document.querySelector('.profile-scroll-area');
    hasUserScrolledRef.current = false;

    const updateScrollState = () => {
      let scrolled = resolveWindowScrollTop() > HEADER_HOME_SCROLL_THRESHOLD_PX;

      if (pathname.startsWith('/profile') && profileScrollArea instanceof HTMLElement) {
        scrolled =
          scrolled || profileScrollArea.scrollTop > HEADER_HOME_SCROLL_THRESHOLD_PX;
      }

      // Home pill should appear only after the user starts scrolling.
      if (pathname === '/' && !hasUserScrolledRef.current) {
        scrolled = false;
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

    const markUserScrollIntent = () => {
      hasUserScrolledRef.current = true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'PageDown' ||
        event.key === 'PageUp' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.key === ' '
      ) {
        markUserScrollIntent();
      }
    };

    updateScrollState();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('wheel', markUserScrollIntent, { passive: true });
    window.addEventListener('touchstart', markUserScrollIntent, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    profileScrollArea?.addEventListener('scroll', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('wheel', markUserScrollIntent);
      window.removeEventListener('touchstart', markUserScrollIntent);
      window.removeEventListener('keydown', handleKeyDown);
      profileScrollArea?.removeEventListener('scroll', scheduleUpdate);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [pathname]);

  return isScrolled;
}
