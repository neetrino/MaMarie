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

export const LOGO_WIDTH_PX = 78;
export const LOGO_HEIGHT_PX = 89;

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
