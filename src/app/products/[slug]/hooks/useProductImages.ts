import { useMemo } from 'react';
import {
  processImageUrl,
  smartSplitUrls,
  normalizeUrlForComparison,
  cleanImageUrls,
} from '../../../../lib/utils/image-utils';
import { sortVariantsForPresentation } from '@/lib/products/select-default-variant';
import type { Product, ProductVariant } from '../types';

function collectUniqueImages(urls: string[]): string[] {
  const cleaned = cleanImageUrls(urls);
  const result: string[] = [];
  const seen = new Set<string>();

  cleaned.forEach((img) => {
    const processed = processImageUrl(img) || img;
    const normalized = normalizeUrlForComparison(processed);
    if (!seen.has(normalized)) {
      result.push(img);
      seen.add(normalized);
    }
  });

  return result;
}

function collectVariantImages(variant: ProductVariant): string[] {
  if (Array.isArray(variant.images) && variant.images.length > 0) {
    return collectUniqueImages(variant.images);
  }
  if (variant.imageUrl) {
    return collectUniqueImages(smartSplitUrls(variant.imageUrl));
  }
  return [];
}

/**
 * Full product gallery — Main Variant images first, then other variants, then media fallback.
 */
export function useProductImages(product: Product | null): string[] {
  return useMemo(() => {
    if (!product) return [];

    const mainImages = Array.isArray(product.media) ? product.media : [];
    const variantImages: string[] = [];

    if (product.variants && Array.isArray(product.variants)) {
      const sortedVariants = sortVariantsForPresentation(
        product.variants.map((v) => ({
          ...v,
          isMain: v.isMain === true,
        }))
      );

      sortedVariants.forEach((v) => {
        variantImages.push(...collectVariantImages(v));
      });
    }

    return collectUniqueImages([
      ...variantImages,
      ...mainImages.map((item) =>
        typeof item === 'string' ? item : (item as { url?: string }).url || ''
      ).filter(Boolean),
    ]);
  }, [product]);
}

/**
 * Gallery for the currently selected variant (falls back to full product gallery).
 */
export function resolveVariantGalleryImages(
  variant: ProductVariant | null,
  fallbackImages: string[]
): string[] {
  if (!variant) {
    return fallbackImages;
  }

  const variantOnly = collectVariantImages(variant);
  return variantOnly.length > 0 ? variantOnly : fallbackImages;
}
