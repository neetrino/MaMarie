'use client';

import { usePathname } from 'next/navigation';
import type { NavLinkItem } from '../constants/nav-links';
import { SiteHeader } from './SiteHeader';

interface ConditionalHeaderProps {
  navLinks: readonly NavLinkItem[];
}

export function ConditionalHeader({ navLinks }: ConditionalHeaderProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/supersudo')) {
    return null;
  }
  if (pathname?.startsWith('/profile')) {
    return (
      <div className="profile-route-header">
        <SiteHeader navLinks={navLinks} />
      </div>
    );
  }
  return <SiteHeader navLinks={navLinks} />;
}
