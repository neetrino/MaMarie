'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing category navigation scroll state
 */
export function useCategoryScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRafRef = useRef(0);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    const canLeft = scrollLeft > 8;
    const canRight = scrollLeft + clientWidth < scrollWidth - 8;

    setCanScrollLeft((prev) => (prev === canLeft ? prev : canLeft));
    setCanScrollRight((prev) => (prev === canRight ? prev : canRight));
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const scheduleUpdate = () => {
      if (scrollRafRef.current) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        updateScrollButtons();
      });
    };

    const handleResize = () => {
      window.setTimeout(updateScrollButtons, 100);
    };

    container.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    window.setTimeout(updateScrollButtons, 100);

    return () => {
      container.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', handleResize);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [updateScrollButtons]);

  const scrollByAmount = (amount: number) => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollBy({ left: amount, behavior: 'smooth' });
    window.setTimeout(updateScrollButtons, 100);
  };

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollByAmount,
    updateScrollButtons,
  };
}
