'use client';

import { usePathname } from 'next/navigation';
import { MobileBottomNavBar } from './mobile-bottom-nav/MobileBottomNavBar';

const HIDDEN_PREFIXES = ['/supersudo'] as const;

function shouldHideMobileBottomNav(pathname: string): boolean {
  return HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Fixed mobile bottom nav on all public routes (hidden on admin). */
export function ConditionalMobileBottomNav() {
  const pathname = usePathname() ?? '';

  if (shouldHideMobileBottomNav(pathname)) {
    return null;
  }

  return <MobileBottomNavBar />;
}
