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
  /** Document title i18n key — same as page / sheet heading. */
  labelKey: string;
  titleKey: string;
  href: string;
}

/**
 * Mobile policies hub list — same order/hrefs as footer.
 * `labelKey` === document page title so hub / footer / page / sheet always match.
 * Do not import `footer.ts` here (circular dep via brand → nav-links → this file).
 */
export const LEGAL_POLICY_ITEMS: readonly LegalPolicyListItem[] = [
  {
    key: 'privacy',
    labelKey: 'privacy.title',
    titleKey: 'privacy.title',
    href: '/privacy',
  },
  {
    key: 'terms',
    labelKey: 'terms.title',
    titleKey: 'terms.title',
    href: '/terms',
  },
  {
    key: 'refund',
    labelKey: 'refund-policy.title',
    titleKey: 'refund-policy.title',
    href: '/refund-policy',
  },
  {
    key: 'delivery',
    labelKey: 'delivery-terms.title',
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
