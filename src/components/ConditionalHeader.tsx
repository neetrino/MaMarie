'use client';

import { usePathname } from 'next/navigation';
import type { NavLinkItem } from '../constants/nav-links';
import { SiteHeader } from './SiteHeader';

interface ConditionalHeaderProps {
  navLinks: readonly NavLinkItem[];
  mobileNavLinks: readonly NavLinkItem[];
}

export function ConditionalHeader({ navLinks, mobileNavLinks }: ConditionalHeaderProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/supersudo') || pathname?.startsWith('/admin')) {
    return null;
  }
  if (pathname?.startsWith('/profile')) {
    return (
      <div className="profile-route-header">
        <SiteHeader navLinks={navLinks} mobileNavLinks={mobileNavLinks} />
      </div>
    );
  }
  return <SiteHeader navLinks={navLinks} mobileNavLinks={mobileNavLinks} />;
}
