'use client';

import { Suspense } from 'react';
import {
  HEADER_ACTIONS_GAP_PX,
  HEADER_PADDING_LEFT_PX,
  HEADER_PADDING_RIGHT_PX,
} from '../constants/brand';
import {
  HEADER_DESKTOP_ROW_PADDING_Y_PX,
  HEADER_HOME_OFFSET_Y_PX,
  HEADER_HOME_OVERLAY_TOP_PX,
  HEADER_PILL_APPEAR_DURATION_MS,
  HEADER_PILL_SHELL_HEIGHT_PX,
} from '../constants/header';
import { BrandLogoLink } from './BrandLogoLink';
import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from './home/HomeSectionShell';
import { HeaderActionIcons } from './header/HeaderActionIcons';
import { HeaderCurrencyPill } from './header/HeaderCurrencyPill';
import { HeaderLanguagePill } from './header/HeaderLanguagePill';
import { HeaderLoginPill } from './header/HeaderLoginPill';
import { HeaderMobileActions } from './header/HeaderMobileActions';
import { HeaderNavLinks } from './header/HeaderNavLinks';
import { useHeaderScrolled } from './header/useHomeHeaderScrolled';

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
        <HeaderLoginPill />
      </div>
    </>
  );
}

function HeaderNavRows() {
  return (
    <>
      <div className="flex h-20 w-full items-end justify-between lg:hidden" style={headerInsetStyle}>
        <BrandLogoLink size="mobile" />
        <HeaderMobileActions />
      </div>

      <div
        className="hidden w-full items-center lg:flex"
        style={{ ...headerInsetStyle, paddingTop: HEADER_DESKTOP_ROW_PADDING_Y_PX, paddingBottom: HEADER_DESKTOP_ROW_PADDING_Y_PX }}
      >
        <HeaderDesktopNav />
      </div>
    </>
  );
}

function OverlayHeaderContent({ showPill }: { showPill: boolean }) {
  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center"
      >
        <HomeContentHorizontalFrame>
          <HomeSectionContent>
            <div
              className="w-full rounded-full bg-white shadow-[0_4px_24px_rgba(87,66,59,0.12)] transition-opacity ease-out"
              style={{
                height: HEADER_PILL_SHELL_HEIGHT_PX,
                opacity: showPill ? 1 : 0,
                transitionDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
              }}
            />
          </HomeSectionContent>
        </HomeContentHorizontalFrame>
      </div>

      <div className="relative z-10">
        <HeaderNavRows />
      </div>
    </div>
  );
}

export function Header() {
  const isScrolled = useHeaderScrolled();

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 w-full bg-transparent"
      style={{
        paddingTop: HEADER_HOME_OVERLAY_TOP_PX,
        transform: `translateY(${HEADER_HOME_OFFSET_Y_PX}px)`,
      }}
    >
      <OverlayHeaderContent showPill={isScrolled} />
    </header>
  );
}
