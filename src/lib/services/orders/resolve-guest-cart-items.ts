import { db } from "@white-shop/db";
import type { Prisma } from "@white-shop/db";
import { extractMediaUrl } from "../../utils/extractMediaUrl";
import type { CheckoutCartItem } from "./checkout-types";

type GuestCheckoutItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type ProductVariantWithProduct = Prisma.ProductVariantGetPayload<{
  include: {
    product: {
      include: {
        translations: true;
      };
    };
    options: true;
  };
}>;

/**
 * Validates guest checkout items and formats them against current variant data.
 */
export async function resolveGuestCartItems(
  guestItems: GuestCheckoutItem[]
): Promise<CheckoutCartItem[]> {
  const variantIds: string[] = [];
  for (const item of guestItems) {
    if (!item.productId || !item.variantId || !item.quantity) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "Each item must have productId, variantId, and quantity",
      };
    }
    variantIds.push(item.variantId);
  }
  const uniqueVariantIds = [...new Set(variantIds)];

  const variants = await db.productVariant.findMany({
    where: { id: { in: uniqueVariantIds } },
    include: {
      product: { include: { translations: true } },
      options: true,
    },
  });
  const variantMap = new Map<string, ProductVariantWithProduct>(
    variants.map((v) => [v.id, v])
  );

  return guestItems.map((item) => {
    const variant = variantMap.get(item.variantId);
    if (!variant || variant.productId !== item.productId) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Product variant not found",
        detail: `Variant ${item.variantId} not found for product ${item.productId}`,
      };
    }
    if (variant.stock < item.quantity) {
      throw {
        status: 422,
        type: "https://api.shop.am/problems/validation-error",
        title: "Insufficient stock",
        detail: `Insufficient stock. Available: ${variant.stock}, Requested: ${item.quantity}`,
      };
    }
    const translation =
      variant.product.translations?.[0] || variant.product.translations?.[0];
    const variantTitle =
      variant.options
        ?.map(
          (opt: { attributeKey?: string | null; value?: string | null }) =>
            `${opt.attributeKey ?? ""}: ${opt.value ?? ""}`
        )
        .join(", ") ?? undefined;
    const imageUrl =
      extractMediaUrl(variant.product.media, variant.product.id) ?? undefined;
    return {
      variantId: variant.id,
      productId: variant.product.id,
      quantity: item.quantity,
      price: Number(variant.price),
      productTitle: translation?.title ?? "Unknown Product",
      variantTitle,
      sku: variant.sku ?? "",
      imageUrl,
    };
  });
}
