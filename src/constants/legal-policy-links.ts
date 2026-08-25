/** Store policy documents for the legal hub (Grill.am-style sheet list). */

export const LEGAL_POLICY_KEYS = [
  'privacy',
  'terms',
  'refund',
  'delivery',
  'returns',
] as const;

export type LegalPolicyKey = (typeof LEGAL_POLICY_KEYS)[number];

export interface LegalPolicyListItem {
  key: LegalPolicyKey;
  labelKey: string;
  titleKey: string;
  href: string;
}

export const LEGAL_POLICY_ITEMS: readonly LegalPolicyListItem[] = [
  {
    key: 'privacy',
    labelKey: 'legal.links.privacy',
    titleKey: 'privacy.title',
    href: '/privacy',
  },
  {
    key: 'terms',
    labelKey: 'legal.links.terms',
    titleKey: 'terms.title',
    href: '/terms',
  },
  {
    key: 'refund',
    labelKey: 'legal.links.refund',
    titleKey: 'refund-policy.title',
    href: '/refund-policy',
  },
  {
    key: 'delivery',
    labelKey: 'legal.links.delivery',
    titleKey: 'delivery-terms.title',
    href: '/delivery-terms',
  },
  {
    key: 'returns',
    labelKey: 'legal.links.returns',
    titleKey: 'returns.title',
    href: '/returns',
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
