/** Shared Tailwind classes: desktop admin sidebar flush to the viewport left edge. */
export const ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP =
  'lg:hidden mb-6 shrink-0 px-4 pt-8 sm:px-6 lg:pt-0';

/** Width is set in `AdminSidebar` (expanded vs collapsed). */
export const ADMIN_SIDEBAR_ASIDE =
  'hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:shrink-0 lg:flex-col border-r border-gray-200 bg-white transition-[width] duration-200 ease-out';

export const ADMIN_SIDEBAR_NAV =
  'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain py-6 px-2 space-y-1';

/** Desktop: sidebar sticky; page scrolls on `body` only (no nested main-column scroll). */
export const ADMIN_PAGE_SHELL =
  'flex min-h-screen flex-col bg-gray-50 lg:flex-row';

export const ADMIN_MAIN_COLUMN =
  'min-w-0 flex-1 pt-12 pb-8 px-4 sm:px-6 lg:px-8';

export const ADMIN_MAIN_INNER = 'max-w-7xl mx-auto w-full';
