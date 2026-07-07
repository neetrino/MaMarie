import { NextResponse } from "next/server";
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from "@/lib/cache/storefront-cache";
import { withServerReadCache } from "@/lib/cache/server-read-cache";
import { dedupeInflight } from "@/lib/cache/inflight-dedup";
import { adminService } from "@/lib/services/admin.service";
import { logger } from "@/lib/utils/logger";

const DEFAULT_RATES = {
  USD: 1,
  AMD: 400,
  EUR: 0.92,
  RUB: 90,
  GEL: 2.7,
} as const;

const CURRENCY_RATES_PROCESS_CACHE_TTL_MS = STOREFRONT_CACHE_TTL.currencyRates * 1_000;
const CURRENCY_RATES_CACHE_KEY = "public:currency-rates";

/**
 * Get currency exchange rates (public endpoint, in-process + optional Redis write).
 */
export async function GET() {
  try {
    const rates = await dedupeInflight(CURRENCY_RATES_CACHE_KEY, () =>
      withServerReadCache(
        CURRENCY_RATES_CACHE_KEY,
        CURRENCY_RATES_PROCESS_CACHE_TTL_MS,
        () => adminService.getCurrencyRates()
      )
    );

    void writeJsonCache(STOREFRONT_CACHE_KEYS.currencyRates(), STOREFRONT_CACHE_TTL.currencyRates, rates);

    return NextResponse.json(rates);
  } catch (error: unknown) {
    logger.error("[CURRENCY RATES] Error", error);
    return NextResponse.json({ ...DEFAULT_RATES });
  }
}
