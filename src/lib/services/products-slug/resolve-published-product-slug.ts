import { db } from "@white-shop/db";

/**
 * Resolve published product id by URL slug (indexed translation lookup).
 * Locale-agnostic — matches storefront slug routing (any locale slug).
 */
export async function resolvePublishedProductIdBySlug(slug: string): Promise<string | null> {
  const row = await db.productTranslation.findFirst({
    where: {
      slug,
      product: {
        published: true,
        deletedAt: null,
      },
    },
    select: { productId: true },
  });
  return row?.productId ?? null;
}
