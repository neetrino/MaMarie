import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { getStoredLanguage } from '../../lib/language';
import { t } from '../../lib/i18n';
import { BrandFilter } from '../../components/BrandFilter';
import { ColorFilter } from '../../components/ColorFilter';
import { MobileFiltersDrawer } from '../../components/MobileFiltersDrawer';
import { PriceFilter } from '../../components/PriceFilter';
import { ProductsFiltersProviderBridge } from '../../components/products/ProductsFiltersProviderBridge';
import { ProductsHeader } from '../../components/ProductsHeader';
import { SizeFilter } from '../../components/SizeFilter';
import { ProductsBreadcrumb } from '../../components/products/ProductsBreadcrumb';
import { ProductsCatalogGridSection } from '../../components/products/ProductsCatalogGridSection';
import { ProductsCatalogProvider } from '../../components/products/ProductsCatalogProvider';
import { ProductsFilterSidebar } from '../../components/products/ProductsFilterSidebar';
import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from '../../components/home/HomeSectionShell';
import { MOBILE_FILTERS_EVENT } from '../../lib/events';
import { logger } from '../../lib/utils/logger';
import { productsService } from '../../lib/services/products.service';
import {
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_TOP_ROW_PB_PX,
} from '../../constants/products-catalog';
import {
  parseProductsCatalogParams,
} from '../../lib/products-catalog-params';
import type {
  ProductsCatalogProduct,
  ProductsCatalogResponse,
} from './products-catalog-types';

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
    brand?: string,
    clothingTypes?: string
  ): Promise<ProductsCatalogResponse> =>
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
      clothingTypes,
    }) as Promise<ProductsCatalogResponse>,
  ['products-catalog-db-v1'],
  { revalidate: PRODUCTS_LIST_REVALIDATE_SECONDS }
);

function parseOptionalPriceFromString(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function getProducts(params: ReturnType<typeof parseProductsCatalogParams>): Promise<ProductsCatalogResponse> {
  try {
    const language = getStoredLanguage();
    const response = await getProductsCached(
      params.page,
      params.limit,
      language,
      params.search,
      params.category,
      parseOptionalPriceFromString(params.minPrice),
      parseOptionalPriceFromString(params.maxPrice),
      params.colors,
      params.sizes,
      params.brand,
      params.clothingTypes
    );
    if (!Array.isArray(response.data)) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: params.limit, totalPages: 0 },
      };
    }

    return response;
  } catch (e) {
    logger.error('Product catalog fetch failed', e);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: params.limit, totalPages: 0 },
    };
  }
}

function normalizeProduct(product: ProductsCatalogProduct): ProductsCatalogProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? product.originalPrice ?? null,
    originalPrice: product.originalPrice ?? product.compareAtPrice ?? null,
    image: product.image ?? null,
    inStock: product.inStock ?? true,
    brand: product.brand ?? null,
    defaultVariantId: product.defaultVariantId ?? null,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    averageRating: typeof product.averageRating === 'number' ? product.averageRating : 0,
    reviewsCount: typeof product.reviewsCount === 'number' ? product.reviewsCount : 0,
    labels: product.labels ?? [],
  };
}

type SearchParamsInput = Record<string, string | string[] | undefined>;

export async function ProductsCatalog({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput> | SearchParamsInput;
}) {
  const rawParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const catalogParams = parseProductsCatalogParams(rawParams);
  const productsData = await getProducts(catalogParams);
  const normalizedProducts = productsData.data.map(normalizeProduct);
  const language = getStoredLanguage();

  return (
    <HomeContentHorizontalFrame>
      <HomeSectionContent>
        <div className="space-y-3 pt-2 pb-4 lg:hidden">
          <ProductsBreadcrumb />
          <ProductsHeader />
        </div>

        <ProductsCatalogProvider
          initialParams={catalogParams}
          initialProducts={normalizedProducts}
          initialMeta={productsData.meta}
        >
          <ProductsFiltersProviderBridge>
            <div className="flex flex-col items-start lg:flex-row" style={{ gap: PRODUCTS_CATALOG_MAIN_GAP_PX }}>
              <ProductsFilterSidebar />

              <div className="min-w-0 flex-1">
                <div
                  className="hidden items-center justify-between gap-4 lg:flex"
                  style={{ paddingBottom: PRODUCTS_CATALOG_TOP_ROW_PB_PX }}
                >
                  <ProductsBreadcrumb />
                  <ProductsHeader />
                </div>

                <ProductsCatalogGridSection />
              </div>
            </div>

            <MobileFiltersDrawer openEventName={MOBILE_FILTERS_EVENT}>
              <div className="space-y-6 p-4">
                <Suspense fallback={<div>{t(language, 'common.messages.loadingFilters')}</div>}>
                  <PriceFilter variant="catalog" />
                  <ColorFilter variant="catalog" />
                  <SizeFilter variant="catalog" />
                  <BrandFilter variant="catalog" />
                </Suspense>
              </div>
            </MobileFiltersDrawer>
          </ProductsFiltersProviderBridge>
        </ProductsCatalogProvider>
      </HomeSectionContent>
    </HomeContentHorizontalFrame>
  );
}
