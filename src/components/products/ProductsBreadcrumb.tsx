'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import {
  PRODUCTS_CATALOG_BREADCRUMB_MUTED,
  PRODUCTS_CATALOG_TEXT_DARK,
} from '../../constants/products-catalog';

export function ProductsBreadcrumb() {
  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex items-center"
        style={{
          color: PRODUCTS_CATALOG_BREADCRUMB_MUTED,
          fontSize: 16,
          lineHeight: '30px',
        }}
      >
        <li>
          <Link
            href="/"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: PRODUCTS_CATALOG_BREADCRUMB_MUTED }}
          >
            {t('common.navigation.home')}
          </Link>
        </li>
        <li aria-hidden className="px-1">
          /
        </li>
        <li>
          <span className="font-bold" style={{ color: PRODUCTS_CATALOG_TEXT_DARK }}>
            {t('products.catalog.title')}
          </span>
        </li>
      </ol>
    </nav>
  );
}
