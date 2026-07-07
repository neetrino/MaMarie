import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getServerLanguage } from '../../lib/language-server';
import { t } from '../../lib/i18n';
import { BrandFilter } from '../../components/BrandFilter';
import { ColorFilter } from '../../components/ColorFilter';
import { MobileFiltersDrawer } from '../../components/MobileFiltersDrawer';
import { PriceFilter } from '../../components/PriceFilter';
import { ProductsFiltersProviderBridge } from '../../components/products/ProductsFiltersProviderBridge';
import { ProductsHeader } from '../../components/ProductsHeader';
import { SizeFilter } from '../../components/SizeFilter';
import { ProductsBreadcrumb } from '../../components/products/ProductsBreadcrumb';
import { ProductsCatalogMobileTitle } from '../../components/products/ProductsCatalogMobileTitle';
import { ProductsCatalogGridSection } from '../../components/products/ProductsCatalogGridSection';
import { MobileProductsCatalogTrack } from '../../components/products/MobileProductsCatalogTrack';
import { ProductsCatalogProvider } from '../../components/products/ProductsCatalogProvider';
import { ProductsFilterSidebar } from '../../components/products/ProductsFilterSidebar';
import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from '../../components/home/HomeSectionShell';
import { MOBILE_FILTERS_EVENT } from '../../lib/events';
import { logger } from '../../lib/utils/logger';
import { getStorefrontProductsListForCatalog } from '../../lib/services/storefront-products-list-loader';
import { getStorefrontProductsFiltersForCatalog } from '../../lib/services/storefront-products-filters-loader';
import type { ProductsFiltersData } from '../../components/ProductsFiltersProvider';
import {
  PRODUCTS_CATALOG_VIEW_MODE_COOKIE,
  resolveCatalogLimitFromViewMode,
  resolveInitialProductsCatalogViewMode,
} from '../../lib/products-catalog-view-mode';
import {
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_TOP_ROW_PB_PX,
} from '../../constants/products-catalog';
import { MOBILE_PRODUCTS_CATALOG_TITLE_TO_FILTERS_GAP_PX } from '../../constants/mobile-products-catalog';
import {
  parseProductsCatalogParams,
} from '../../lib/products-catalog-params';
import type {
  ProductsCatalogProduct,
  ProductsCatalogResponse,
} from './products-catalog-types';

function hasExplicitLimitParam(
  rawParams: Record<string, string | string[] | undefined>
): boolean {
  const limit = rawParams.limit;
  return typeof limit === 'string' && limit.trim().length > 0;
}

function parseOptionalPrice(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toInitialFilters(
  result: Awaited<ReturnType<typeof getStorefrontProductsFiltersForCatalog>> | null
): ProductsFiltersData | null {
  if (!result) {
    return null;
  }
  return {
    colors: result.colors ?? [],
    sizes: result.sizes ?? [],
    brands: result.brands ?? [],
    priceRange: result.priceRange ?? {
      min: 0,
      max: 100000,
      stepSize: null,
      stepSizePerCurrency: null,
    },
  };
}

function buildCatalogParams(
  rawParams: Record<string, string | string[] | undefined>,
  initialViewMode: ReturnType<typeof resolveInitialProductsCatalogViewMode>
) {
  const catalogParams = parseProductsCatalogParams(rawParams);
  if (hasExplicitLimitParam(rawParams)) {
    return catalogParams;
  }
  return {
    ...catalogParams,
    limit: resolveCatalogLimitFromViewMode(initialViewMode),
  };
}

async function getProducts(
  params: ReturnType<typeof parseProductsCatalogParams>,
  language: string
): Promise<ProductsCatalogResponse> {
  try {
    const response = await getStorefrontProductsListForCatalog(params, language);
    if (!Array.isArray(response.data)) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: params.limit, totalPages: 0 },
      };
    }

    return response as ProductsCatalogResponse;
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
  const cookieStore = await cookies();
  const initialViewMode = resolveInitialProductsCatalogViewMode(
    cookieStore.get(PRODUCTS_CATALOG_VIEW_MODE_COOKIE)?.value
  );
  const catalogParams = buildCatalogParams(rawParams, initialViewMode);
  const language = await getServerLanguage();

  const filtersInput = {
    lang: language,
    category: catalogParams.category,
    search: catalogParams.search,
    minPrice: parseOptionalPrice(catalogParams.minPrice),
    maxPrice: parseOptionalPrice(catalogParams.maxPrice),
  };

  const [productsData, filtersData] = await Promise.all([
    getProducts(catalogParams, language),
    getStorefrontProductsFiltersForCatalog(filtersInput).catch(() => null),
  ]);

  const normalizedProducts = productsData.data.map(normalizeProduct);
  const initialFilters = toInitialFilters(filtersData);

  return (
    <HomeContentHorizontalFrame>
      <HomeSectionContent>
        <MobileProductsCatalogTrack
          className="flex flex-col pt-2 pb-4 lg:hidden"
          style={{ gap: MOBILE_PRODUCTS_CATALOG_TITLE_TO_FILTERS_GAP_PX }}
        >
          <ProductsCatalogMobileTitle />
          <ProductsHeader />
        </MobileProductsCatalogTrack>

        <ProductsCatalogProvider
          initialParams={catalogParams}
          initialProducts={normalizedProducts}
          initialMeta={productsData.meta}
          initialViewMode={initialViewMode}
        >
          <ProductsFiltersProviderBridge initialFilters={initialFilters}>
            <div className="flex w-full flex-col items-start lg:flex-row" style={{ gap: PRODUCTS_CATALOG_MAIN_GAP_PX }}>
              <ProductsFilterSidebar />

              <div className="min-w-0 w-full flex-1 max-lg:overflow-visible">
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
