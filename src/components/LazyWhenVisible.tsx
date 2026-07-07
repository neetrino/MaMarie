'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { LAZY_LOAD_ROOT_MARGIN_PX } from '../constants/lazy-loading';

interface LazyWhenVisibleProps {
  children: ReactNode;
  minHeightPx: number;
  rootMarginPx?: number;
  /** Extra horizontal prefetch for sideways scroll rows (related products, mobile best sellers). */
  prefetchHorizontalPx?: number;
  className?: string;
  fallback?: ReactNode;
  /** Skip the observer and mount children immediately (above-the-fold slots). */
  eager?: boolean;
}

/**
 * Mounts children when the placeholder nears the viewport.
 * Reserves vertical space first to limit layout shift.
 */
export function LazyWhenVisible({
  children,
  minHeightPx,
  rootMarginPx = LAZY_LOAD_ROOT_MARGIN_PX,
  prefetchHorizontalPx = 0,
  className,
  fallback,
  eager = false,
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(eager);

  useEffect(() => {
    if (eager) {
      return;
    }

    const node = ref.current;
    if (!node || isVisible) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight + rootMarginPx &&
      rect.bottom > -rootMarginPx &&
      rect.left < window.innerWidth + prefetchHorizontalPx &&
      rect.right > -prefetchHorizontalPx;
    if (alreadyVisible) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${rootMarginPx}px ${prefetchHorizontalPx}px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, isVisible, prefetchHorizontalPx, rootMarginPx]);

  const style: CSSProperties | undefined = isVisible ? undefined : { minHeight: minHeightPx };

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
}
