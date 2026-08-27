import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import type { CheckoutData } from "../types/checkout";
import { logger } from "../utils/logger";
import { adminDeliveryService } from "./admin/admin-delivery.service";
import { persistCheckoutOrder } from "./orders/persist-checkout-order";
import { resolveCheckoutCartItems } from "./orders/resolve-checkout-cart-items";
import { validateCheckoutFields } from "./orders/validate-checkout-fields";

type OrderItemWithVariant = Prisma.OrderItemGetPayload<{
  include: {
    variant: {
      include: {
        options: {
          include: {
            attributeValue: {
              include: {
                translations: true;
                attribute: true;
              };
            };
          };
        };
      };
    };
  };
}>;

class OrdersService {
  /**
   * Create order (checkout)
   */
  async checkout(data: CheckoutData, userId?: string) {
    try {
      const {
        cartId,
        items: guestItems,
        firstName,
        lastName,
        email,
        phone,
        shippingMethod = "pickup",
        shippingAddress,
        paymentMethod = "idram",
        cashChangeFor,
        notes,
      } = data;
      // shippingAmount is ignored — computed server-side from shippingMethod and address

      const { contactAddress, persistedShippingAddress } = validateCheckoutFields({
        firstName,
        lastName,
        email,
        phone,
        paymentMethod,
        cashChangeFor,
        shippingAddress,
      });

      const cartItems = await resolveCheckoutCartItems({
        userId,
        cartId,
        guestItems,
      });

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const discountAmount = 0; // TODO: Implement discount/coupon logic
      // Shipping: computed server-side only (never trust client-provided amount)
      let shippingAmount = 0;
      if (shippingMethod === "delivery" && shippingAddress?.city?.trim()) {
        const country = (shippingAddress.countryCode ?? "Armenia").toString();
        shippingAmount = await adminDeliveryService.getDeliveryPrice(
          shippingAddress.city.trim(),
          country
        );
        if (shippingAmount < 0) shippingAmount = 0;
      }
      const taxAmount = 0; // TODO: Calculate tax if needed
      const total = subtotal - discountAmount + shippingAmount + taxAmount;

      const order = await persistCheckoutOrder({
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
      });

      // Return order and payment info
      return {
        order: {
          id: order.order.id,
          number: order.order.number,
          status: order.order.status,
          paymentStatus: order.order.paymentStatus,
          total: order.order.total,
          currency: order.order.currency,
        },
        payment: {
          provider: order.payment.provider,
          paymentUrl: null, // TODO: Generate payment URL for Idram/ArCa
          expiresAt: null, // TODO: Set expiration if needed
        },
        nextAction:
          paymentMethod === "idram" || paymentMethod === "arca"
            ? "redirect_to_payment"
            : "view_order",
      };
    } catch (error: unknown) {
      // Type guard for custom error
      const customError = error as {
        status?: number;
        type?: string;
        message?: string;
        code?: string;
        name?: string;
        meta?: unknown;
        stack?: string;
      };

      // If it's already our custom error, re-throw it
      if (customError.status && customError.type) {
        throw error;
      }

      // Log unexpected errors
      logger.error("Checkout error", {
        error: {
          name: customError?.name,
          message: customError?.message,
          code: customError?.code,
          meta: customError?.meta,
          stack: customError?.stack?.substring(0, 500),
        },
      });

      // Handle Prisma errors
      if (customError?.code === "P2002") {
        throw {
          status: 409,
          type: "https://api.shop.am/problems/conflict",
          title: "Conflict",
          detail: "Order number already exists, please try again",
        };
      }

      // Generic error
      throw {
        status: 500,
        type: "https://api.shop.am/problems/internal-error",
        title: "Internal Server Error",
        detail: customError?.message || "An error occurred during checkout",
      };
    }
  }

