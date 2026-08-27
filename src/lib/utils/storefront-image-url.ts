import { processImageUrl, smartSplitUrls, type ImageUrlInput } from './image-utils';

/** Inline data URLs must not be embedded in storefront JSON (multi‑MB payloads). */
export function isInlineDataImageUrl(url: string): boolean {
  return url.startsWith('data:image/');
}

const INLINE_COUNT_PREFIX = '__INLINE__:';

/** Public variant image endpoint — serves DB image without bloating PDP JSON. */
export function variantImageApiPath(variantId: string, index = 0): string {
  if (index <= 0) {
    return `/api/v1/products/variants/${variantId}/image`;
  }
  return `/api/v1/products/variants/${variantId}/image?index=${index}`;
}

/** Marker written by hydrate when variant images are inline base64 (count only). */
export function variantInlineImageCountMarker(count: number): string {
  return `${INLINE_COUNT_PREFIX}${Math.max(1, count)}`;
}

export function parseVariantInlineImageCountMarker(raw: string): number | null {
  if (!raw.startsWith(INLINE_COUNT_PREFIX)) {
    return null;
  }
  const count = Number.parseInt(raw.slice(INLINE_COUNT_PREFIX.length), 10);
  return Number.isFinite(count) && count > 0 ? count : null;
}

/** Public product.media endpoint — serves DB bytes without bloating catalog/PDP JSON. */
export function productMediaImageApiPath(productId: string, index: number): string {
  return `/api/v1/products/media/${productId}/${index}/image`;
}

/**
 * Maps a `product.media` item to a storefront-safe URL.
 * Base64 values are replaced with the product media image API route.
 */
export function toProductMediaStorefrontUrl(
  productId: string,
  index: number,
  raw: ImageUrlInput,
): string | null {
  const processed = processImageUrl(raw);
  if (!processed) {
    return null;
  }

  if (isInlineDataImageUrl(processed)) {
    return productMediaImageApiPath(productId, index);
  }

  return processed;
}

export function mapProductMediaToStorefrontUrls(
  productId: string,
  media: unknown[] | null | undefined,
): string[] {
  if (!Array.isArray(media)) {
    return [];
  }

  const urls: string[] = [];
  media.forEach((item, index) => {
    const url = toProductMediaStorefrontUrl(productId, index, item as ImageUrlInput);
    if (url) {
      urls.push(url);
    }
  });
  return urls;
}

/**
 * Maps a variant `imageUrl` column to ordered storefront-safe gallery URLs.
 * Inline base64 → `/api/v1/products/variants/:id/image?index=N` (one URL per image).
 */
export function toVariantStorefrontImageUrls(
  variantId: string,
  raw: string | null | undefined,
): string[] {
  if (!raw) {
    return [];
  }

  const inlineCount = parseVariantInlineImageCountMarker(raw);
  if (inlineCount !== null) {
    return Array.from({ length: inlineCount }, (_, index) =>
      variantImageApiPath(variantId, index)
    );
  }

  // Already hydrated to one or more API paths (comma-separated).
  if (raw.includes(`/api/v1/products/variants/${variantId}/image`)) {
    return smartSplitUrls(raw).filter(Boolean);
  }

  const processed = smartSplitUrls(raw)
    .map((url) => processImageUrl(url))
    .filter((url): url is string => url !== null);

  if (processed.length === 0) {
    return [];
  }

  return processed.map((url, index) =>
    isInlineDataImageUrl(url) ? variantImageApiPath(variantId, index) : url
  );
}

/**
 * Maps a variant `imageUrl` column to the primary storefront-safe URL.
 */
export function toVariantStorefrontImageUrl(
  variantId: string,
  raw: string | null | undefined,
): string | null {
  return toVariantStorefrontImageUrls(variantId, raw)[0] ?? null;
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
