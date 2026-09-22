import { logger } from '@/lib/utils/logger';
import type {
  GetPaymentDetailsRequestBody,
  GetPaymentDetailsResponseBody,
  InitPaymentRequestBody,
  InitPaymentResponseBody,
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
