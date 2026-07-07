import { db } from "@white-shop/db";
import { buildDirectChildCategoryWhere } from "../../categories/category-parent-ids";
import { logger } from "../../utils/logger";

/**
 * Get all child category IDs recursively
 */
export async function getAllChildCategoryIds(parentId: string): Promise<string[]> {
  const children = await db.category.findMany({
    where: {
      ...buildDirectChildCategoryWhere(parentId),
      published: true,
      deletedAt: null,
    },
    select: { id: true },
  });
  
  let allChildIds = children.map((c: { id: string }) => c.id);
  
  // Recursively get children of children
  for (const child of children) {
    const grandChildren = await getAllChildCategoryIds(child.id);
    allChildIds = [...allChildIds, ...grandChildren];
  }
  
  return allChildIds;
}

/**
 * Find category by slug — locale-agnostic (slug is stable across translations).
 */
export async function findCategoryBySlug(
  categorySlug: string
): Promise<{ id: string } | null> {
  logger.debug('Looking for category', { category: categorySlug });

  const categoryDoc = await db.category.findFirst({
    where: {
      translations: {
        some: {
          slug: categorySlug,
        },
      },
      published: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (categoryDoc) {
    logger.info('Category found', { id: categoryDoc.id, slug: categorySlug });
  } else {
    logger.warn('Category not found', { category: categorySlug });
  }

  return categoryDoc;
}
