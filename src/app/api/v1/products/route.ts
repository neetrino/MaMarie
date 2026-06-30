import { assertPostgresDatabaseUrlConfigured } from "@white-shop/db/env";
import { NextRequest, NextResponse } from "next/server";
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from "@/lib/cache/storefront-cache";
import { apiRouteErrorResponse, buildApiRouteErrorContext } from "@/lib/http/api-route-errors";
import { buildProductsListCacheKey } from "@/lib/products-list-cache-key";
import { productsService } from "@/lib/services/products.service";

const FEATURED_CACHE_TTL = 600;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stableKey = buildProductsListCacheKey(searchParams);
    const cacheKey = STOREFRONT_CACHE_KEYS.productsList(stableKey);
    const cached = await readJsonCache<unknown>(cacheKey);
    if (cached !== null) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const idsParam = searchParams.get("ids");
    const ids = idsParam
      ? idsParam
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0)
      : undefined;

    const filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      ids,
      filter: searchParams.get("filter") || searchParams.get("filters") || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      colors: searchParams.get("colors") || undefined,
      sizes: searchParams.get("sizes") || undefined,
      brand: searchParams.get("brand") || undefined,
      clothingTypes: searchParams.get("clothingTypes") || undefined,
      sort: searchParams.get("sort") || "createdAt",
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1,
      limit: Math.min(
        searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 12,
        200
      ),
      lang: searchParams.get("lang") || "en",
    };

    assertPostgresDatabaseUrlConfigured();
    const result = await productsService.findAll(filters);

    const onlyFeatured =
      filters.filter &&
      ["new", "bestseller", "featured"].includes(filters.filter) &&
      !filters.category &&
      !filters.search &&
      (filters.limit ?? 12) <= 24;
    const ttl = onlyFeatured ? FEATURED_CACHE_TTL : STOREFRONT_CACHE_TTL.productsList;
    await writeJsonCache(cacheKey, ttl, result);

    return NextResponse.json(result, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error: unknown) {
    return apiRouteErrorResponse(req, error, "[PRODUCTS]", buildApiRouteErrorContext(req));
  }
}
