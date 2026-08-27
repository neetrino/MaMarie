import {
  normalizeUrlForComparison,
  processImageUrl,
  separateMainAndVariantImages,
  smartSplitUrls,
  type ImageUrlInput,
} from "../../utils/image-utils";
import {
  toProductMediaStorefrontUrl,
  toVariantStorefrontImageUrls,
} from "../../utils/storefront-image-url";

/** Minimal variant shape for gallery URL merge. */
export interface GalleryVariantInput {
  id: string;
  imageUrl: string | null;
  position?: number;
}

/**
 * Build ordered, deduplicated storefront gallery URLs from DB media + variant images.
 * Inline base64 is rewritten to product/variant image API routes.
 */
export function computeProductGalleryUrls(
  productId: string,
  media: unknown[] | null | undefined,
  variants: GalleryVariantInput[] | null | undefined
): string[] {
  const mediaItems: ImageUrlInput[] = Array.isArray(media)
    ? (media as ImageUrlInput[])
    : [];
  const variantList = Array.isArray(variants) ? variants : [];
  const variantRaws: string[] = [];

  variantList.forEach((variant) => {
    if (variant.imageUrl) {
      variantRaws.push(...smartSplitUrls(variant.imageUrl));
    }
  });

  const { main } = separateMainAndVariantImages(mediaItems, variantRaws);
  const mainSet = new Set(main.map((url) => normalizeUrlForComparison(url)));
  const allImages: string[] = [];
  const seen = new Set<string>();

  mediaItems.forEach((item, index) => {
    const processed = processImageUrl(item);
    if (!processed || !mainSet.has(normalizeUrlForComparison(processed))) {
      return;
    }
    const storefront = toProductMediaStorefrontUrl(productId, index, processed);
    if (!storefront || seen.has(storefront)) {
      return;
    }
    seen.add(storefront);
    allImages.push(storefront);
  });

  const sortedVariants = [...variantList].sort((a, b) => {
    const aPos = typeof a.position === "number" ? a.position : 0;
    const bPos = typeof b.position === "number" ? b.position : 0;
    return aPos - bPos;
  });

  sortedVariants.forEach((variant) => {
    const storefrontUrls = toVariantStorefrontImageUrls(variant.id, variant.imageUrl);
    storefrontUrls.forEach((storefront) => {
      if (!storefront || seen.has(storefront)) {
        return;
      }
      seen.add(storefront);
      allImages.push(storefront);
    });
  });

  return allImages;
}
