import {
  AMERIABANK_DETAILS_SUCCESS_PREFIX,
  AMERIABANK_INIT_SUCCESS_CODE,
} from './constants';
import type { GetPaymentDetailsResponseBody, InitPaymentResponseBody } from './types';

export function getInitResponseCode(
  body: InitPaymentResponseBody
): number | null {
  const raw = body.ResponseCode ?? body.responseCode;
  if (raw === undefined || raw === null) {
    return null;
  }
  const n = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : null;
}

export function getInitPaymentId(body: InitPaymentResponseBody): string | null {
  const id = body.PaymentID ?? body.paymentID;
  if (typeof id !== 'string' || id.trim() === '') {
    return null;
  }
  return id.trim();
}

export function isInitPaymentSuccess(body: InitPaymentResponseBody): boolean {
  return (
    getInitResponseCode(body) === AMERIABANK_INIT_SUCCESS_CODE &&
    getInitPaymentId(body) !== null
  );
}

function normalizeResponseCode(raw: string | number | undefined): string {
  if (raw === undefined || raw === null) {
    return '';
  }
  if (raw === 0 || raw === '0') {
    return AMERIABANK_DETAILS_SUCCESS_PREFIX;
  }
  return String(raw).trim();
}

export function isDetailsResponseCodeOk(
  body: GetPaymentDetailsResponseBody
): boolean {
  const code = normalizeResponseCode(body.ResponseCode ?? body.responseCode);
  return (
    code === AMERIABANK_DETAILS_SUCCESS_PREFIX ||
    code.startsWith(AMERIABANK_DETAILS_SUCCESS_PREFIX)
  );
}

function isSuccessfulPaymentState(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return false;
  }
  if (raw === 2 || raw === 4 || raw === '2' || raw === '4') {
    return true;
  }
  const normalized = String(raw).trim().toLowerCase();
  return (
    normalized === 'successful' ||
    normalized === 'payment_deposited' ||
    normalized === 'deposited'
  );
}

function isSuccessfulOrderStatus(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return false;
  }
  const n = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
  return n === 2 || n === 4;
}

/**
 * Success when ResponseCode is OK and PaymentState or OrderStatus indicates deposited.
 */
export function isAmeriabankPaymentSuccessful(
  body: GetPaymentDetailsResponseBody
): boolean {
  if (!isDetailsResponseCodeOk(body)) {
    return false;
  }

  const paymentState = body.PaymentState ?? body.paymentState;
  const orderStatus = body.OrderStatus ?? body.orderStatus;

  return (
    isSuccessfulPaymentState(paymentState) ||
    isSuccessfulOrderStatus(orderStatus)
  );
}
