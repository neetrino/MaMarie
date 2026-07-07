/** i18n keys under `common.navigation.*` */
export type NavLinkKey = 'home' | 'catalog' | 'about' | 'stores' | 'contact';

export interface NavLinkItem {
  href: string;
  labelKey: NavLinkKey;
}

/** Primary site navigation — labels from locale files. */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/products', labelKey: 'catalog' },
  { href: '/about', labelKey: 'about' },
  { href: '/stores', labelKey: 'stores' },
  { href: '/contact', labelKey: 'contact' },
] as const;

/** Mobile menu bottom CTA — label from `common.buttons.shopNow`. */
export const MOBILE_MENU_CTA = {
  href: '/products',
  translationKey: 'common.buttons.shopNow',
} as const;

/** Maps nav item to translation path in locale files. */
export function getNavLinkTranslationKey(labelKey: NavLinkKey): string {
  return `common.navigation.${labelKey}`;
}

/** Whether a nav link should render as the active route. */
export function isNavLinkActive(labelKey: NavLinkKey, pathname: string): boolean {
  if (labelKey === 'home') {
    return pathname === '/';
  }
  if (labelKey === 'catalog') {
    return pathname.startsWith('/products');
  }
  if (labelKey === 'about') {
    return pathname.startsWith('/about');
  }
  if (labelKey === 'stores') {
    return pathname.startsWith('/stores');
  }
  if (labelKey === 'contact') {
    return pathname.startsWith('/contact');
  }
  return false;
}
