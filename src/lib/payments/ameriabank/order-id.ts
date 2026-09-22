import { db } from '@white-shop/db';
import { Prisma } from '@white-shop/db';
import {
  AMERIABANK_ORDER_ID_LOCK_KEY,
  AMERIABANK_PROVIDER,
  AMERIABANK_TEST_ORDER_ID_MAX,
  AMERIABANK_TEST_ORDER_ID_MIN,
} from './constants';
import type { AmeriabankProviderResponse } from './types';

/**
 * Reserves next test OrderID on the payment row (locked) so concurrent inits cannot collide.
 */
export async function reserveAmeriabankTestOrderId(
  paymentId: string,
  existingResponse: Prisma.JsonValue | null
): Promise<number> {
  return db.$transaction(async (tx) => {
    await tx.$executeRaw(
      Prisma.sql`SELECT pg_advisory_xact_lock(${AMERIABANK_ORDER_ID_LOCK_KEY}::bigint)`
    );

    const rows = await tx.$queryRaw<Array<{ max_id: number | null }>>(
      Prisma.sql`
        SELECT MAX(("providerResponse"->>'ameriaOrderId')::int) AS max_id
        FROM "payments"
        WHERE "provider" = ${AMERIABANK_PROVIDER}
          AND "providerResponse" ? 'ameriaOrderId'
          AND ("providerResponse"->>'ameriaOrderId') ~ '^[0-9]+$'
      `
    );

    const maxUsed = rows[0]?.max_id;
    const next =
      maxUsed !== null && maxUsed !== undefined && Number.isFinite(maxUsed)
        ? maxUsed + 1
        : AMERIABANK_TEST_ORDER_ID_MIN;

    if (next < AMERIABANK_TEST_ORDER_ID_MIN || next > AMERIABANK_TEST_ORDER_ID_MAX) {
      throw {
        status: 503,
        type: 'https://api.shop.am/problems/payment-unavailable',
        title: 'Payment Unavailable',
        detail:
          'Ameriabank test OrderID range exhausted. Contact Ameriabank for a new range.',
      };
    }

    const base =
      existingResponse &&
      typeof existingResponse === 'object' &&
      !Array.isArray(existingResponse)
        ? (existingResponse as AmeriabankProviderResponse)
        : {};

    await tx.payment.update({
      where: { id: paymentId },
      data: {
        providerResponse: {
          ...base,
          ameriaOrderId: next,
        } as Prisma.InputJsonValue,
      },
    });

    return next;
  });
}

/**
 * Live OrderID: prefer numeric shop order number; else stable hash of order id.
 */
export function resolveLiveAmeriaOrderId(
  orderId: string,
  orderNumber: string
): number {
  const fromNumber = Number.parseInt(orderNumber, 10);
  if (Number.isFinite(fromNumber) && fromNumber > 0 && fromNumber <= 999_999_999) {
    return fromNumber;
  }

  let hash = 0;
  for (let i = 0; i < orderId.length; i += 1) {
    hash = (hash * 31 + orderId.charCodeAt(i)) % 1_000_000_000;
  }
  return hash === 0 ? 1 : Math.abs(hash);
}
