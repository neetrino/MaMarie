import { Suspense } from 'react';
import {
  PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX,
  PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX,
} from '../../constants/products-catalog';
import { ProductsCatalog } from './ProductsCatalog';
import { ProductsCatalogSkeleton } from './ProductsCatalogSkeleton';

const catalogOffsetStyle = {
  ['--products-catalog-offset-mobile']: `${PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX}px`,
  ['--products-catalog-offset-desktop']: `${PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX}px`,
} as const;

/**
 * Shop catalog page — white canvas under transparent navbar, same pattern as home.
 */
export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div
      className="min-h-screen w-full max-w-full bg-white pb-16 pt-[var(--products-catalog-offset-mobile)] lg:pt-[var(--products-catalog-offset-desktop)]"
      style={catalogOffsetStyle}
    >
      <Suspense fallback={<ProductsCatalogSkeleton />}>
        <ProductsCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
