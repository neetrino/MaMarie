import { extractMediaUrl } from "../utils/extractMediaUrl";
import { toVariantStorefrontImageUrl } from "../utils/storefront-image-url";

/**
 * Cart thumbnail for the variant the shopper added.
 * Product media is only a fallback when that variant has no image.
 */
export function resolveCartLineImage(
  productId: string,
  variantId: string,
  variantImageUrl: string | null | undefined,
  media: unknown,
): string | null {
  const variantImage = toVariantStorefrontImageUrl(variantId, variantImageUrl);
  if (variantImage) {
    return variantImage;
  }

  return extractMediaUrl(media, productId);
}
