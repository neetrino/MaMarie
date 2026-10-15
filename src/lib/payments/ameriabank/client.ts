import { logger } from '@/lib/utils/logger';
import type {
  AmeriabankOperationResponseBody,
  CancelPaymentRequestBody,
  GetPaymentDetailsRequestBody,
  GetPaymentDetailsResponseBody,
  InitPaymentRequestBody,
  InitPaymentResponseBody,
  RefundPaymentRequestBody,
} from './types';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
} as const;

async function postJson<TResponse>(
  url: string,
  body: unknown,
  operation: string
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    logger.error('Ameriabank non-JSON response', {
      operation,
      status: response.status,
      bodyPreview: text.slice(0, 200),
    });
    throw new Error(`Ameriabank ${operation} returned non-JSON response`);
  }

  if (!response.ok) {
    logger.error('Ameriabank HTTP error', {
      operation,
      status: response.status,
      body: parsed,
    });
    throw new Error(`Ameriabank ${operation} failed with HTTP ${response.status}`);
  }

  return parsed as TResponse;
}

export async function callInitPayment(
  baseUrl: string,
  body: InitPaymentRequestBody
): Promise<InitPaymentResponseBody> {
  return postJson<InitPaymentResponseBody>(
    `${baseUrl}/api/VPOS/InitPayment`,
    body,
    'InitPayment'
  );
}

export async function callGetPaymentDetails(
  baseUrl: string,
  body: GetPaymentDetailsRequestBody
): Promise<GetPaymentDetailsResponseBody> {
  return postJson<GetPaymentDetailsResponseBody>(
    `${baseUrl}/api/VPOS/GetPaymentDetails`,
    body,
    'GetPaymentDetails'
  );
}

export async function callCancelPayment(
  baseUrl: string,
  body: CancelPaymentRequestBody
): Promise<AmeriabankOperationResponseBody> {
  return postJson<AmeriabankOperationResponseBody>(
    `${baseUrl}/api/VPOS/CancelPayment`,
    body,
    'CancelPayment'
  );
}

export async function callRefundPayment(
  baseUrl: string,
  body: RefundPaymentRequestBody
): Promise<AmeriabankOperationResponseBody> {
  return postJson<AmeriabankOperationResponseBody>(
    `${baseUrl}/api/VPOS/RefundPayment`,
    body,
    'RefundPayment'
  );
}

export function buildPayPageUrl(
  baseUrl: string,
  paymentId: string,
  lang: string
): string {
  const params = new URLSearchParams({
    id: paymentId,
    lang,
  });
  return `${baseUrl}/Payments/Pay?${params.toString()}`;
}
