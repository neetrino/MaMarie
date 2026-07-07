import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, requireAdmin } from "@/lib/middleware/auth";
import { adminService } from "@/lib/services/admin.service";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/v1/admin/partner-stores
 * List partner stores for admin.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/forbidden",
          title: "Forbidden",
          status: 403,
          detail: "Admin access required",
          instance: req.url,
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("lang") || "en";
    const result = await adminService.getPartnerStores(locale);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { type?: string; title?: string; status?: number; detail?: string; message?: string };
    console.error("❌ [ADMIN PARTNER STORES] GET Error:", error);
    return NextResponse.json(
      {
        type: err.type || "https://api.shop.am/problems/internal-error",
        title: err.title || "Internal Server Error",
        status: err.status || 500,
        detail: err.detail || err.message || "An error occurred",
        instance: req.url,
      },
      { status: err.status || 500 },
    );
  }
}

/**
 * POST /api/v1/admin/partner-stores
 * Create a partner store.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/forbidden",
          title: "Forbidden",
          status: 403,
          detail: "Admin access required",
          instance: req.url,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    logger.debug("📤 [ADMIN PARTNER STORES] POST request:", body);
    const result = await adminService.createPartnerStore(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const err = error as { type?: string; title?: string; status?: number; detail?: string; message?: string };
    console.error("❌ [ADMIN PARTNER STORES] POST Error:", error);
    return NextResponse.json(
      {
        type: err.type || "https://api.shop.am/problems/internal-error",
        title: err.title || "Internal Server Error",
        status: err.status || 500,
        detail: err.detail || err.message || "An error occurred",
        instance: req.url,
      },
      { status: err.status || 500 },
    );
  }
}
