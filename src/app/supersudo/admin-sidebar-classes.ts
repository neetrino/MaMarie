/** Admin sidebar widths — expanded/collapsed (matches legacy `lg:w-64` / `lg:w-16`). */
export const ADMIN_SIDEBAR_WIDTH_EXPANDED_PX = 256;
export const ADMIN_SIDEBAR_WIDTH_COLLAPSED_PX = 64;

/**
 * Desktop admin sidebar height — fill the scaled fluid stage
 * (`100dvh` breaks under DesktopFluidFrame zoom).
 */
export const ADMIN_SIDEBAR_HEIGHT = '100%';

/** Header row — admin clay wordmark (931×413 source, transparent). */
export const ADMIN_SIDEBAR_HEADER_LOGO_HEIGHT_PX = 36;
export const ADMIN_SIDEBAR_HEADER_LOGO_WIDTH_PX = 80;

/** Collapsed header — expand control only, centered in the rail. */
export const ADMIN_SIDEBAR_HEADER_COLLAPSED =
  'flex shrink-0 items-center justify-center border-b border-gray-100 px-2 py-2';

export const ADMIN_SIDEBAR_HEADER =
  'flex shrink-0 items-center border-b border-gray-100 px-3 py-3';

/** Centers logo in the space between the left edge and the collapse button. */
export const ADMIN_SIDEBAR_HEADER_LOGO_WRAP =
  'flex min-w-0 flex-1 items-center justify-center';

/** Shared Tailwind classes — left collapsible admin sidebar. */
export const ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP =
  'lg:hidden shrink-0 px-4 pt-4 pb-3 sm:px-6';

export const ADMIN_PAGE_SHELL =
  'admin-page-shell flex min-h-screen flex-col bg-[#faf8f5] lg:min-h-full lg:flex-1 lg:flex-row lg:items-stretch';

export const ADMIN_SIDEBAR_ASIDE =
  'admin-desktop-sidebar hidden lg:sticky lg:top-0 lg:flex lg:min-h-0 lg:shrink-0 lg:flex-col lg:overflow-hidden border-r border-gray-200/80 bg-white transition-[width] duration-200 ease-out';

export const ADMIN_SIDEBAR_NAV =
  'admin-sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain py-4';

export const ADMIN_SIDEBAR_FOOTER = 'shrink-0 border-t border-gray-100 py-3';

export const ADMIN_MAIN_COLUMN =
  'admin-main-column min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 lg:px-8 lg:py-8';

export const ADMIN_MAIN_INNER = 'mx-auto w-full max-w-7xl';
