interface CategoryParentFields {
  parentId: string | null;
  parentIds?: string[];
}

/** Returns all parent category IDs for a category (supports legacy single parentId). */
export function getEffectiveParentIds(category: CategoryParentFields): string[] {
  if (category.parentIds && category.parentIds.length > 0) {
    return category.parentIds;
  }

  if (category.parentId) {
    return [category.parentId];
  }

  return [];
}

/** Deduplicates and removes empty parent IDs. */
export function normalizeParentIds(parentIds: string[]): string[] {
  return Array.from(new Set(parentIds.filter(Boolean)));
}

/** Primary parent kept for legacy tree queries and Prisma relation. */
export function syncPrimaryParentId(parentIds: string[]): string | null {
  return parentIds[0] ?? null;
}

/** True when category has no parents (top-level). */
export function isRootCategory(category: CategoryParentFields): boolean {
  return getEffectiveParentIds(category).length === 0;
}

/** Prisma filter for direct children of a parent category. */
export function buildDirectChildCategoryWhere(parentId: string) {
  return {
    OR: [{ parentId }, { parentIds: { has: parentId } }],
  };
}
