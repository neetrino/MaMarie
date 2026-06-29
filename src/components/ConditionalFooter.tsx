'use client';

import { usePathname } from 'next/navigation';
import { SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX } from '../constants/lazy-loading';
import { Footer } from './Footer';
import { LazyWhenVisible } from './LazyWhenVisible';

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/profile')) {
    return null;
  }
  return (
    <LazyWhenVisible minHeightPx={SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX}>
      <Footer />
    </LazyWhenVisible>
  );
}
