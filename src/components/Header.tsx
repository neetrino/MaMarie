import { BrandLogoLink } from './BrandLogoLink';
import { HeaderActionIcons } from './header/HeaderActionIcons';
import { HeaderCurrencyPill } from './header/HeaderCurrencyPill';
import { HeaderLanguagePill } from './header/HeaderLanguagePill';
import { HeaderNavLinks } from './header/HeaderNavLinks';
import { Suspense } from 'react';

function HeaderDesktopNav() {
  return (
    <div className="mx-auto hidden max-w-[1440px] items-center gap-[71px] px-8 py-3 lg:flex">
      <BrandLogoLink />

      <div className="min-w-0 flex-1">
        <Suspense fallback={<nav aria-hidden className="h-6" />}>
          <HeaderNavLinks />
        </Suspense>
      </div>

      <div className="flex shrink-0 items-center gap-[5px]">
        <HeaderActionIcons />
        <HeaderLanguagePill />
        <HeaderCurrencyPill />
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 items-center px-4 sm:px-6 lg:hidden">
        <BrandLogoLink size="mobile" />
      </div>

      <HeaderDesktopNav />
    </header>
  );
}
