import { db } from '@white-shop/db';
import type { Prisma } from '@white-shop/db';
import { logger } from '@/lib/utils/logger';
import { clearUserCartByUserId } from '@/lib/payments/clear-user-cart';
import { callGetPaymentDetails } from './client';
import { getAmeriabankConfig } from './config';
import { AMERIABANK_PROVIDER } from './constants';
import { isAmeriabankPaymentSuccessful } from './status';
import type { AmeriabankProviderResponse, GetPaymentDetailsResponseBody } from './types';

function mergeProviderResponse(
  existing: Prisma.JsonValue | null,
  patch: AmeriabankProviderResponse
): AmeriabankProviderResponse {
  const base =
    existing && typeof existing === 'object' && !Array.isArray(existing)
      ? (existing as AmeriabankProviderResponse)
      : {};
  return { ...base, ...patch };
}

export type SettleAmeriabankResult = {
  success: boolean;
  orderId: string;
  orderNumber: string;
  alreadyPaid: boolean;
};

/**
 * Verifies payment via GetPaymentDetails and updates order/payment (idempotent).
 */
export async function settleAmeriabankPayment(params: {
  paymentId: string;
  opaqueOrderId?: string | null;
}): Promise<SettleAmeriabankResult> {
  const { paymentId, opaqueOrderId } = params;
  const config = getAmeriabankConfig();

  const details = await callGetPaymentDetails(config.baseUrl, {
    PaymentID: paymentId,
    Username: config.credentials.username,
    Password: config.credentials.password,
  });

  logger.info('Ameriabank GetPaymentDetails', {
    paymentId,
    responseCode: details.ResponseCode ?? details.responseCode,
    paymentState: details.PaymentState ?? details.paymentState,
    orderStatus: details.OrderStatus ?? details.orderStatus,
  });

  const payment = await findPaymentRecord(paymentId, opaqueOrderId);
  if (!payment || !payment.order) {
    throw {
      status: 404,
      type: 'https://api.shop.am/problems/not-found',
      title: 'Not Found',
      detail: 'Payment not found',
    };
  }

  const order = payment.order;

  if (order.paymentStatus === 'paid') {
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      alreadyPaid: true,
    };
  }

  const success = isAmeriabankPaymentSuccessful(details);

  if (success) {
    await markOrderPaid({
      orderId: order.id,
      paymentId: payment.id,
      providerPaymentId: paymentId,
      details,
      existingResponse: payment.providerResponse,
      userId: order.userId,
    });
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      alreadyPaid: false,
    };
  }

  await markOrderFailed({
    orderId: order.id,
    paymentDbId: payment.id,
    providerPaymentId: paymentId,
    details,
    existingResponse: payment.providerResponse,
  });

  return {
    success: false,
    orderId: order.id,
    orderNumber: order.number,
    alreadyPaid: false,
  };
}

async function findPaymentRecord(
  providerPaymentId: string,
  opaqueOrderId?: string | null
) {
  const byTxn = await db.payment.findFirst({
    where: {
      provider: AMERIABANK_PROVIDER,
      providerTransactionId: providerPaymentId,
    },
    include: { order: true },
  });
  if (byTxn) {
    return byTxn;
  }

  if (opaqueOrderId) {
    return db.payment.findFirst({
      where: {
        provider: AMERIABANK_PROVIDER,
        orderId: opaqueOrderId,
      },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  return null;
}

async function markOrderPaid(params: {
  orderId: string;
  paymentId: string;
  providerPaymentId: string;
  details: GetPaymentDetailsResponseBody;
  existingResponse: Prisma.JsonValue | null;
  userId: string | null;
}): Promise<void> {
  const now = new Date();

  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: params.orderId },
      data: {
        paymentStatus: 'paid',
        status: 'processing',
        paidAt: now,
      },
    });

    await tx.payment.update({
      where: { id: params.paymentId },
      data: {
        status: 'completed',
        providerTransactionId: params.providerPaymentId,
        completedAt: now,
        errorCode: null,
        errorMessage: null,
        providerResponse: mergeProviderResponse(params.existingResponse, {
          paymentId: params.providerPaymentId,
          detailsResponse: params.details,
        }) as Prisma.InputJsonValue,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: params.orderId,
        type: 'payment_paid',
        data: {
          provider: AMERIABANK_PROVIDER,
          paymentId: params.providerPaymentId,
          source: 'ameriabank_callback',
        },
      },
    });
  });

  if (params.userId) {
    await clearUserCartByUserId(params.userId);
  }

  logger.info('Ameriabank payment settled as paid', {
    orderId: params.orderId,
    paymentId: params.providerPaymentId,
  });
}

async function markOrderFailed(params: {
  orderId: string;
  paymentDbId: string;
  providerPaymentId: string;
  details: GetPaymentDetailsResponseBody;
  existingResponse: Prisma.JsonValue | null;
}): Promise<void> {
  const now = new Date();
  const responseCode = String(
    params.details.ResponseCode ?? params.details.responseCode ?? ''
  );

  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: params.orderId },
      data: { paymentStatus: 'failed' },
    });

    await tx.payment.update({
      where: { id: params.paymentDbId },
      data: {
        status: 'failed',
        providerTransactionId: params.providerPaymentId,
        failedAt: now,
        errorCode: responseCode || null,
        errorMessage: 'Payment not successful',
        providerResponse: mergeProviderResponse(params.existingResponse, {
          paymentId: params.providerPaymentId,
          detailsResponse: params.details,
        }) as Prisma.InputJsonValue,
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: params.orderId,
        type: 'payment_failed',
        data: {
          provider: AMERIABANK_PROVIDER,
          paymentId: params.providerPaymentId,
          responseCode,
          source: 'ameriabank_callback',
        },
      },
    });
  });

  logger.info('Ameriabank payment settled as failed', {
    orderId: params.orderId,
    paymentId: params.providerPaymentId,
    responseCode,
  });
}
