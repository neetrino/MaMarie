'use client';

import { useTranslation } from '../../lib/i18n-client';
import {
  PRODUCTS_CATALOG_MOBILE_TITLE_COLOR,
  PRODUCTS_CATALOG_MOBILE_TITLE_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_MOBILE_TITLE_SIZE_PX,
} from '../../constants/products-catalog';

/** Mobile shop page title — Figma pink heading without breadcrumb. */
export function ProductsCatalogMobileTitle() {
  const { t } = useTranslation();

  return (
    <h1
      className="font-black"
      style={{
        color: PRODUCTS_CATALOG_MOBILE_TITLE_COLOR,
        fontSize: PRODUCTS_CATALOG_MOBILE_TITLE_SIZE_PX,
        lineHeight: `${PRODUCTS_CATALOG_MOBILE_TITLE_LINE_HEIGHT_PX}px`,
      }}
    >
      {t('products.catalog.title')}
    </h1>
  );
}
