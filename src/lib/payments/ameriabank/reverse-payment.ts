import { db } from '@white-shop/db';
import type { Prisma } from '@white-shop/db';
import { logger } from '@/lib/utils/logger';
import { callCancelPayment, callRefundPayment } from './client';
import { getAmeriabankConfig } from './config';
import {
  AMERIABANK_CANCEL_WINDOW_HOURS,
  AMERIABANK_PROVIDER,
  AMERIABANK_TEST_AMOUNT_AMD,
} from './constants';
import { isAmeriabankResponseCodeOk } from './status';
import type {
  AmeriabankOperationResponseBody,
  AmeriabankProviderResponse,
} from './types';

const CANCEL_WINDOW_MS = AMERIABANK_CANCEL_WINDOW_HOURS * 60 * 60 * 1000;

type BankPaymentAction = 'cancelled' | 'refunded';

type ApiProblem = {
  status: number;
  type: string;
  title: string;
  detail: string;
};

/**
 * Sends CancelPayment or RefundPayment to Ameriabank vPOS, then stores the status.
 * No-op when the order has no Ameriabank payment (cash and other methods).
 */
export async function syncAmeriabankPaymentStatus(params: {
  orderId: string;
  nextStatus: BankPaymentAction;
}): Promise<void> {
  const payment = await db.payment.findFirst({
    where: { orderId: params.orderId, provider: AMERIABANK_PROVIDER },
    orderBy: { createdAt: 'desc' },
  });
  if (!payment) {
    return;
  }
  if (payment.status === params.nextStatus) {
    return;
  }

  const paymentId = payment.providerTransactionId?.trim();
  if (!paymentId) {
    throw problem(409, 'Ameriabank PaymentID is missing. Complete the card payment first.');
  }

  if (params.nextStatus === 'cancelled') {
    assertCancelWindow(payment.createdAt);
  }

  const response = await requestBankStatus(payment, params.nextStatus, paymentId);
  if (!isAmeriabankResponseCodeOk(response.ResponseCode ?? response.responseCode)) {
    const detail = operationMessage(response, params.nextStatus);
    logger.warn('Ameriabank payment status rejected', {
      orderId: params.orderId,
      nextStatus: params.nextStatus,
      responseCode: response.ResponseCode ?? response.responseCode,
    });
    throw problem(502, detail);
  }

  await persistBankStatus(payment.id, payment.providerResponse, params.nextStatus, response, paymentId);
  logger.info('Ameriabank payment status sent', {
    orderId: params.orderId,
    nextStatus: params.nextStatus,
    paymentId,
  });
}

async function requestBankStatus(
  payment: { amount: number; providerResponse: Prisma.JsonValue | null },
  nextStatus: BankPaymentAction,
  paymentId: string
): Promise<AmeriabankOperationResponseBody> {
  const config = getAmeriabankConfig();
  const credentials = {
    PaymentID: paymentId,
    Username: config.credentials.username,
    Password: config.credentials.password,
  };
  if (nextStatus === 'cancelled') {
    return callCancelPayment(config.baseUrl, credentials);
  }
  return callRefundPayment(config.baseUrl, {
    ...credentials,
    Amount: resolveRefundAmount(payment, config.testMode),
  });
}

function assertCancelWindow(initializedAt: Date): void {
  if (Date.now() - initializedAt.getTime() <= CANCEL_WINDOW_MS) {
    return;
  }
  throw problem(
    409,
    `CancelPayment is only available within ${AMERIABANK_CANCEL_WINDOW_HOURS} hours of payment initialization`
  );
}

function resolveRefundAmount(
  payment: { amount: number; providerResponse: Prisma.JsonValue | null },
  testMode: boolean
): number {
  const charged = readChargedAmount(payment.providerResponse);
  if (charged !== null) {
    return charged;
  }
  if (testMode) {
    return AMERIABANK_TEST_AMOUNT_AMD;
  }
  return Math.round(payment.amount);
}

function readChargedAmount(raw: Prisma.JsonValue | null): number | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const stored = raw as AmeriabankProviderResponse;
  const chargedAmount = stored.chargedAmountAmd;
  if (isPositiveAmount(chargedAmount)) {
    return chargedAmount;
  }
  const details = stored.detailsResponse;
  const amount = details?.Amount ?? details?.amount;
  return isPositiveAmount(amount) ? amount : null;
}

function isPositiveAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}

function operationMessage(
  response: AmeriabankOperationResponseBody,
  action: BankPaymentAction
): string {
  const message = response.ResponseMessage ?? response.responseMessage;
  if (message && message.trim() !== '') {
    return message;
  }
  return action === 'cancelled' ? 'CancelPayment failed' : 'RefundPayment failed';
}

async function persistBankStatus(
  paymentDbId: string,
  existing: Prisma.JsonValue | null,
  nextStatus: BankPaymentAction,
  response: AmeriabankOperationResponseBody,
  paymentId: string
): Promise<void> {
  const base = readProviderResponse(existing);
  const patch: AmeriabankProviderResponse =
    nextStatus === 'cancelled'
      ? { ...base, paymentId, cancelResponse: response }
      : { ...base, paymentId, refundResponse: response };

  await db.payment.update({
    where: { id: paymentDbId },
    data: {
      status: nextStatus,
      errorCode: null,
      errorMessage: null,
      providerResponse: patch as Prisma.InputJsonValue,
    },
  });
}

function readProviderResponse(raw: Prisma.JsonValue | null): AmeriabankProviderResponse {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  return raw as AmeriabankProviderResponse;
}

function problem(status: number, detail: string): ApiProblem {
  const title = status === 502 ? 'Payment Provider Error' : 'Conflict';
  return {
    status,
    type:
      status === 502
        ? 'https://api.shop.am/problems/payment-provider-error'
        : 'https://api.shop.am/problems/conflict',
    title,
    detail,
  };
}
