import { db } from '@white-shop/db';
import type { Prisma } from '@white-shop/db';
import { getAppUrl } from '@/lib/payments/app-url';
import { logger } from '@/lib/utils/logger';
import { buildPayPageUrl, callInitPayment } from './client';
import { getAmeriabankConfig } from './config';
import {
  AMERIABANK_CALLBACK_PATH,
  AMERIABANK_CURRENCY_AMD,
  AMERIABANK_PROVIDER,
  AMERIABANK_TEST_AMOUNT_AMD,
  CARD_CHECKOUT_METHOD,
} from './constants';
import {
  reserveAmeriabankTestOrderId,
  resolveLiveAmeriaOrderId,
} from './order-id';
import { getInitPaymentId, isInitPaymentSuccess } from './status';
import type { AmeriabankLang, AmeriabankProviderResponse } from './types';

export function isAmeriabankCheckoutMethod(paymentMethod: string): boolean {
  return (
    paymentMethod === AMERIABANK_PROVIDER ||
    paymentMethod === CARD_CHECKOUT_METHOD
  );
}

function resolveLang(locale: string | null | undefined): AmeriabankLang {
  const normalized = (locale ?? 'en').toLowerCase();
  if (normalized.startsWith('hy') || normalized.startsWith('am')) {
    return 'am';
  }
  if (normalized.startsWith('ru')) {
    return 'ru';
  }
  return 'en';
}

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

/**
 * Registers order in Ameriabank vPOS and returns bank Pay page URL.
 */
export async function initAmeriabankPayment(orderId: string): Promise<{
  paymentUrl: string;
  paymentId: string;
}> {
  const config = getAmeriabankConfig();

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      payments: {
        where: { provider: AMERIABANK_PROVIDER },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!order) {
    throw {
      status: 404,
      type: 'https://api.shop.am/problems/not-found',
      title: 'Not Found',
      detail: 'Order not found',
    };
  }

  if (order.paymentStatus === 'paid') {
    throw {
      status: 409,
      type: 'https://api.shop.am/problems/conflict',
      title: 'Conflict',
      detail: 'Order is already paid',
    };
  }

  if (order.paymentStatus !== 'pending' && order.paymentStatus !== 'failed') {
    throw {
      status: 409,
      type: 'https://api.shop.am/problems/conflict',
      title: 'Conflict',
      detail: 'Order cannot be paid in current status',
    };
  }

  const payment = order.payments[0];
  if (!payment) {
    throw {
      status: 404,
      type: 'https://api.shop.am/problems/not-found',
      title: 'Not Found',
      detail: 'Payment record not found',
    };
  }

  const ameriaOrderId = config.testMode
    ? await reserveAmeriabankTestOrderId(payment.id, payment.providerResponse)
    : resolveLiveAmeriaOrderId(order.id, order.number);

  const amount = config.testMode
    ? AMERIABANK_TEST_AMOUNT_AMD
    : Math.round(order.total);

  const lang = resolveLang(order.customerLocale);
  const backUrl = `${getAppUrl()}${AMERIABANK_CALLBACK_PATH}`;

  // InitPaymentRequest fields only (lang belongs on Pay page URL, not here).
  const initBody = {
    ClientID: config.credentials.clientId,
    Username: config.credentials.username,
    Password: config.credentials.password,
    OrderID: ameriaOrderId,
    Amount: amount,
    Currency: AMERIABANK_CURRENCY_AMD,
    Description: `Order ${order.number}`,
    BackURL: backUrl,
    Opaque: order.id,
  };

  const initResponse = await callInitPayment(config.baseUrl, initBody);

  if (!isInitPaymentSuccess(initResponse)) {
    const message =
      initResponse.ResponseMessage ??
      initResponse.responseMessage ??
      'InitPayment failed';
    logger.warn('Ameriabank InitPayment rejected', {
      orderId: order.id,
      response: initResponse,
    });

    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        errorCode: String(
          initResponse.ResponseCode ?? initResponse.responseCode ?? ''
        ),
        errorMessage: message,
        failedAt: new Date(),
        providerResponse: mergeProviderResponse(payment.providerResponse, {
          ameriaOrderId,
          initResponse,
        }) as Prisma.InputJsonValue,
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'failed' },
    });

    throw {
      status: 502,
      type: 'https://api.shop.am/problems/payment-provider-error',
      title: 'Payment Provider Error',
      detail: message,
    };
  }

  const paymentId = getInitPaymentId(initResponse);
  if (!paymentId) {
    throw {
      status: 502,
      type: 'https://api.shop.am/problems/payment-provider-error',
      title: 'Payment Provider Error',
      detail: 'InitPayment succeeded without PaymentID',
    };
  }

  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: 'pending',
      providerTransactionId: paymentId,
      errorCode: null,
      errorMessage: null,
      failedAt: null,
      providerResponse: mergeProviderResponse(payment.providerResponse, {
        ameriaOrderId,
        paymentId,
        initResponse,
      }) as Prisma.InputJsonValue,
    },
  });

  if (order.paymentStatus === 'failed') {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'pending' },
    });
  }

  const paymentUrl = buildPayPageUrl(config.baseUrl, paymentId, lang);

  logger.info('Ameriabank InitPayment success', {
    orderId: order.id,
    orderNumber: order.number,
    ameriaOrderId,
    paymentId,
  });

  return { paymentUrl, paymentId };
}
