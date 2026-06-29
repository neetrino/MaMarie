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
  HEADER_MOBILE_NAV_BAND_HEIGHT_PX,
  HEADER_MOBILE_NAV_ROW_HEIGHT_PX,
  HEADER_MOBILE_NAV_TOP_INSET_PX,
  HEADER_MOBILE_PADDING_X_PX,
  HEADER_MOBILE_PILL_CONTENT_INSET_PX,
  HEADER_MOBILE_PILL_HEIGHT_PX,
  HEADER_MOBILE_PILL_LOGO_INSET_PX,
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

const headerPillTransitionStyle = {
  transitionDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
} as const;

const headerPillClassName =
  'w-full rounded-full bg-white shadow-[0_4px_24px_rgba(87,66,59,0.12)] transition-opacity ease-out';

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

/** Mobile navbar — Figma `74:729`: logo/actions band, search sits below in hero. */
function MobileHeaderBar({ showPill }: { showPill: boolean }) {
  const contentBandHeightPx = showPill
    ? HEADER_MOBILE_PILL_HEIGHT_PX
    : HEADER_MOBILE_NAV_BAND_HEIGHT_PX;

  return (
    <div
      className="grid w-full lg:hidden"
      style={{
        height: HEADER_MOBILE_NAV_ROW_HEIGHT_PX,
        paddingLeft: HEADER_MOBILE_PADDING_X_PX,
        paddingRight: HEADER_MOBILE_PADDING_X_PX,
      }}
    >
      <div
        aria-hidden
        className="col-start-1 row-start-1 flex flex-col justify-end self-stretch"
      >
        <div
          className={headerPillClassName}
          style={{
            height: HEADER_MOBILE_PILL_HEIGHT_PX,
            opacity: showPill ? 1 : 0,
            ...headerPillTransitionStyle,
          }}
        />
      </div>

      <div
        className={`relative z-10 col-start-1 row-start-1 flex flex-col self-stretch transition-[padding] ease-out ${
          showPill ? 'justify-end' : ''
        }`}
        style={{
          paddingTop: showPill ? 0 : HEADER_MOBILE_NAV_TOP_INSET_PX,
          ...headerPillTransitionStyle,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ height: contentBandHeightPx }}
        >
          <BrandLogoLink
            size="mobile"
            className="transition-transform ease-out"
            style={{
              transform: showPill
                ? `translateX(${HEADER_MOBILE_PILL_LOGO_INSET_PX}px)`
                : 'translateX(0)',
              ...headerPillTransitionStyle,
            }}
          />
          <HeaderMobileActions showPill={showPill} />
        </div>
      </div>
    </div>
  );
}

function DesktopHeaderBar({ showPill }: { showPill: boolean }) {
  return (
    <div className="relative hidden w-full lg:block">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center"
      >
        <HomeContentHorizontalFrame>
          <HomeSectionContent>
            <div
              className={headerPillClassName}
              style={{
                height: HEADER_PILL_SHELL_HEIGHT_PX,
                opacity: showPill ? 1 : 0,
                transitionDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
              }}
            />
          </HomeSectionContent>
        </HomeContentHorizontalFrame>
      </div>

      <div
        className="relative z-10 flex w-full items-center"
        style={{
          ...headerInsetStyle,
          paddingTop: HEADER_DESKTOP_ROW_PADDING_Y_PX,
          paddingBottom: HEADER_DESKTOP_ROW_PADDING_Y_PX,
        }}
      >
        <HeaderDesktopNav />
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
      <MobileHeaderBar showPill={isScrolled} />
      <DesktopHeaderBar showPill={isScrolled} />
    </header>
  );
}
