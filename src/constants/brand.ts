/** MAMARIE brand colors from Figma design system. */
export const BRAND_COLORS = {
  pink: '#ef95aa',
  yellow: '#f9e490',
  brown: '#57423b',
  muted: '#4b5563',
  onPink: '#f5f5f5',
  sky: '#c2ddf9',
} as const;

/** Static brand assets exported from Figma. */
export const BRAND_ASSETS = {
  /** Figma MAMARIE-DEV node `1:162` — navbar clay wordmark. */
  logoNavbar: '/assets/brand/logo-inline.png',
  iconSearch: '/assets/brand/icon-search.svg',
  iconHeart: '/assets/brand/icon-heart.svg',
  iconCart: '/assets/brand/icon-cart.svg',
  iconChevron: '/assets/brand/icon-chevron.svg',
  /** Figma `51:335` — heroicons outline login. */
  iconLogin: '/assets/brand/icon-login.svg',
  /** Figma `74:731` — mobile navbar clay mark. */
  logoNavbarMobile: '/assets/brand/mobile/logo-navbar.png',
  /** Admin sidebar — stacked ma/marie clay wordmark. */
  logoAdminSidebar: '/assets/brand/logo-admin-sidebar.webp',
  /** Figma `74:729` — mobile navbar action icons. */
  iconLanguageMobile: '/assets/brand/mobile/icon-language.svg',
  iconMenuMobile: '/assets/brand/mobile/icon-menu.svg',
} as const;

/** Source art for navbar logo (`logo-inline.png`, Figma `1:162`). */
export const LOGO_NAVBAR_SOURCE_SIZE_PX = 1254;

/** Intrinsic dimensions for Next.js `Image`. */
export const LOGO_WIDTH_PX = LOGO_NAVBAR_SOURCE_SIZE_PX;
export const LOGO_HEIGHT_PX = LOGO_NAVBAR_SOURCE_SIZE_PX;

/** Navbar display height — full wordmark visible via `object-contain`. */
export const LOGO_HEADER_HEIGHT_PX = 120;

/** Square source — display width matches height. */
export function logoNavbarWidthForHeight(heightPx: number): number {
  return heightPx;
}

export const LOGO_HEADER_WIDTH_PX = logoNavbarWidthForHeight(LOGO_HEADER_HEIGHT_PX);

/** Desktop navbar horizontal inset (Figma). */
export const HEADER_PADDING_LEFT_PX = 87;
export const HEADER_PADDING_RIGHT_PX = 93;

/** Nav link typography (Montserrat arm). */
export const HEADER_NAV_FONT_SIZE_PX = 17;
export const HEADER_NAV_LINE_HEIGHT_PX = 26;
export const HEADER_NAV_LETTER_SPACING_PX = -0.31;
export const HEADER_NAV_LINK_GAP_PX = 24;

/** Gap between right-side navbar pills (search / language / currency). */
export const HEADER_ACTIONS_GAP_PX = 10;

export {
  getNavLinkTranslationKey as getHeaderNavTranslationKey,
  isNavLinkActive,
  NAV_LINKS as HEADER_NAV_ITEMS,
  type NavLinkItem as HeaderNavItem,
  type NavLinkKey as HeaderNavKey,
} from './nav-links';
