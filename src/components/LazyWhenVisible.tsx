'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { LAZY_LOAD_ROOT_MARGIN_PX } from '../constants/lazy-loading';

interface LazyWhenVisibleProps {
  children: ReactNode;
  minHeightPx: number;
  rootMarginPx?: number;
  className?: string;
  fallback?: ReactNode;
}

/**
 * Mounts children when the placeholder nears the viewport.
 * Reserves vertical space first to limit layout shift.
 */
export function LazyWhenVisible({
  children,
  minHeightPx,
  rootMarginPx = LAZY_LOAD_ROOT_MARGIN_PX,
  className,
  fallback,
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${rootMarginPx}px 0px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMarginPx]);

  const style: CSSProperties | undefined = isVisible ? undefined : { minHeight: minHeightPx };

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
}
