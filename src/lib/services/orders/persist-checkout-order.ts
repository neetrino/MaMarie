import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import type { CheckoutData } from "../../types/checkout";
import {
  FIRST_PUBLIC_ORDER_NUMBER,
  ORDER_NUMBER_ALLOCATION_LOCK_KEY,
} from "../../constants/order-number";
import { logger } from "../../utils/logger";
import type {
  CheckoutCartItem,
  CheckoutContactAddress,
  CheckoutShippingAddress,
} from "./checkout-types";

const ORDER_SEQUENCE_FLOOR = FIRST_PUBLIC_ORDER_NUMBER - 1;

async function allocateNextOrderNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  await tx.$executeRaw(
    Prisma.sql`SELECT pg_advisory_xact_lock(${ORDER_NUMBER_ALLOCATION_LOCK_KEY}::bigint)`
  );
  const rows = await tx.$queryRaw<Array<{ next: string }>>(
    Prisma.sql`
      SELECT (GREATEST(COALESCE(MAX(CAST("number" AS INTEGER)), ${ORDER_SEQUENCE_FLOOR}), ${ORDER_SEQUENCE_FLOOR}) + 1)::text AS next
      FROM "orders"
      WHERE "number" ~ '^[0-9]+$'
    `
  );
  const raw = rows[0]?.next;
  if (raw === undefined || raw === null) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Could not allocate order number",
    };
  }
  const nextNum = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(nextNum) || nextNum < FIRST_PUBLIC_ORDER_NUMBER) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Invalid order number sequence",
    };
  }
  return String(nextNum);
}

export type PersistCheckoutOrderParams = {
  userId?: string;
  cartId?: string;
  email: string;
  phone: string;
  shippingMethod: string;
  paymentMethod: string;
  cashChangeFor: CheckoutData["cashChangeFor"];
  notes: CheckoutData["notes"];
  contactAddress: CheckoutContactAddress;
  persistedShippingAddress: CheckoutShippingAddress | null;
  cartItems: CheckoutCartItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
};

/**
 * Creates the order, decrements stock, creates payment, and clears the user cart.
 */
export async function persistCheckoutOrder(
  params: PersistCheckoutOrderParams
): Promise<{
  order: {
    id: string;
    number: string;
    status: string;
    paymentStatus: string;
    total: number;
    currency: string;
  };
  payment: {
    provider: string;
  };
}> {
  const {
    userId,
    cartId,
    email,
    phone,
    shippingMethod,
    paymentMethod,
    cashChangeFor,
    notes,
    contactAddress,
    persistedShippingAddress,
    cartItems,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    total,
  } = params;

  const result = await db.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const orderNumber = await allocateNextOrderNumber(tx);
      const newOrder = await tx.order.create({
        data: {
          number: orderNumber,
          userId: userId || null,
          status: "pending",
          paymentStatus: "pending",
          fulfillmentStatus: "unfulfilled",
          subtotal,
          discountAmount,
          shippingAmount,
          taxAmount,
          total,
          currency: "AMD",
          customerEmail: email,
          customerPhone: phone,
          customerLocale: "en", // TODO: Get from request
          shippingMethod,
          shippingAddress: persistedShippingAddress
            ? JSON.parse(JSON.stringify(persistedShippingAddress))
            : null,
          billingAddress: JSON.parse(
            JSON.stringify({
              ...contactAddress,
              ...(persistedShippingAddress ?? {}),
            })
          ),
          notes: notes ?? null,
          items: {
            create: cartItems.map((item) => ({
              variantId: item.variantId,
              productTitle: item.productTitle,
              variantTitle: item.variantTitle,
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
              imageUrl: item.imageUrl,
            })),
          },
          events: {
            create: {
              type: "order_created",
              data: {
                source: userId ? "user" : "guest",
                paymentMethod,
                shippingMethod,
                ...(paymentMethod === "cash_on_delivery" && cashChangeFor
                  ? { cashChangeFor }
                  : {}),
              },
            },
          },
        },
        include: {
          items: true,
        },
      });

      logger.debug("Updating stock for variants", { count: cartItems.length });

      try {
        for (const item of cartItems) {
          if (!item.variantId) {
            logger.error("Missing variantId for item", { item });
            throw {
              status: 400,
              type: "https://api.shop.am/problems/validation-error",
              title: "Validation Error",
              detail: `Missing variantId for item with SKU: ${item.sku}`,
            };
          }

          const quantity = Number(item.quantity);
          const variantId = item.variantId;
          const updated = await tx.$executeRaw(
            Prisma.sql`UPDATE product_variants SET stock = stock - ${quantity} WHERE id = ${variantId} AND stock >= ${quantity}`
          );
          if (updated === 0) {
            const variant = await tx.productVariant.findUnique({
              where: { id: variantId },
              select: { sku: true, stock: true },
            });
            logger.error("Insufficient stock on atomic decrement", {
              variantId,
              sku: variant?.sku,
              currentStock: variant?.stock,
              requested: quantity,
            });
            throw {
              status: 422,
              type: "https://api.shop.am/problems/validation-error",
              title: "Insufficient stock",
              detail: `Insufficient stock for SKU ${variant?.sku ?? variantId}. Available: ${variant?.stock ?? 0}, requested: ${quantity}`,
            };
          }
          logger.debug("Stock decremented", { variantId, quantity });
        }
        logger.info("All variant stocks updated successfully");
      } catch (stockError: unknown) {
        const err = stockError as { status?: number; type?: string };
        if (err.status && err.type) throw stockError;
        logger.error("Error updating stock", { error: stockError });
        throw stockError;
      }

      const payment = await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider: paymentMethod,
          method: paymentMethod,
          amount: total,
          currency: "AMD",
          status: "pending",
          ...(paymentMethod === "cash_on_delivery" && cashChangeFor
            ? {
                providerResponse: {
                  cashChangeFor,
                },
              }
            : {}),
        },
      });

      if (userId && cartId && cartId !== "guest-cart") {
        await tx.cart.delete({
          where: { id: cartId },
        });
      }

      return { order: newOrder, payment };
    },
    { timeout: 10000, maxWait: 5000 }
  );

  return {
    order: {
      id: result.order.id,
      number: result.order.number,
      status: result.order.status,
      paymentStatus: result.order.paymentStatus,
      total: result.order.total,
      currency: result.order.currency,
    },
    payment: {
      provider: result.payment.provider,
    },
  };
}
