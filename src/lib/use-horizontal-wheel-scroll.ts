'use client';

import { useEffect, useRef } from 'react';

/**
 * Maps vertical mouse-wheel (and trackpad) input to horizontal scroll
 * when the element has horizontal overflow — desktop hover-to-scroll UX.
 */
export function useHorizontalWheelScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) {
        return;
      }

      const hasDominantHorizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = hasDominantHorizontalDelta ? event.deltaX : event.deltaY;

      if (delta === 0) {
        return;
      }

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextScrollLeft = Math.min(maxScrollLeft, Math.max(0, container.scrollLeft + delta));
      const canScroll = nextScrollLeft !== container.scrollLeft;

      if (!canScroll) {
        return;
      }

      event.preventDefault();
      container.scrollLeft = nextScrollLeft;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return scrollRef;
}
