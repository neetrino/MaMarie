import { processImageUrl, type ImageUrlInput } from './image-utils';
import { toProductMediaStorefrontUrl } from './storefront-image-url';

/**
 * Extract first image URL from product media (JSON array).
 * When productId is set, inline base64 is rewritten to the storefront media API.
 */
export type MediaItem = string | { url?: string; src?: string; value?: string } | unknown;

export function extractMediaUrl(media: unknown, productId?: string): string | null {
  if (!media || !Array.isArray(media) || media.length === 0) {
    return null;
  }

  const first = media[0] as ImageUrlInput;
  if (productId) {
    return toProductMediaStorefrontUrl(productId, 0, first);
  }

  return processImageUrl(first);
}
