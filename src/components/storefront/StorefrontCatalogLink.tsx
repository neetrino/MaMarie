'use client';

import type {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
  TouchEventHandler,
} from 'react';
import Link, { type LinkProps } from 'next/link';
import { mergeStorefrontCatalogPrefetchProps } from '../../lib/storefront/storefront-catalog-prefetch';

type StorefrontCatalogLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onFocus?: FocusEventHandler<HTMLAnchorElement>;
  onTouchStart?: TouchEventHandler<HTMLAnchorElement>;
};

/** Next.js `Link` with catalog list + filter API warm-up for `/products` routes. */
export function StorefrontCatalogLink({
  href,
  prefetch,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...rest
}: StorefrontCatalogLinkProps) {
  const prefetchProps = mergeStorefrontCatalogPrefetchProps(href, {
    prefetch,
    onMouseEnter,
    onFocus,
    onTouchStart,
  });

  return <Link href={href} {...rest} {...prefetchProps} />;
}
