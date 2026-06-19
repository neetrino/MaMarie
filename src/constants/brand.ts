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

export interface HeaderNavItem {
  href: string;
  label: string;
}

/** Primary desktop navbar links (Armenian labels from Figma). */
export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { href: '/', label: 'Գլխավոր' },
  { href: '/products', label: 'Խանութ' },
  { href: '/products', label: 'Կատեգորիաներ' },
  { href: '/about', label: 'Մեր Մասին' },
  { href: '/about', label: 'Գործընկերներ' },
  { href: '/contact', label: 'Կապ' },
];
