'use client';

import type { CSSProperties, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  HEADER_CONTENT_CLEARANCE_DESKTOP_PX,
  HEADER_CONTENT_CLEARANCE_MOBILE_PX,
} from '../constants/header';

interface MainContentProps {
  children: ReactNode;
}

const headerClearanceVars = {
  ['--header-clearance-mobile']: `${HEADER_CONTENT_CLEARANCE_MOBILE_PX}px`,
  ['--header-clearance-desktop']: `${HEADER_CONTENT_CLEARANCE_DESKTOP_PX}px`,
} as CSSProperties;

/**
 * Wraps page content with top clearance for the fixed navbar.
 * Home hero and admin routes are excluded — hero sits under the transparent bar.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname() ?? '';

  const mainBase = 'flex-1 w-full bg-white max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden';

  if (pathname === '/' || pathname.startsWith('/supersudo')) {
    return <main className={mainBase}>{children}</main>;
  }

  if (pathname.startsWith('/profile')) {
    return (
      <main
        className={`${mainBase} md:pt-[var(--header-clearance-desktop)]`}
        style={{ ['--header-clearance-desktop']: `${HEADER_CONTENT_CLEARANCE_DESKTOP_PX}px` }}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/products')) {
    return <main className={mainBase}>{children}</main>;
  }

  return (
    <main
      className={`${mainBase} pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]`}
      style={headerClearanceVars}
    >
      {children}
    </main>
  );
}
