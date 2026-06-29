'use client';

import { useEffect, useState } from 'react';
import { HEADER_HOME_SCROLL_THRESHOLD_PX } from '../../constants/header';

/**
 * Returns true when the page has scrolled past the navbar pill threshold.
 */
export function useHeaderScrolled(): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollTop > HEADER_HOME_SCROLL_THRESHOLD_PX);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  return isScrolled;
}
