import { NextRequest, NextResponse } from 'next/server';
import { initAmeriabankPayment } from '@/lib/payments/ameriabank/init-payment';
import { toApiError } from '@/lib/types/errors';
import { logger } from '@/lib/utils/logger';

type InitBody = {
  orderId?: string;
};

/**
 * POST /api/v1/payments/ameriabank/init
 * Body: { orderId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InitBody;
    const orderId = body.orderId?.trim();
    if (!orderId) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          detail: 'orderId is required',
          status: 400,
        },
        { status: 400 }
      );
    }

    const result = await initAmeriabankPayment(orderId);
    return NextResponse.json({
      redirectUrl: result.paymentUrl,
      paymentId: result.paymentId,
    });
  } catch (error: unknown) {
    logger.error('Ameriabank init route error', { error });
    const apiError = toApiError(error, req.url);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
