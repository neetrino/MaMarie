'use client';

import { usePathname } from 'next/navigation';
import { LOGIN_SECTION_FOOTER_OVERLAP_PX } from '../constants/login-page';
import { SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX } from '../constants/lazy-loading';
import { DesktopFluidFrame } from './DesktopFluidFrame';
import { Footer } from './Footer';
import { LazyWhenVisible } from './LazyWhenVisible';

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/profile')) {
    return null;
  }

  const isLoginPage = pathname === '/login';

  return (
    <DesktopFluidFrame className="mt-auto hidden lg:flex">
      <div style={isLoginPage ? { marginTop: -LOGIN_SECTION_FOOTER_OVERLAP_PX } : undefined}>
        <LazyWhenVisible minHeightPx={SITE_FOOTER_PLACEHOLDER_MIN_HEIGHT_PX}>
          <Footer topGapPx={isLoginPage ? 0 : undefined} />
        </LazyWhenVisible>
      </div>
    </DesktopFluidFrame>
  );
}
