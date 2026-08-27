/** Store policy documents for the legal hub — same 4 items as footer policy column. */

export const LEGAL_POLICY_KEYS = [
  'privacy',
  'terms',
  'refund',
  'delivery',
] as const;

export type LegalPolicyKey = (typeof LEGAL_POLICY_KEYS)[number];

export interface LegalPolicyListItem {
  key: LegalPolicyKey;
  /** Same i18n keys as `FOOTER_POLICY_LINKS` so hub labels match the footer. */
  labelKey: string;
  titleKey: string;
  href: string;
}

/**
 * Mobile policies hub list — keep in sync with footer policy links
 * (`common.footer.*` labels, same order/hrefs). Do not import `footer.ts`
 * here: it creates a circular dependency via brand → nav-links → this file.
 */
export const LEGAL_POLICY_ITEMS: readonly LegalPolicyListItem[] = [
  {
    key: 'privacy',
    labelKey: 'common.footer.privacyPolicy',
    titleKey: 'privacy.title',
    href: '/privacy',
  },
  {
    key: 'terms',
    labelKey: 'common.footer.termsOfService',
    titleKey: 'terms.title',
    href: '/terms',
  },
  {
    key: 'refund',
    labelKey: 'common.footer.refundPolicy',
    titleKey: 'refund-policy.title',
    href: '/refund-policy',
  },
  {
    key: 'delivery',
    labelKey: 'common.footer.deliveryTerms',
    titleKey: 'delivery-terms.title',
    href: '/delivery-terms',
  },
] as const;

/** Path prefixes that highlight the mobile Policy nav item. */
export const LEGAL_POLICY_ACTIVE_PATH_PREFIXES = [
  '/legal',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/delivery-terms',
  '/returns',
] as const;

export function isLegalPolicyPath(pathname: string): boolean {
  return LEGAL_POLICY_ACTIVE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isLegalPolicyKey(value: string): value is LegalPolicyKey {
  return (LEGAL_POLICY_KEYS as readonly string[]).includes(value);
}
