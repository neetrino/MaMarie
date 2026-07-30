'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ABOUT_PAGE_TITLE_APPEAR_DURATION_MS } from '../../constants/about-us-enter';
import { SoftAppearShell } from '../motion/SoftAppearShell';
import { useAppearWhenInView } from '../../lib/use-appear-when-in-view';

interface AboutPageTitleProps {
  src: string;
  alt: string;
  widthPx: number;
  heightPx: number;
  quality: number;
  className?: string;
  style?: CSSProperties;
}

/** «ABOUT» title art — slow soft fade + rise when on screen. */
export function AboutPageTitle({
  src,
  alt,
  widthPx,
  heightPx,
  quality,
  className = '',
  style,
}: AboutPageTitleProps) {
  const { ref, shouldAppear } = useAppearWhenInView({
    bottomInsetPercent: 8,
    minRatio: 0.2,
  });

  return (
    <div ref={ref} className={className} style={{ width: widthPx, height: heightPx, ...style }}>
      <SoftAppearShell
        active={shouldAppear}
        durationMs={ABOUT_PAGE_TITLE_APPEAR_DURATION_MS}
        className="h-full w-full"
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            quality={quality}
            unoptimized
            sizes={`${widthPx}px`}
            className="object-contain"
          />
        </div>
      </SoftAppearShell>
    </div>
  );
}
