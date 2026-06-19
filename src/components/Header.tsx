'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import {
  HEADER_ACTIONS_GAP_PX,
  HEADER_PADDING_LEFT_PX,
  HEADER_PADDING_RIGHT_PX,
} from '../constants/brand';
import {
  HEADER_HOME_OVERLAY_TOP_PX,
  HEADER_PILL_APPEAR_DURATION_MS,
  HEADER_PILL_SHELL_PADDING_X_PX,
} from '../constants/header';
import { BrandLogoLink } from './BrandLogoLink';
import { HeaderActionIcons } from './header/HeaderActionIcons';
import { HeaderCurrencyPill } from './header/HeaderCurrencyPill';
import { HeaderLanguagePill } from './header/HeaderLanguagePill';
import { HeaderNavLinks } from './header/HeaderNavLinks';
import { useHomeHeaderScrolled } from './header/useHomeHeaderScrolled';

const headerInsetStyle = {
  paddingLeft: HEADER_PADDING_LEFT_PX,
  paddingRight: HEADER_PADDING_RIGHT_PX,
} as const;

function HeaderDesktopNav() {
  return (
    <>
      <BrandLogoLink className="shrink-0" />

      <div className="flex min-w-0 flex-1 items-center justify-center">
        <Suspense fallback={<nav aria-hidden className="h-6 shrink-0" />}>
          <HeaderNavLinks />
        </Suspense>
      </div>

      <div
        className="flex shrink-0 items-center"
        style={{ gap: HEADER_ACTIONS_GAP_PX }}
      >
        <HeaderActionIcons />
        <HeaderLanguagePill />
        <HeaderCurrencyPill />
      </div>
    </>
  );
}

function HeaderNavRows() {
  return (
    <>
      <div className="flex h-16 w-full items-center lg:hidden" style={headerInsetStyle}>
        <BrandLogoLink size="mobile" />
      </div>

      <div className="hidden w-full items-center py-3 lg:flex" style={headerInsetStyle}>
        <HeaderDesktopNav />
      </div>
    </>
  );
}

function HomeHeaderContent({ showPill }: { showPill: boolean }) {
  return (
    <div className="relative w-full">
      {showPill ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 animate-header-pill-in rounded-full bg-white shadow-[0_4px_24px_rgba(87,66,59,0.12)]"
          style={{
            left: HEADER_PILL_SHELL_PADDING_X_PX,
            right: HEADER_PILL_SHELL_PADDING_X_PX,
            animationDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
          }}
        />
      ) : null}

      <div className="relative z-10">
        <HeaderNavRows />
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? '';
  const isHome = pathname === '/';
  const isScrolled = useHomeHeaderScrolled(isHome);

  if (!isHome) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white">
        <HeaderNavRows />
      </header>
    );
  }

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 w-full bg-transparent"
      style={{ paddingTop: HEADER_HOME_OVERLAY_TOP_PX }}
    >
      <HomeHeaderContent showPill={isScrolled} />
    </header>
  );
}
