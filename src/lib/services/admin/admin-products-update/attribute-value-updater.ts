import { db, Prisma } from "@white-shop/db";
import { logger } from "../../../utils/logger";
import { processImageUrl, smartSplitUrls } from "../../../utils/image-utils";

type AttributeValueUpdateClient = Pick<
  Prisma.TransactionClient,
  "attributeValue" | "productVariant"
>;

/**
 * Update attribute value imageUrls from variant images (runs outside the main product transaction).
 */
export async function updateAttributeValueImageUrls(
  productId: string,
  client: AttributeValueUpdateClient = db,
) {
  try {
    logger.debug("Updating attribute value imageUrls from variant images...");
    const allVariants = await client.productVariant.findMany({
      where: { productId },
      include: {
        options: {
          include: {
            attributeValue: {
              include: { attribute: true },
            },
          },
        },
      },
    });

    const updatedValueIds = new Set<string>();

    for (const variant of allVariants) {
      if (!variant.imageUrl) continue;

      const variantImageUrls = smartSplitUrls(variant.imageUrl);
      if (variantImageUrls.length === 0) continue;

      const firstVariantImageUrl = processImageUrl(variantImageUrls[0]);
      if (!firstVariantImageUrl) {
        logger.debug(`Variant ${variant.id} has invalid imageUrl, skipping attribute value update`);
        continue;
      }

      for (const opt of variant.options) {
        const attrValue = opt.attributeValue;
        if (!opt.valueId || !attrValue || updatedValueIds.has(opt.valueId)) {
          continue;
        }

        const attributeKey = attrValue.attribute?.key;
        const isColorAttribute = attributeKey === "color";
        const isSizeAttribute = attributeKey === "size";

        if (isSizeAttribute) {
          logger.debug(`Skipping attribute value ${opt.valueId} - size attribute is not linked to variant images`);
          continue;
        }

        const hasColors =
          attrValue.colors &&
          (Array.isArray(attrValue.colors)
            ? attrValue.colors.length > 0
            : typeof attrValue.colors === "string"
              ? attrValue.colors.trim() !== "" && attrValue.colors !== "[]"
              : Object.keys(attrValue.colors || {}).length > 0);
        const hasNoImageUrl = !attrValue.imageUrl || attrValue.imageUrl.trim() === "";
        const isColorOnly = hasColors && hasNoImageUrl;

        if ((isColorAttribute && hasNoImageUrl) || isColorOnly) {
          logger.debug(`Skipping attribute value ${opt.valueId} - color attribute or color-only value without imageUrl`);
          continue;
        }

        const shouldUpdate =
          !attrValue.imageUrl ||
          (firstVariantImageUrl.startsWith("data:image/") &&
            attrValue.imageUrl &&
            !attrValue.imageUrl.startsWith("data:image/"));

        if (!shouldUpdate) {
          logger.debug(`Skipping attribute value ${opt.valueId} - already has imageUrl`);
          continue;
        }

        logger.debug(`Updating attribute value ${opt.valueId} imageUrl from variant ${variant.id}`, {
          imageUrl: `${firstVariantImageUrl.substring(0, 50)}...`,
        });
        await client.attributeValue.update({
          where: { id: opt.valueId },
          data: { imageUrl: firstVariantImageUrl },
        });
        updatedValueIds.add(opt.valueId);
      }
    }

    logger.info("Finished updating attribute value imageUrls from variant images");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn("Failed to update attribute value imageUrls from variant images", {
      error: errorMessage,
    });
  }
}
