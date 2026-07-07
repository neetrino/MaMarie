import { assertPostgresDatabaseUrlConfigured } from "@white-shop/db/env";
import { NextRequest, NextResponse } from "next/server";
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from "@/lib/cache/storefront-cache";
import { apiRouteErrorResponse, buildApiRouteErrorContext } from "@/lib/http/api-route-errors";
import { partnerStoresService } from "@/lib/services/partner-stores.service";

/**
 * GET /api/v1/partner-stores
 * Published partner stores for the storefront.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "hy";
    const cacheKey = STOREFRONT_CACHE_KEYS.partnerStores(lang);

    const cached = await readJsonCache<unknown>(cacheKey);
    if (cached !== null) {
      return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
    }

    assertPostgresDatabaseUrlConfigured();
    const result = await partnerStoresService.getPublishedPartnerStores(lang);
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.partnerStores, result);

    return NextResponse.json(result, { headers: { "X-Cache": "MISS" } });
  } catch (error: unknown) {
    return apiRouteErrorResponse(req, error, "[PARTNER STORES]", buildApiRouteErrorContext(req));
  }
}
