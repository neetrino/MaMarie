import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { getStoredLanguage } from '../../lib/language';
import { t } from '../../lib/i18n';
import { PriceFilter } from '../../components/PriceFilter';
import { ColorFilter } from '../../components/ColorFilter';
import { SizeFilter } from '../../components/SizeFilter';
import { BrandFilter } from '../../components/BrandFilter';
import { ProductsHeader } from '../../components/ProductsHeader';
import { ProductsGrid } from '../../components/ProductsGrid';
import { MobileFiltersDrawer } from '../../components/MobileFiltersDrawer';
import { ProductsFiltersProvider } from '../../components/ProductsFiltersProvider';
import { ProductsFilterSidebar } from '../../components/products/ProductsFilterSidebar';
import { MOBILE_FILTERS_EVENT } from '../../lib/events';
import { logger } from '../../lib/utils/logger';
import { productsService } from '../../lib/services/products.service';
import {
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_MAX_WIDTH_PX,
  PRODUCTS_CATALOG_PADDING_LEFT_PX,
  PRODUCTS_CATALOG_PADDING_RIGHT_PX,
} from '../../constants/products-catalog';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
  colors?: unknown[];
  labels?: Array<{
    id: string;
    type: 'text' | 'percentage';
    value: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string | null;
  }>;
  originalPrice?: number | null;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const PRODUCTS_LIST_REVALIDATE_SECONDS = 60;

const getProductsCached = unstable_cache(
  async (
    page: number,
    limit: number,
    lang: string,
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    colors?: string,
    sizes?: string,
    brand?: string
  ): Promise<ProductsResponse> =>
    productsService.findAll({
      page,
      limit,
      lang,
      search,
      category,
      minPrice,
      maxPrice,
      colors,
      sizes,
      brand,
    }) as Promise<ProductsResponse>,
  ['products-catalog-db-v1'],
  { revalidate: PRODUCTS_LIST_REVALIDATE_SECONDS }
);

function parseOptionalPrice(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function getProducts(
  page: number = 1,
  search?: string,
  category?: string,
  minPrice?: string,
  maxPrice?: string,
  colors?: string,
  sizes?: string,
  brand?: string,
  limit: number = 12
): Promise<ProductsResponse> {
  try {
    const language = getStoredLanguage();
    const response = await getProductsCached(
      page,
      limit,
      language,
      search?.trim() || undefined,
      category?.trim() || undefined,
      parseOptionalPrice(minPrice),
      parseOptionalPrice(maxPrice),
      colors?.trim() || undefined,
      sizes?.trim() || undefined,
      brand?.trim() || undefined
    );
    if (!Array.isArray(response.data)) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
      };
    }

    return response;
  } catch (e) {
    logger.error('Product catalog fetch failed', e);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
  }
}

type SearchParamsInput = Record<string, string | string[] | undefined>;