  /**
   * Get user orders list (paginated)
   */
  async list(userId: string, options?: { page?: number; limit?: number }) {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(100, Math.max(1, options?.limit ?? 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { userId },
        include: {
          items: { select: { id: true } },
          payments: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((order: {
        id: string;
        number: string;
        status: string;
        paymentStatus: string;
        fulfillmentStatus: string;
        total: number;
        subtotal: number;
        discountAmount: number;
        shippingAmount: number;
        taxAmount: number;
        currency: string;
        createdAt: Date;
        items: Array<{ id: string }>;
      }) => ({
        id: order.id,
        number: order.number,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.total,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingAmount: order.shippingAmount,
        taxAmount: order.taxAmount,
        currency: order.currency,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order by number
   */
  async findByNumber(orderNumber: string, userId: string) {
    const order = await db.order.findFirst({
      where: {
        number: orderNumber,
        userId,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                options: {
                  include: {
                    attributeValue: {
                      include: {
                        attribute: true,
                        translations: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: true,
        events: true,
      },
    });

    if (!order) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Order not found",
        detail: `Order with number '${orderNumber}' not found`,
      };
    }

    // Parse shipping address if it's a JSON string
    let shippingAddress = order.shippingAddress;
    if (typeof shippingAddress === "string") {
      try {
        shippingAddress = JSON.parse(shippingAddress);
      } catch {
        shippingAddress = null;
      }
    }

    // Debug logging
    logger.info("Order found", {
      orderNumber: order.number,
      itemsCount: order.items.length,
      items: order.items.map((item: OrderItemWithVariant) => ({
        variantId: item.variantId,
        productTitle: item.productTitle,
        variant: item.variant
          ? {
              id: item.variant.id,
              optionsCount: item.variant.options?.length || 0,
              options: item.variant.options,
            }
          : null,
      })),
    });

    return {
      id: order.id,
      number: order.number,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      items: order.items.map((item: OrderItemWithVariant) => {
        const variantOptions =
          item.variant?.options?.map((opt) => {
            // Debug logging for each option
            logger.debug("Processing option", {
              attributeKey: opt.attributeKey,
              value: opt.value,
              valueId: opt.valueId,
              hasAttributeValue: !!opt.attributeValue,
              attributeValueData: opt.attributeValue
                ? {
                    value: opt.attributeValue.value,
                    attributeKey: opt.attributeValue.attribute.key,
                    imageUrl: opt.attributeValue.imageUrl,
                    hasTranslations: opt.attributeValue.translations?.length > 0,
                  }
                : null,
            });

            // New format: Use AttributeValue if available
            if (opt.attributeValue) {
              // Get label from translations (prefer current locale, fallback to first available)
              const translations = opt.attributeValue.translations || [];
              const label =
                translations.length > 0
                  ? translations[0].label
                  : opt.attributeValue.value;

              return {
                attributeKey: opt.attributeValue.attribute.key || undefined,
                value: opt.attributeValue.value || undefined,
                label: label || undefined,
                imageUrl: opt.attributeValue.imageUrl || undefined,
                colors: opt.attributeValue.colors || undefined,
              };
            }
            // Old format: Use attributeKey and value directly
            return {
              attributeKey: opt.attributeKey || undefined,
              value: opt.value || undefined,
            };
          }) || [];

        logger.debug("Item mapping", {
          productTitle: item.productTitle,
          variantId: item.variantId,
          hasVariant: !!item.variant,
          optionsCount: item.variant?.options?.length || 0,
          variantOptions,
        });

        return {
          variantId: item.variantId || "",
          productTitle: item.productTitle,
          variantTitle: item.variantTitle || "",
          sku: item.sku,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.total),
          imageUrl: item.imageUrl || undefined,
          variantOptions,
        };
      }),
      totals: {
        subtotal: Number(order.subtotal),
        discount: Number(order.discountAmount),
        shipping: Number(order.shippingAmount),
        tax: Number(order.taxAmount),
        total: Number(order.total),
        currency: order.currency,
      },
      customer: {
        email: order.customerEmail || undefined,
        phone: order.customerPhone || undefined,
      },
      shippingAddress: shippingAddress,
      shippingMethod: order.shippingMethod || "pickup",
      trackingNumber: order.trackingNumber || undefined,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}

export const ordersService = new OrdersService();
