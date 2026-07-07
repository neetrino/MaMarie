import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { adminService } from '@/lib/services/admin.service';
import { logger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

function parseLimit(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 50);
}

/**
 * GET /api/v1/admin/dashboard/summary
 * Aggregated dashboard payload (stats, recent orders, top products, user activity).
 */
export async function GET(req: NextRequest) {
  try {
    logger.debug('📊 [ADMIN DASHBOARD SUMMARY] Request received');
    const user = await authenticateToken(req);

    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/forbidden',
          title: 'Forbidden',
          status: 403,
          detail: 'Admin access required',
          instance: req.url,
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const result = await adminService.getDashboardSummary({
      recentOrdersLimit: parseLimit(searchParams.get('recentOrdersLimit'), 5),
      topProductsLimit: parseLimit(searchParams.get('topProductsLimit'), 5),
      userActivityLimit: parseLimit(searchParams.get('userActivityLimit'), 10),
    });

    logger.debug('✅ [ADMIN DASHBOARD SUMMARY] Data retrieved successfully');
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as {
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
      message?: string;
    };
    logger.error('[ADMIN DASHBOARD SUMMARY] Error', error);
    return NextResponse.json(
      {
        type: err.type || 'https://api.shop.am/problems/internal-error',
        title: err.title || 'Internal Server Error',
        status: err.status || 500,
        detail: err.detail || err.message || 'An error occurred',
        instance: req.url,
      },
      { status: err.status || 500 }
    );
  }
}
