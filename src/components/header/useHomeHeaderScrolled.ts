'use client';

import { useEffect, useState } from 'react';
import { HEADER_HOME_SCROLL_THRESHOLD_PX } from '../../constants/header';

/**
 * Returns true when the homepage has scrolled past the hero overlay threshold.
 */
export function useHomeHeaderScrolled(isHome: boolean): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > HEADER_HOME_SCROLL_THRESHOLD_PX);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, [isHome]);

  return isScrolled;
}
