import { computeProductGalleryUrls } from './products-slug/product-gallery-urls';
import { processImageUrl } from '../utils/image-utils';
import {
  stripInlineDataImages,
  toVariantStorefrontImageUrl,
} from '../utils/storefront-image-url';

interface CatalogVariantImageSource {
  id: string;
  imageUrl?: string | null;
  position?: number;
}

/**
 * Resolves the storefront card image for catalog list payloads.
 * Falls back to variant images (via the variant image API) when product.media is empty.
 */
export function resolveCatalogProductCardImage(
  media: unknown[] | null | undefined,
  variants: CatalogVariantImageSource[] | null | undefined,
  preferredVariantId?: string | null
): string | null {
  const variantList = Array.isArray(variants) ? variants : [];
  const galleryUrls = computeProductGalleryUrls(
    media,
    variantList.map((variant) => ({
      imageUrl: variant.imageUrl ?? null,
      position: variant.position,
    }))
  );

  const externalUrls = stripInlineDataImages(
    galleryUrls
      .map((url) => processImageUrl(url))
      .filter((url): url is string => url !== null)
  );
  if (externalUrls.length > 0) {
    return externalUrls[0];
  }

  const preferredVariant = preferredVariantId
    ? variantList.find((variant) => variant.id === preferredVariantId)
    : undefined;
  const variantWithImage =
    preferredVariant?.imageUrl != null && preferredVariant.imageUrl !== ''
      ? preferredVariant
      : variantList.find((variant) => Boolean(variant.imageUrl));

  if (variantWithImage) {
    return toVariantStorefrontImageUrl(variantWithImage.id, variantWithImage.imageUrl);
  }

  return null;
}
