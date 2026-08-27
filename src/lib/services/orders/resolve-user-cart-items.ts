import { db } from "@white-shop/db";
import type { Prisma } from "@white-shop/db";
import { extractMediaUrl } from "../../utils/extractMediaUrl";
import { logger } from "../../utils/logger";
import type { CheckoutCartItem } from "./checkout-types";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        translations: true;
      };
    };
    variant: {
      include: {
        options: true;
      };
    };
  };
}>;

/**
 * Loads and formats checkout line items from a signed-in user's cart.
 */
export async function resolveUserCartItems(
  userId: string,
  cartId: string
): Promise<CheckoutCartItem[]> {
  const cart = await db.cart.findFirst({
    where: { id: cartId, userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  translations: true,
                },
              },
              options: true,
            },
          },
          product: {
            include: {
              translations: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Cart is empty",
      detail: "Cannot checkout with an empty cart",
    };
  }

  logger.debug("Processing cart items", { count: cart.items.length });

  const cartItems = await Promise.all(
    cart.items.map(async (item: CartItemWithRelations) => {
      const product = item.product;
      const variant = item.variant;

      if (!variant) {
        logger.error("Cart item missing variant", {
          itemId: item.id,
          variantId: item.variantId,
          productId: item.productId,
        });
        throw {
          status: 404,
          type: "https://api.shop.am/problems/not-found",
          title: "Variant not found",
          detail: `Variant ${item.variantId} not found for cart item`,
        };
      }

      logger.debug("Processing cart item", {
        itemId: item.id,
        variantId: variant.id,
        productId: product.id,
        quantity: item.quantity,
        variantStock: variant.stock,
        variantSku: variant.sku,
      });

      const translation =
        product.translations?.[0] || product.translations?.[0];

      const variantTitle =
        variant.options
          ?.map((opt) => `${opt.attributeKey || ""}: ${opt.value || ""}`)
          .join(", ") || undefined;

      const imageUrl =
        extractMediaUrl(product.media, product.id) ?? undefined;

      if (variant.stock < item.quantity) {
        throw {
          status: 422,
          type: "https://api.shop.am/problems/validation-error",
          title: "Insufficient stock",
          detail: `Product "${translation?.title || "Unknown"}" - insufficient stock. Available: ${variant.stock}, Requested: ${item.quantity}`,
        };
      }

      const currentPrice = Number(variant.price);
      const cartItem: CheckoutCartItem = {
        variantId: variant.id,
        productId: product.id,
        quantity: item.quantity,
        price: currentPrice,
        productTitle: translation?.title || "Unknown Product",
        variantTitle,
        sku: variant.sku || "",
        imageUrl,
      };

      logger.debug("Cart item formatted", {
        variantId: cartItem.variantId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        sku: cartItem.sku,
      });

      return cartItem;
    })
  );

  logger.info("All cart items processed", { count: cartItems.length });
  return cartItems;
}
