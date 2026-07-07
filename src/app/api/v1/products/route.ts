import { assertPostgresDatabaseUrlConfigured } from "@white-shop/db/env";
import { NextRequest, NextResponse } from "next/server";
import {
  STOREFRONT_CACHE_KEYS,
  readJsonCache,
} from "@/lib/cache/storefront-cache";
import { apiRouteErrorResponse, buildApiRouteErrorContext } from "@/lib/http/api-route-errors";
import {
  buildStorefrontProductsListCacheKey,
  getStorefrontProductsList,
  parseProductListFiltersFromSearchParams,
} from "@/lib/services/storefront-products-list-loader";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stableKey = buildStorefrontProductsListCacheKey(searchParams);
    const cacheKey = STOREFRONT_CACHE_KEYS.productsList(stableKey);
    const cached = await readJsonCache<unknown>(cacheKey);
    if (cached !== null) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const filters = parseProductListFiltersFromSearchParams(searchParams);
    filters.limit = Math.min(filters.limit ?? 12, 200);

    assertPostgresDatabaseUrlConfigured();
    const result = await getStorefrontProductsList(filters);

    return NextResponse.json(result, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error: unknown) {
    return apiRouteErrorResponse(req, error, "[PRODUCTS]", buildApiRouteErrorContext(req));
  }
}
