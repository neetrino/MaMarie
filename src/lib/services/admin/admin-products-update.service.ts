import { updateProduct } from "./admin-products-update/product-update-operations";
import { isProductFlagOnlyUpdate } from "./admin-products-update/product-flag-update";
import { revalidateProductCache } from "./admin-products-update/cache-revalidator";
import type { UpdateProductData } from "./admin-products-update/types";

/**
 * Service for admin product update operations
 */
class AdminProductsUpdateService {
  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    data: UpdateProductData
  ) {
    const flagOnly = isProductFlagOnlyUpdate(data);
    const result = await updateProduct(productId, data);

    const productSlug = result.translations[0]?.slug;
    if (flagOnly) {
      void revalidateProductCache(productId, productSlug);
    } else {
      await revalidateProductCache(productId, productSlug);
    }

    return result;
  }
}

export const adminProductsUpdateService = new AdminProductsUpdateService();
