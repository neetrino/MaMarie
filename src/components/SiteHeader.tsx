'use client';

import { Suspense, useId, useState } from 'react';
import {
  HEADER_ACTIONS_GAP_PX,
} from '../constants/brand';
import {
  HEADER_DESKTOP_ROW_PADDING_Y_PX,
  HEADER_HOME_OFFSET_Y_PX,
  HEADER_HOME_OVERLAY_TOP_PX,
  HEADER_MOBILE_NAV_BAND_HEIGHT_PX,
  HEADER_MOBILE_NAV_ROW_HEIGHT_PX,
  HEADER_MOBILE_NAV_TOP_INSET_PX,
  HEADER_MOBILE_PADDING_X_PX,
  HEADER_MOBILE_Z_INDEX,
  HEADER_MOBILE_PILL_CONTENT_INSET_PX,
  HEADER_MOBILE_PILL_HEIGHT_PX,
  HEADER_MOBILE_PILL_LOGO_INSET_PX,
  HEADER_PILL_APPEAR_DURATION_MS,
  HEADER_PILL_SHELL_HEIGHT_PX,
} from '../constants/header';
import type { NavLinkItem } from '../constants/nav-links';
import { BrandLogoLink } from './BrandLogoLink';
import { DesktopFluidFrame } from './DesktopFluidFrame';
import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from './home/HomeSectionShell';
import { HeaderActionIcons } from './header/HeaderActionIcons';
import { HeaderContentFrame } from './header/HeaderContentFrame';
import { HeaderCurrencyPill } from './header/HeaderCurrencyPill';
import { HeaderLanguagePill } from './header/HeaderLanguagePill';
import { HeaderLoginPill } from './header/HeaderLoginPill';
import { HeaderMobileActions } from './header/HeaderMobileActions';
import { HeaderNavLinks } from './header/HeaderNavLinks';
import { MobileMenuModal } from './header/MobileMenuModal';
import { useHeaderScrolled } from './header/useHomeHeaderScrolled';

export interface SiteHeaderProps {
  navLinks: readonly NavLinkItem[];
}

const headerPillTransitionStyle = {
  transitionDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
} as const;

const headerPillClassName =
  'w-full rounded-full bg-white shadow-[0_4px_24px_rgba(87,66,59,0.12)] transition-opacity ease-out';

function HeaderDesktopNav({ navLinks }: { navLinks: readonly NavLinkItem[] }) {
  return (
    <>
      <BrandLogoLink className="shrink-0" />

      <div className="flex min-w-0 flex-1 items-center justify-center">
        <Suspense fallback={<nav aria-hidden className="h-6 shrink-0" />}>
          <HeaderNavLinks navLinks={navLinks} />
        </Suspense>
      </div>

      <div
        className="flex shrink-0 items-center overflow-visible"
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

interface MobileHeaderBarProps {
  showPill: boolean;
  navLinks: readonly NavLinkItem[];
  menuOpen: boolean;
  menuId: string;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

/** Mobile navbar — Figma `74:729`: logo/actions band, search sits below in hero. */
function MobileHeaderBar({
  showPill,
  navLinks,
  menuOpen,
  menuId,
  onMenuToggle,
  onMenuClose,
}: MobileHeaderBarProps) {
  const contentBandHeightPx = showPill
    ? HEADER_MOBILE_PILL_HEIGHT_PX
    : HEADER_MOBILE_NAV_BAND_HEIGHT_PX;

  return (
    <>
      <div
        className="pointer-events-none grid w-full lg:hidden"
        style={{
          height: HEADER_MOBILE_NAV_ROW_HEIGHT_PX,
          paddingLeft: HEADER_MOBILE_PADDING_X_PX,
          paddingRight: HEADER_MOBILE_PADDING_X_PX,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none col-start-1 row-start-1 flex flex-col justify-end self-stretch"
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
          className={`pointer-events-auto relative z-20 col-start-1 row-start-1 flex flex-col self-stretch transition-[padding] ease-out ${
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
            <HeaderMobileActions
              showPill={showPill}
              menuOpen={menuOpen}
              menuId={menuId}
              onMenuToggle={onMenuToggle}
            />
          </div>
        </div>
      </div>

      <MobileMenuModal
        isOpen={menuOpen}
        onClose={onMenuClose}
        navLinks={navLinks}
        menuId={menuId}
      />
    </>
  );
}

function DesktopHeaderBar({
  showPill,
  navLinks,
}: {
  showPill: boolean;
  navLinks: readonly NavLinkItem[];
}) {
  return (
    <div className="relative w-full overflow-visible">
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

      <HeaderContentFrame
        className="pointer-events-auto relative z-10 flex w-full items-center overflow-visible"
        style={{
          paddingTop: HEADER_DESKTOP_ROW_PADDING_Y_PX,
          paddingBottom: HEADER_DESKTOP_ROW_PADDING_Y_PX,
        }}
      >
        <HeaderDesktopNav navLinks={navLinks} />
      </HeaderContentFrame>
    </div>
  );
}

export function SiteHeader({ navLinks }: SiteHeaderProps) {
  const isScrolled = useHeaderScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillFrozen, setPillFrozen] = useState<boolean | null>(null);
  const menuId = useId();

  const showPill = pillFrozen ?? isScrolled;

  const handleMenuToggle = () => {
    setMenuOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) {
        setPillFrozen(isScrolled);
      } else {
        setPillFrozen(null);
      }
      return nextOpen;
    });
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setPillFrozen(null);
  };

  return (
    <header
      data-site-header
      className="fixed left-0 right-0 top-0 w-full overflow-visible bg-transparent"
      style={{
        zIndex: HEADER_MOBILE_Z_INDEX,
        paddingTop: HEADER_HOME_OVERLAY_TOP_PX,
        transform: `translateY(${HEADER_HOME_OFFSET_Y_PX}px)`,
      }}
    >
      <MobileHeaderBar
        showPill={showPill}
        navLinks={navLinks}
        menuOpen={menuOpen}
        menuId={menuId}
        onMenuToggle={handleMenuToggle}
        onMenuClose={handleMenuClose}
      />
      <DesktopFluidFrame allowOverflow className="hidden lg:flex">
        <DesktopHeaderBar showPill={isScrolled} navLinks={navLinks} />
      </DesktopFluidFrame>
    </header>
  );
}
