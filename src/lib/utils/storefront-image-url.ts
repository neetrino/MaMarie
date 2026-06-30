import { processImageUrl, smartSplitUrls } from './image-utils';

/** Inline data URLs must not be embedded in storefront JSON (multi‑MB payloads). */
export function isInlineDataImageUrl(url: string): boolean {
  return url.startsWith('data:image/');
}

/** Public variant image endpoint — serves DB image without bloating PDP JSON. */
export function variantImageApiPath(variantId: string): string {
  return `/api/v1/products/variants/${variantId}/image`;
}

/**
 * Maps a variant `imageUrl` column to a storefront-safe URL.
 * Base64 values are replaced with the variant image API route.
 */
export function toVariantStorefrontImageUrl(
  variantId: string,
  raw: string | null | undefined,
): string | null {
  if (!raw) {
    return null;
  }

  const processed = smartSplitUrls(raw)
    .map((url) => processImageUrl(url))
    .filter((url): url is string => url !== null);

  if (processed.length === 0) {
    return null;
  }

  if (processed.some(isInlineDataImageUrl)) {
    return variantImageApiPath(variantId);
  }

  return processed.join(',');
}

/** Drops inline data images from gallery arrays returned by the API. */
export function stripInlineDataImages(urls: string[]): string[] {
  return urls.filter((url) => !isInlineDataImageUrl(url));
}

/**
 * Attribute value images with inline data are omitted from PDP JSON until uploaded to storage.
 */
export function toAttributeValueStorefrontImageUrl(
  raw: string | null | undefined,
): string | null {
  if (!raw) {
    return null;
  }

  const processed = processImageUrl(raw);
  if (!processed || isInlineDataImageUrl(processed)) {
    return null;
  }

  return processed;
}
