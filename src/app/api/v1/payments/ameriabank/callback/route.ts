import { NextRequest, NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/payments/app-url';
import { settleAmeriabankPayment } from '@/lib/payments/ameriabank/settle-payment';
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/v1/payments/ameriabank/callback
 * Bank BackURL redirect. Never trust query alone — always GetPaymentDetails.
 */
export async function GET(req: NextRequest) {
  const appUrl = (() => {
    try {
      return getAppUrl();
    } catch {
      return req.nextUrl.origin;
    }
  })();

  try {
    const paymentId =
      req.nextUrl.searchParams.get('paymentID') ??
      req.nextUrl.searchParams.get('paymentId');
    const opaque =
      req.nextUrl.searchParams.get('opaque') ??
      req.nextUrl.searchParams.get('Opaque');

    if (!paymentId) {
      logger.warn('Ameriabank callback missing paymentID');
      return NextResponse.redirect(`${appUrl}/checkout/fail`);
    }

    const result = await settleAmeriabankPayment({
      paymentId,
      opaqueOrderId: opaque,
    });

    if (result.success) {
      return NextResponse.redirect(
        `${appUrl}/checkout/success?order=${encodeURIComponent(result.orderNumber)}`
      );
    }

    return NextResponse.redirect(
      `${appUrl}/checkout/fail?order=${encodeURIComponent(result.orderNumber)}`
    );
  } catch (error: unknown) {
    logger.error('Ameriabank callback error', { error });
    return NextResponse.redirect(`${appUrl}/checkout/fail`);
  }
}
