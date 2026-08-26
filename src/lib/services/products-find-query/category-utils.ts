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

const PUBLISHED_CATEGORY_WHERE = {
  published: true,
  deletedAt: null,
} as const;

/**
 * Find category by id (catalog sidebar) or slug (legacy/home links).
 * Subcategories often share slugs (`dresses` under girls and boys) — id is unambiguous.
 */
export async function findCategoryBySlug(
  categorySlug: string
): Promise<{ id: string } | null> {
  const value = categorySlug.trim();
  logger.debug('Looking for category', { category: value });

  const byId = await db.category.findFirst({
    where: { id: value, ...PUBLISHED_CATEGORY_WHERE },
    select: { id: true },
  });
  if (byId) {
    return byId;
  }

  const bySlug = await db.category.findMany({
    where: {
      ...PUBLISHED_CATEGORY_WHERE,
      translations: {
        some: {
          slug: value,
        },
      },
    },
    select: { id: true },
    take: 2,
  });

  if (bySlug.length === 1) {
    return bySlug[0];
  }
  if (bySlug.length > 1) {
    logger.warn('Multiple categories share slug; use category id to filter a subcategory', {
      slug: value,
    });
    return bySlug[0];
  }

  logger.warn('Category not found', { category: value });
  return null;
}
