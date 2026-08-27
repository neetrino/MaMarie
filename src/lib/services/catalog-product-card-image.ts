import { computeProductGalleryUrls } from "./products-slug/product-gallery-urls";
import { selectDefaultVariant } from "../products/select-default-variant";
import { type ImageUrlInput } from "../utils/image-utils";
import {
  toProductMediaStorefrontUrl,
  toVariantStorefrontImageUrls,
} from "../utils/storefront-image-url";

interface CatalogVariantImageSource {
  id: string;
  imageUrl?: string | null;
  position?: number | null;
  isMain?: boolean | null;
  published?: boolean | null;
}

/**
 * Resolves ordered storefront URLs for the default (Main) variant gallery.
 * Falls back to product media / any variant when Main has no images.
 */
export function resolveCatalogProductCardImages(
  productId: string,
  media: unknown[] | null | undefined,
  variants: CatalogVariantImageSource[] | null | undefined,
  presentationVariant?: CatalogVariantImageSource | null,
): string[] {
  const variantList = Array.isArray(variants) ? variants : [];
  const defaultVariant = presentationVariant ?? selectDefaultVariant(variantList);

  if (defaultVariant?.imageUrl) {
    const urls = toVariantStorefrontImageUrls(
      defaultVariant.id,
      defaultVariant.imageUrl,
    );
    if (urls.length > 0) {
      return urls;
    }
  }

  if (Array.isArray(media) && media.length > 0) {
    const mediaUrls: string[] = [];
    media.forEach((item, index) => {
      const url = toProductMediaStorefrontUrl(productId, index, item as ImageUrlInput);
      if (url) {
        mediaUrls.push(url);
      }
    });
    if (mediaUrls.length > 0) {
      return mediaUrls;
    }
  }

  for (const variant of variantList) {
    const urls = toVariantStorefrontImageUrls(variant.id, variant.imageUrl);
    if (urls.length > 0) {
      return urls;
    }
  }

  return [];
}

/**
 * Resolves the storefront card image from Main Variant (then media / other variants).
 */
export function resolveCatalogProductCardImage(
  productId: string,
  media: unknown[] | null | undefined,
  variants: CatalogVariantImageSource[] | null | undefined,
  presentationVariant?: CatalogVariantImageSource | null,
): string | null {
  const images = resolveCatalogProductCardImages(
    productId,
    media,
    variants,
    presentationVariant,
  );
  if (images.length > 0) {
    return images[0];
  }

  const variantList = Array.isArray(variants) ? variants : [];
  const galleryUrls = computeProductGalleryUrls(
    productId,
    media,
    variantList.map((variant) => ({
      id: variant.id,
      imageUrl: variant.imageUrl ?? null,
      position: variant.position ?? undefined,
    }))
  );

  return galleryUrls[0] ?? null;
}
