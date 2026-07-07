import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import { logger } from "../../../utils/logger";
import type { UpdateProductData } from "./types";
import { collectVariantImages, buildProductUpdateData, updateProductTranslation, updateProductLabels, updateProductAttributes } from "./product-updater";
import { updateOrCreateVariant } from "./variant-updater";
import { updateAttributeValueImageUrls } from "./attribute-value-updater";
import { buildAttributeValueLookupCache } from "./variant-processor";
import { ensureUniqueProductSlug } from "../product-slug-utils";
import { invalidateAdminProductsListCache } from "../admin-products-read/list-cache";
import { isProductFlagOnlyUpdate, updateProductFlagsOnly } from "./product-flag-update";

const PRODUCT_UPDATE_TX_TIMEOUT_MS = 60000;
const PRODUCT_UPDATE_TX_MAX_WAIT_MS = 5000;

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  data: UpdateProductData
) {
  if (isProductFlagOnlyUpdate(data)) {
    return updateProductFlagsOnly(productId, data);
  }

  try {
    logger.info('Updating product', { productId });
    
    // Check if product exists
    const existing = await db.product.findUnique({
      where: { id: productId },
      include: {
        translations: true,
      }
    });

    if (!existing) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Product not found",
        detail: `Product with id '${productId}' does not exist`,
      };
    }

    // Execute everything in a transaction for atomicity and speed
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const dataToPersist: UpdateProductData = { ...data };
      if (data.slug && data.slug.trim()) {
        dataToPersist.slug = await ensureUniqueProductSlug({
          tx,
          slug: data.slug,
          locale: data.locale || "en",
          excludeProductId: productId,
        });
      }

      // Collect all variant images to exclude from main media (if media is being updated)
      const allVariantImages = await collectVariantImages(dataToPersist.variants, productId, tx);

      // 1. Update product base data
      const updateData = buildProductUpdateData(dataToPersist, allVariantImages, existing);

      // 2. Update translation
      await updateProductTranslation(productId, dataToPersist, tx);

      // 3. Update labels
      await updateProductLabels(productId, dataToPersist.labels, tx);

      // 3.5. Update ProductAttribute relations
      await updateProductAttributes(productId, dataToPersist.attributeIds, tx);

      // 4. Update variants
      if (dataToPersist.variants !== undefined) {
        // Get existing variants with their IDs and SKUs for matching
        const existingVariants = await tx.productVariant.findMany({
          where: { productId },
          select: { id: true, sku: true },
        });
        const existingVariantIds = new Set<string>(existingVariants.map((v: { id: string }) => v.id));
        // Create a map of SKU -> variant ID for quick lookup
        const existingSkuMap = new Map<string, string>();
        existingVariants.forEach((v: { id: string; sku: string | null }) => {
          if (v.sku) {
            existingSkuMap.set(v.sku.trim().toLowerCase(), v.id);
          }
        });
        const incomingVariantIds = new Set<string>();
        
        const locale = dataToPersist.locale || "en";
        const attributeValueCache = await buildAttributeValueLookupCache(
          dataToPersist.variants,
          tx,
        );
        const attributeKeyValueCache = new Map<string, string>();
        const usedSkuSet = new Set(
          existingVariants
            .map((v) => v.sku?.trim().toLowerCase())
            .filter((sku): sku is string => Boolean(sku)),
        );
        const verifiedExternalSkus = new Set<string>();

        if (dataToPersist.variants.length > 0) {
          for (const variant of dataToPersist.variants) {
            const variantId = await updateOrCreateVariant(
              variant,
              productId,
              locale,
              existingVariantIds,
              existingSkuMap,
              tx,
              attributeValueCache,
              attributeKeyValueCache,
              usedSkuSet,
              verifiedExternalSkus,
            );
            incomingVariantIds.add(variantId);
          }
        }
        
        // Delete variants that are no longer in the list
        const variantsToDelete = Array.from(existingVariantIds).filter(id => !incomingVariantIds.has(id));
        if (variantsToDelete.length > 0) {
          await tx.cartItem.deleteMany({
            where: { variantId: { in: variantsToDelete } },
          });
          await tx.orderItem.updateMany({
            where: { variantId: { in: variantsToDelete } },
            data: { variantId: null },
          });
          await tx.productVariant.deleteMany({
            where: {
              id: { in: variantsToDelete },
              productId,
            },
          });
          logger.info(`Deleted ${variantsToDelete.length} variant(s)`, { variantIds: variantsToDelete });
        }
      }

      // 5. Finally update the product record itself
      return await tx.product.update({
        where: { id: productId },
        data: updateData,
        include: {
          translations: true,
          variants: {
            include: {
              options: true,
            },
          },
          labels: true,
        },
      });
    }, {
      timeout: PRODUCT_UPDATE_TX_TIMEOUT_MS,
      maxWait: PRODUCT_UPDATE_TX_MAX_WAIT_MS,
    });

    await updateAttributeValueImageUrls(productId);

    invalidateAdminProductsListCache();

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("updateProduct error", { error: errorMessage });
    throw error;
  }
}




