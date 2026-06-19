/** MAMARIE brand colors from Figma design system. */
export const BRAND_COLORS = {
  pink: '#ef95aa',
  yellow: '#f9e490',
  brown: '#57423b',
  muted: '#4b5563',
  onPink: '#f5f5f5',
} as const;

/** Static brand assets exported from Figma. */
export const BRAND_ASSETS = {
  logo: '/assets/brand/logo.png',
  iconSearch: '/assets/brand/icon-search.svg',
  iconHeart: '/assets/brand/icon-heart.svg',
  iconCart: '/assets/brand/icon-cart.svg',
  iconChevron: '/assets/brand/icon-chevron.svg',
} as const;

/** Source logo dimensions (`logo.png`). */
export const LOGO_SOURCE_WIDTH_PX = 666;
export const LOGO_SOURCE_HEIGHT_PX = 375;

/** Intrinsic dimensions for Next.js `Image`. */
export const LOGO_WIDTH_PX = LOGO_SOURCE_WIDTH_PX;
export const LOGO_HEIGHT_PX = LOGO_SOURCE_HEIGHT_PX;

/** Navbar logo display height (Figma header). */
export const LOGO_HEADER_HEIGHT_PX = 76;

/** Width for a given logo display height, preserving aspect ratio. */
export function logoWidthForHeight(heightPx: number): number {
  return Math.round((heightPx * LOGO_SOURCE_WIDTH_PX) / LOGO_SOURCE_HEIGHT_PX);
}

export const LOGO_HEADER_WIDTH_PX = logoWidthForHeight(LOGO_HEADER_HEIGHT_PX);

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

/** i18n keys under `common.navigation.*` */
export type HeaderNavKey = 'home' | 'shop' | 'categories' | 'about' | 'partners' | 'contact';

export interface HeaderNavItem {
  href: string;
  labelKey: HeaderNavKey;
}

/** Primary desktop navbar links — labels come from locale files. */
export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/products', labelKey: 'shop' },
  { href: '/products', labelKey: 'categories' },
  { href: '/about', labelKey: 'about' },
  { href: '/about', labelKey: 'partners' },
  { href: '/contact', labelKey: 'contact' },
];

/** Maps nav item to translation path in common.json */
export function getHeaderNavTranslationKey(labelKey: HeaderNavKey): string {
  return `common.navigation.${labelKey}`;
}
