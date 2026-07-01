import { db } from '@white-shop/db';
import { Prisma } from '@white-shop/db';
import { variantImageApiPath } from '../../utils/storefront-image-url';

const INLINE_PROXY = '__INLINE__';

type VariantRow = {
  id: string;
  imageUrl?: string | null;
};

/**
 * Loads storefront-safe variant image refs without pulling multi-MB base64 from Postgres.
 */
export async function hydrateVariantImageUrls(variants: VariantRow[]): Promise<void> {
  if (variants.length === 0) {
    return;
  }

  const ids = variants.map((variant) => variant.id);
  const rows = await db.$queryRaw<Array<{ id: string; imageRef: string | null }>>(
    Prisma.sql`
      SELECT
        id,
        CASE
          WHEN "imageUrl" IS NULL OR btrim("imageUrl") = '' THEN NULL
          WHEN "imageUrl" LIKE 'data:image/%' THEN ${INLINE_PROXY}
          ELSE split_part("imageUrl", ',', 1)
        END AS "imageRef"
      FROM "product_variants"
      WHERE id IN (${Prisma.join(ids)})
    `,
  );

  const refById = new Map(rows.map((row) => [row.id, row.imageRef]));

  for (const variant of variants) {
    const ref = refById.get(variant.id) ?? null;
    variant.imageUrl =
      ref === INLINE_PROXY ? variantImageApiPath(variant.id) : ref;
  }
}
