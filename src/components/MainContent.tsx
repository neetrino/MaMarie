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
  ['--header-clearance-desktop']: `calc(${HEADER_CONTENT_CLEARANCE_DESKTOP_PX}px * var(--desktop-layout-scale, 1))`,
} as CSSProperties;

/**
 * Wraps page content with top clearance for the fixed navbar.
 * Home hero and admin routes are excluded — hero sits under the transparent bar.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname() ?? '';

  const mainBase = 'flex-1 w-full bg-white max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden';
  const mainContentBase = 'w-full bg-white max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden';

  if (pathname === '/') {
    return (
      <main className="home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white">
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/wishlist')) {
    return (
      <main
        className="home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/orders')) {
    return (
      <main
        className="home-main-surface order-page-main flex min-h-0 flex-1 flex-col w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/checkout')) {
    return (
      <main
        className="home-main-surface order-page-main flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/contact')) {
    return (
      <main
        className="home-main-surface w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/supersudo')) {
    return <main className={mainBase}>{children}</main>;
  }

  if (pathname.startsWith('/profile')) {
    return (
      <main
        className="profile-page-main home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/products')) {
    return (
      <main className={`${mainContentBase} home-main-surface max-lg:overflow-visible`}>{children}</main>
    );
  }

  if (pathname.startsWith('/about')) {
    return (
      <main
        className={`${mainContentBase} pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]`}
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  if (pathname === '/login' || pathname === '/register') {
    return (
      <main
        className="home-main-surface flex-1 max-lg:flex-none w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-visible pt-[var(--header-clearance-mobile)] lg:bg-white lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {children}
      </main>
    );
  }

  return (
    <main
      className={`${mainBase} flex min-h-0 flex-col pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]`}
      style={headerClearanceVars}
    >
      {children}
    </main>
  );
}
