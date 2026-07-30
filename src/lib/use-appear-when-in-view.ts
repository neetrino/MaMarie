'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface AppearWhenInViewOptions {
  /**
   * Shrink the viewport from the bottom (0–50).
   * Higher = user must scroll further before animation starts.
   */
  bottomInsetPercent?: number;
  /** Min visible fraction of the element (0–1). */
  minRatio?: number;
}

/**
 * Becomes true once enough of the element is actually on screen.
 * Avoids firing while the block is still mostly below the fold.
 */
export function useAppearWhenInView(
  options: AppearWhenInViewOptions = {},
): {
  ref: RefObject<HTMLDivElement>;
  shouldAppear: boolean;
} {
  const bottomInsetPercent = options.bottomInsetPercent ?? 28;
  const minRatio = options.minRatio ?? 0.28;

  const ref = useRef<HTMLDivElement>(null);
  const [shouldAppear, setShouldAppear] = useState(false);

  useEffect(() => {
    if (shouldAppear) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const isReady = (ratio: number, top: number, bottom: number): boolean => {
      if (ratio < minRatio) {
        return false;
      }
      const triggerLine = window.innerHeight * (1 - bottomInsetPercent / 100);
      return top < triggerLine && bottom > 0;
    };

    const rect = node.getBoundingClientRect();
    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    if (isReady(ratio, rect.top, rect.bottom)) {
      setShouldAppear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        const { top, bottom } = entry.boundingClientRect;
        if (isReady(entry.intersectionRatio, top, bottom)) {
          setShouldAppear(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: `0px 0px -${bottomInsetPercent}% 0px`,
        threshold: [0, 0.15, 0.28, 0.4, 0.55],
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [bottomInsetPercent, minRatio, shouldAppear]);

  return { ref, shouldAppear };
}
