'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  HEADER_CONTENT_CLEARANCE_DESKTOP_PX,
  HEADER_CONTENT_CLEARANCE_MOBILE_PX,
} from '../constants/header';
import { DesktopFluidFrame } from './DesktopFluidFrame';
import { useResolvedPathname } from './hooks/useResolvedPathname';

interface MainContentProps {
  children: ReactNode;
}

const headerClearanceVars = {
  ['--header-clearance-mobile']: `${HEADER_CONTENT_CLEARANCE_MOBILE_PX}px`,
  ['--header-clearance-desktop']: `calc(${HEADER_CONTENT_CLEARANCE_DESKTOP_PX}px * var(--desktop-layout-scale, 1))`,
} as CSSProperties;

/**
 * Home, shop, and PDP already scale via their own DesktopFluidFrame.
 */
function shouldSkipDesktopFluidFrame(pathname: string): boolean {
  return pathname === '/' || pathname.startsWith('/products');
}

function needsViewportFillFrame(pathname: string): boolean {
  return (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/supersudo') ||
    pathname.startsWith('/admin')
  );
}

function wrapStorefrontContent(pathname: string, children: ReactNode): ReactNode {
  if (shouldSkipDesktopFluidFrame(pathname)) {
    return children;
  }

  const fillViewport = needsViewportFillFrame(pathname);

  return (
    <DesktopFluidFrame
      className={fillViewport ? 'min-h-0 flex-1' : ''}
      stageClassName={fillViewport ? 'flex h-full min-h-0 flex-col' : ''}
    >
      {children}
    </DesktopFluidFrame>
  );
}

/**
 * Wraps page content with top clearance for the fixed navbar.
 * Home hero is excluded — hero sits under the transparent bar.
 * Storefront and admin share the same 1440px DesktopFluidFrame scaling as home/shop.
 * Home and /products keep their own frames to avoid double-scaling.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = useResolvedPathname();
  const content = wrapStorefrontContent(pathname, children);

  const mainBase = 'flex-1 w-full bg-white max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden';
  const mainContentBase = 'w-full bg-white max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden';

  if (pathname === '/') {
    return (
      <main className="home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white">
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/wishlist')) {
    return (
      <main
        className="home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/orders')) {
    return (
      <main
        className="home-main-surface order-page-main flex min-h-0 flex-1 flex-col w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/checkout')) {
    return (
      <main
        className="home-main-surface order-page-main flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/contact')) {
    return (
      <main
        className="home-main-surface w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:bg-white pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/supersudo') || pathname.startsWith('/admin')) {
    return (
      <main className="admin-page-main home-main-surface flex min-h-0 flex-1 flex-col w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden">
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/profile')) {
    return (
      <main
        className="profile-page-main home-main-surface flex-1 w-full max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname.startsWith('/products')) {
    return (
      <main className={`${mainContentBase} home-main-surface max-lg:overflow-visible`}>{content}</main>
    );
  }

  if (pathname.startsWith('/about')) {
    return (
      <main
        className={`${mainContentBase} pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]`}
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  if (pathname === '/login' || pathname === '/register') {
    return (
      <main
        className="auth-main-surface home-main-surface flex-1 w-full max-[743px]:flex-none max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-visible pt-[var(--header-clearance-mobile)] lg:bg-white lg:pt-[var(--header-clearance-desktop)]"
        style={headerClearanceVars}
      >
        {content}
      </main>
    );
  }

  return (
    <main
      className={`${mainBase} flex min-h-0 flex-col pt-[var(--header-clearance-mobile)] lg:pt-[var(--header-clearance-desktop)]`}
      style={headerClearanceVars}
    >
      {content}
    </main>
  );
}
