'use client';

import { usePathname } from 'next/navigation';
import { LOGIN_SECTION_FOOTER_OVERLAP_PX } from '../constants/login-page';
import { SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX } from '../constants/lazy-loading';
import { DesktopFluidFrame } from './DesktopFluidFrame';
import { Footer } from './Footer';
import { LazyWhenVisible } from './LazyWhenVisible';

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/profile') || pathname?.startsWith('/supersudo')) {
    return null;
  }

  const isAuthFormPage = pathname === '/login' || pathname === '/register';

  return (
    <DesktopFluidFrame className="mt-auto hidden lg:flex">
      <div style={isAuthFormPage ? { marginTop: -LOGIN_SECTION_FOOTER_OVERLAP_PX } : undefined}>
        <LazyWhenVisible minHeightPx={SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX}>
          <Footer topGapPx={isAuthFormPage ? 0 : undefined} />
        </LazyWhenVisible>
      </div>
    </DesktopFluidFrame>
  );
}
