import { computeProductGalleryUrls } from "./products-slug/product-gallery-urls";

interface CatalogVariantImageSource {
  id: string;
  imageUrl?: string | null;
  position?: number;
}

/**
 * Resolves the storefront card image from DB media, then variant images.
 */
export function resolveCatalogProductCardImage(
  productId: string,
  media: unknown[] | null | undefined,
  variants: CatalogVariantImageSource[] | null | undefined,
): string | null {
  const variantList = Array.isArray(variants) ? variants : [];
  const galleryUrls = computeProductGalleryUrls(
    productId,
    media,
    variantList.map((variant) => ({
      id: variant.id,
      imageUrl: variant.imageUrl ?? null,
      position: variant.position,
    }))
  );

  return galleryUrls[0] ?? null;
}
