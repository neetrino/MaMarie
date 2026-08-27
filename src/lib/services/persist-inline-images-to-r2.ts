import { nanoid } from 'nanoid';
import { isR2Configured, uploadToR2 } from '@/lib/r2';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';
import { parseDataUrlImage } from '@/lib/utils/serve-stored-image';
import { logger } from '@/lib/utils/logger';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

async function uploadDataUrlToR2(
  dataUrl: string,
  keyPrefix: string
): Promise<string> {
  const parsed = parseDataUrlImage(dataUrl);
  if (!parsed) {
    throw new Error('Invalid data URL image');
  }

  const ext = MIME_TO_EXT[parsed.mime] ?? 'jpg';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${keyPrefix}/${date}-${nanoid(10)}.${ext}`;
  const url = await uploadToR2(key, parsed.buffer, parsed.mime);
  if (!url) {
    throw new Error('R2 upload returned null');
  }
  return url;
}

/**
 * Replaces inline `data:image/...` entries with R2 public URLs.
 * HTTP(S)/relative URLs are kept as-is. No-op when there are no inline images.
 * Throws when inline images exist but R2 is not configured (avoids re-storing base64).
 */
export async function persistInlineImageUrlsToR2(
  raw: string | null | undefined,
  keyPrefix = 'products/variants'
): Promise<string | undefined> {
  if (!raw || !raw.trim()) {
    return undefined;
  }

  const parts = smartSplitUrls(raw)
    .map((url) => processImageUrl(url))
    .filter((url): url is string => url !== null);

  if (parts.length === 0) {
    return undefined;
  }

  const hasInline = parts.some((url) => url.startsWith('data:image/'));
  if (!hasInline) {
    return parts.join(',');
  }

  if (!isR2Configured()) {
    throw new Error(
      'R2 is not configured but inline images were provided. Set R2_* env vars to store images outside the database.'
    );
  }

  const resolved: string[] = [];
  for (const part of parts) {
    if (part.startsWith('data:image/')) {
      const uploaded = await uploadDataUrlToR2(part, keyPrefix);
      resolved.push(uploaded);
      logger.debug('Persisted inline image to R2', { keyPrefix, url: uploaded });
    } else {
      resolved.push(part);
    }
  }

  return resolved.join(',');
}

/**
 * Persists any inline images inside a product.media JSON array to R2.
 */
export async function persistMediaInlineImagesToR2(
  media: unknown[] | null | undefined
): Promise<unknown[] | undefined> {
  if (!Array.isArray(media)) {
    return undefined;
  }

  const next: unknown[] = [];
  for (const item of media) {
    if (typeof item === 'string') {
      const persisted = await persistInlineImageUrlsToR2(item, 'products/media');
      if (persisted) {
        next.push(persisted);
      }
      continue;
    }

    if (item && typeof item === 'object') {
      const record = item as { url?: string; src?: string; value?: string };
      const raw = record.url ?? record.src ?? record.value;
      if (typeof raw === 'string' && raw.startsWith('data:image/')) {
        const persisted = await persistInlineImageUrlsToR2(raw, 'products/media');
        next.push({ ...record, url: persisted });
      } else {
        next.push(item);
      }
      continue;
    }

    next.push(item);
  }

  return next;
}
