'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { HEADER_NAV_ITEMS, type HeaderNavKey, getHeaderNavTranslationKey } from '../../constants/brand';
import { useTranslation } from '../../lib/i18n-client';

function resolveNavActive(
  labelKey: HeaderNavKey,
  pathname: string,
  hasCategoryFilter: boolean,
): boolean {
  if (labelKey === 'home') return pathname === '/';
  if (labelKey === 'shop') {
    return pathname.startsWith('/products') && !hasCategoryFilter;
  }
  if (labelKey === 'categories') {
    return pathname.startsWith('/products') && hasCategoryFilter;
  }
  if (labelKey === 'about') return pathname.startsWith('/about');
  if (labelKey === 'partners') return pathname.startsWith('/about');
  if (labelKey === 'contact') return pathname.startsWith('/contact');
  return false;
}

export function HeaderNavLinks() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const hasCategoryFilter = Boolean(searchParams?.get('category'));

  return (
    <nav aria-label={t('common.navigation.mainNavigation')} className="flex items-center gap-6">
      {HEADER_NAV_ITEMS.map(({ href, labelKey }) => {
        const active = resolveNavActive(labelKey, pathname, hasCategoryFilter);

        return (
          <Link
            key={labelKey}
            href={href}
            className={`whitespace-nowrap text-base leading-6 tracking-[-0.31px] transition-colors ${
              active
                ? 'font-bold text-brand-pink'
                : 'font-normal text-brand-brown hover:text-brand-pink'
            }`}
          >
            {t(getHeaderNavTranslationKey(labelKey))}
          </Link>
        );
      })}
    </nav>
  );
}
