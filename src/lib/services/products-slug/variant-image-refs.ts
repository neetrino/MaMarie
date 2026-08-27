import { db } from '@white-shop/db';
import { Prisma } from '@white-shop/db';
import {
  variantImageApiPath,
  variantInlineImageCountMarker,
} from '../../utils/storefront-image-url';

type VariantRow = {
  id: string;
  imageUrl?: string | null;
};

type HydrateRow = {
  id: string;
  imageRef: string | null;
  inlineCount: number | null;
};

/**
 * Loads storefront-safe variant image refs without pulling multi-MB base64 from Postgres.
 * Preserves multi-image galleries via indexed API paths or remote URL CSV.
 */
export async function hydrateVariantImageUrls(variants: VariantRow[]): Promise<void> {
  if (variants.length === 0) {
    return;
  }

  const ids = variants.map((variant) => variant.id);
  const rows = await db.$queryRaw<HydrateRow[]>(
    Prisma.sql`
      SELECT
        id,
        CASE
          WHEN "imageUrl" IS NULL OR btrim("imageUrl") = '' THEN NULL
          WHEN position('data:image/' in "imageUrl") > 0 THEN NULL
          ELSE "imageUrl"
        END AS "imageRef",
        CASE
          WHEN "imageUrl" IS NULL OR btrim("imageUrl") = '' THEN NULL
          WHEN position('data:image/' in "imageUrl") > 0 THEN
            GREATEST(
              1,
              (
                length("imageUrl") - length(replace("imageUrl", 'data:image/', ''))
              ) / length('data:image/')
            )::int
          ELSE NULL
        END AS "inlineCount"
      FROM "product_variants"
      WHERE id IN (${Prisma.join(ids)})
    `,
  );

  const rowById = new Map(rows.map((row) => [row.id, row]));

  for (const variant of variants) {
    const row = rowById.get(variant.id);
    if (!row) {
      variant.imageUrl = null;
      continue;
    }

    if (row.inlineCount != null && row.inlineCount > 0) {
      // Expand to indexed API paths so PDP/catalog can paginate each image.
      variant.imageUrl = Array.from({ length: row.inlineCount }, (_, index) =>
        variantImageApiPath(variant.id, index)
      ).join(',');
      continue;
    }

    variant.imageUrl = row.imageRef;
  }
}

/** @deprecated Prefer hydrateVariantImageUrls — kept for marker helper reuse. */
export function buildInlineCountMarker(count: number): string {
  return variantInlineImageCountMarker(count);
}
