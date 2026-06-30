import { processImageUrl, type ImageUrlInput } from './image-utils';

/**
 * Extract first image URL from product media (JSON array).
 * Used by cart, orders, and product display to avoid duplicating logic.
 */
export type MediaItem = string | { url?: string; src?: string; value?: string } | unknown;

export function extractMediaUrl(media: unknown): string | null {
  if (!media || !Array.isArray(media) || media.length === 0) {
    return null;
  }

  return processImageUrl(media[0] as ImageUrlInput);
}