export async function ProductsCatalog({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput> | SearchParamsInput;
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const page = parseInt((params.page as string) || '1', 10);
  const limitParam = typeof params.limit === 'string' ? params.limit.trim() : '';
  const parsedLimit = limitParam && !Number.isNaN(parseInt(limitParam, 10))
    ? parseInt(limitParam, 10)
    : null;
  const perPage = parsedLimit ? Math.min(parsedLimit, 200) : 12;

  const productsData = await getProducts(
    page,
    typeof params.search === 'string' ? params.search : undefined,
    typeof params.category === 'string' ? params.category : undefined,
    typeof params.minPrice === 'string' ? params.minPrice : undefined,
    typeof params.maxPrice === 'string' ? params.maxPrice : undefined,
    typeof params.colors === 'string' ? params.colors : undefined,
    typeof params.sizes === 'string' ? params.sizes : undefined,
    typeof params.brand === 'string' ? params.brand : undefined,
    perPage
  );

  const normalizedProducts = productsData.data.map((p: Product) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? p.originalPrice ?? null,
    image: p.image ?? null,
    inStock: p.inStock ?? true,
    brand: p.brand ?? null,
    defaultVariantId: p.defaultVariantId ?? null,
    colors: Array.isArray(p.colors) ? p.colors : [],
    labels: p.labels ?? [],
  }));

  const colors = typeof params.colors === 'string' ? params.colors : undefined;
  const sizes = typeof params.sizes === 'string' ? params.sizes : undefined;
  const brands = typeof params.brand === 'string' ? params.brand : undefined;
  const selectedColors = colors ? colors.split(',').map((c: string) => c.trim().toLowerCase()) : [];
  const selectedSizes = sizes ? sizes.split(',').map((s: string) => s.trim()) : [];
  const selectedBrands = brands ? brands.split(',').map((b: string) => b.trim()) : [];

  const buildPaginationUrl = (num: number) => {
    const q = new URLSearchParams();
    q.set('page', num.toString());
    const currentLimit = params.limit ? String(params.limit) : '12';
    q.set('limit', currentLimit);
    Object.entries(params).forEach(([k, v]) => {
      if (k !== 'page' && k !== 'limit' && v && typeof v === 'string') q.set(k, v);
    });
    return `/products?${q.toString()}`;
  };

  const language = getStoredLanguage();
  const sortParam = typeof params.sort === 'string' ? params.sort : 'default';
  const loadMoreHref = page < productsData.meta.totalPages ? buildPaginationUrl(page + 1) : null;

  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: PRODUCTS_CATALOG_MAX_WIDTH_PX,
        paddingLeft: PRODUCTS_CATALOG_PADDING_LEFT_PX,
        paddingRight: PRODUCTS_CATALOG_PADDING_RIGHT_PX,
      }}
    >
      <ProductsHeader />

      <ProductsFiltersProvider
        category={typeof params.category === 'string' ? params.category : undefined}
        search={typeof params.search === 'string' ? params.search : undefined}
        minPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
        maxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
      >
        <div className="flex flex-col lg:flex-row" style={{ gap: PRODUCTS_CATALOG_MAIN_GAP_PX }}>
          <ProductsFilterSidebar
            category={typeof params.category === 'string' ? params.category : undefined}
            search={typeof params.search === 'string' ? params.search : undefined}
            minPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
            maxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
          />

          <div className="min-w-0 flex-1 py-2">
            {normalizedProducts.length > 0 ? (
              <ProductsGrid
                products={normalizedProducts}
                sortBy={sortParam}
                loadMoreHref={loadMoreHref}
              />
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-[#757571]">{t(language, 'common.messages.noProductsFound')}</p>
              </div>
            )}
          </div>
        </div>

        <MobileFiltersDrawer openEventName={MOBILE_FILTERS_EVENT}>
          <div className="space-y-6 p-4">
            <Suspense fallback={<div>{t(language, 'common.messages.loadingFilters')}</div>}>
              <PriceFilter
                currentMinPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
                currentMaxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
                category={typeof params.category === 'string' ? params.category : undefined}
                search={typeof params.search === 'string' ? params.search : undefined}
              />
              <ColorFilter
                category={typeof params.category === 'string' ? params.category : undefined}
                search={typeof params.search === 'string' ? params.search : undefined}
                minPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
                maxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
                selectedColors={selectedColors}
              />
              <SizeFilter
                category={typeof params.category === 'string' ? params.category : undefined}
                search={typeof params.search === 'string' ? params.search : undefined}
                minPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
                maxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
                selectedSizes={selectedSizes}
              />
              <BrandFilter
                category={typeof params.category === 'string' ? params.category : undefined}
                search={typeof params.search === 'string' ? params.search : undefined}
                minPrice={typeof params.minPrice === 'string' ? params.minPrice : undefined}
                maxPrice={typeof params.maxPrice === 'string' ? params.maxPrice : undefined}
                selectedBrands={selectedBrands}
              />
            </Suspense>
          </div>
        </MobileFiltersDrawer>
      </ProductsFiltersProvider>
    </div>
  );
}
