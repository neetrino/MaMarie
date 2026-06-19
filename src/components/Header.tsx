import { BrandLogoLink } from './BrandLogoLink';
import { HeaderActionIcons } from './header/HeaderActionIcons';
import { HeaderCurrencyPill } from './header/HeaderCurrencyPill';
import { HeaderLanguagePill } from './header/HeaderLanguagePill';
import { HeaderNavLinks } from './header/HeaderNavLinks';
import { Suspense } from 'react';
import {
  HEADER_ACTIONS_GAP_PX,
  HEADER_PADDING_LEFT_PX,
  HEADER_PADDING_RIGHT_PX,
} from '../constants/brand';

const headerInsetStyle = {
  paddingLeft: HEADER_PADDING_LEFT_PX,
  paddingRight: HEADER_PADDING_RIGHT_PX,
} as const;

function HeaderDesktopNav() {
  return (
    <div className="hidden w-full items-center py-3 lg:flex" style={headerInsetStyle}>
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
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex h-16 w-full items-center lg:hidden" style={headerInsetStyle}>
        <BrandLogoLink size="mobile" />
      </div>

      <HeaderDesktopNav />
    </header>
  );
}
