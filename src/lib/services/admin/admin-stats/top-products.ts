import { db } from "@white-shop/db";

/**
 * Extract image from product media
 */
function extractImageFromMedia(media: unknown[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const firstMedia = media[0];

  if (typeof firstMedia === "string") {
    return firstMedia;
  }

  if (firstMedia && typeof firstMedia === "object" && "url" in firstMedia) {
    const mediaObj = firstMedia as { url?: string };
    return mediaObj.url || null;
  }

  return null;
}

/**
 * Get top products for dashboard (grouped SQL, then hydrate top variants only).
 */
export async function getTopProducts(limit: number = 5) {
  const grouped = await db.orderItem.groupBy({
    by: ["variantId"],
    where: { variantId: { not: null } },
    _sum: { quantity: true, total: true },
    _count: { _all: true },
  });

  const ranked = grouped
    .filter((row) => row.variantId)
    .map((row) => ({
      variantId: row.variantId as string,
      totalQuantity: row._sum.quantity ?? 0,
      totalRevenue: row._sum.total ?? 0,
      orderCount: row._count._all,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);

  if (ranked.length === 0) {
    return [];
  }

  const variantIds = ranked.map((row) => row.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: {
      id: true,
      productId: true,
      sku: true,
      product: {
        select: {
          media: true,
          translations: {
            where: { locale: "en" },
            take: 1,
            select: { title: true },
          },
        },
      },
    },
  });

  const variantById = new Map(variants.map((variant) => [variant.id, variant]));

  return ranked.map((row) => {
    const variant = variantById.get(row.variantId);
    const product = variant?.product;
    const title = product?.translations?.[0]?.title || "Unknown Product";

    return {
      variantId: row.variantId,
      productId: variant?.productId || "",
      title,
      sku: variant?.sku || "N/A",
      totalQuantity: row.totalQuantity,
      totalRevenue: row.totalRevenue,
      orderCount: row.orderCount,
      image: extractImageFromMedia(
        Array.isArray(product?.media) ? (product.media as unknown[]) : undefined
      ),
    };
  });
}
