'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { HEADER_NAV_ITEMS } from '../../constants/brand';

function resolveNavActive(
  label: string,
  pathname: string,
  hasCategoryFilter: boolean,
): boolean {
  if (label === 'Գլխավոր') return pathname === '/';
  if (label === 'Խանութ') {
    return pathname.startsWith('/products') && !hasCategoryFilter;
  }
  if (label === 'Կատեգորիաներ') {
    return pathname.startsWith('/products') && hasCategoryFilter;
  }
  if (label === 'Մեր Մասին') return pathname.startsWith('/about');
  if (label === 'Գործընկերներ') return pathname.startsWith('/about');
  if (label === 'Կապ') return pathname.startsWith('/contact');
  return false;
}

export function HeaderNavLinks() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const hasCategoryFilter = Boolean(searchParams?.get('category'));

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-6">
      {HEADER_NAV_ITEMS.map(({ href, label }) => {
        const active = resolveNavActive(label, pathname, hasCategoryFilter);

        return (
          <Link
            key={label}
            href={href}
            className={`whitespace-nowrap text-base leading-6 tracking-[-0.31px] transition-colors ${
              active
                ? 'font-bold text-brand-pink'
                : 'font-normal text-brand-brown hover:text-brand-pink'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
