/**
 * Utilities for collecting variant images
 */

import { smartSplitUrls } from '@/lib/utils/image-utils';
import type { ColorData } from '../types';

/**
 * Collects variant images from color data
 */
export function collectVariantImagesFromColors(colors: ColorData[]): Set<string> {
  const variantImages = new Set<string>();

  colors.forEach((c) => {
    c.images.forEach((img) => {
      if (img) {
        variantImages.add(img);
        const normalized = img.startsWith('/') ? img : `/${img}`;
        variantImages.add(normalized);
      }
    });
  });

  return variantImages;
}

function addUrlVariants(target: Set<string>, url: string): void {
  if (!url) {
    return;
  }
  target.add(url);
  if (url.startsWith('data:')) {
    return;
  }
  const normalizedWithSlash = url.startsWith('/') ? url : `/${url}`;
  const normalizedWithoutSlash = url.startsWith('/') ? url.substring(1) : url;
  target.add(normalizedWithSlash);
  target.add(normalizedWithoutSlash);
  const urlWithoutQuery = url.split('?')[0];
  if (urlWithoutQuery !== url) {
    target.add(urlWithoutQuery);
    target.add(urlWithoutQuery.startsWith('/') ? urlWithoutQuery : `/${urlWithoutQuery}`);
  }
}

/**
 * Collects variant images from product variants
 */
export function collectVariantImagesFromProductVariants(variants: unknown[]): Set<string> {
  const variantImages = new Set<string>();

  variants.forEach((variant: unknown) => {
    if (!variant || typeof variant !== 'object') {
      return;
    }
    const imageUrl = (variant as { imageUrl?: unknown }).imageUrl;
    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return;
    }
    for (const url of smartSplitUrls(imageUrl)) {
      addUrlVariants(variantImages, url);
    }
  });

  return variantImages;
}

