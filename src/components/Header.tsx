'use client';

import { BrandLogoLink } from './BrandLogoLink';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <BrandLogoLink />
      </div>
    </header>
  );
}
