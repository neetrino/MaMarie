'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

interface UseHorizontalScrollIndexOptions {
  itemCount: number;
  itemStridePx: number;
}

/**
 * Tracks the active slide index for a horizontally scrollable row.
 */
export function useHorizontalScrollIndex({
  itemCount,
  itemStridePx,
}: UseHorizontalScrollIndexOptions): {
  scrollRef: RefObject<HTMLDivElement>;
  activeIndex: number;
} {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container || itemCount <= 0 || itemStridePx <= 0) {
      return;
    }

    const nextIndex = Math.min(
      itemCount - 1,
      Math.max(0, Math.round(container.scrollLeft / itemStridePx)),
    );
    setActiveIndex(nextIndex);
  }, [itemCount, itemStridePx]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    updateActiveIndex();
    container.addEventListener('scroll', updateActiveIndex, { passive: true });
    return () => {
      container.removeEventListener('scroll', updateActiveIndex);
    };
  }, [updateActiveIndex]);

  return { scrollRef, activeIndex };
}
