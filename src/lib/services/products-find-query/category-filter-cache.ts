import { unstable_cache } from 'next/cache';
import { findCategoryBySlug, getAllChildCategoryIds } from './category-utils';

async function resolveCategoryFilterIdsUncached(slug: string): Promise<string[] | null> {
  const categoryDoc = await findCategoryBySlug(slug);
  if (!categoryDoc) {
    return null;
  }

  const childCategoryIds = await getAllChildCategoryIds(categoryDoc.id);
  return [categoryDoc.id, ...childCategoryIds];
}

/**
 * Resolves a category slug to parent + descendant IDs for catalog filters.
 * Cached across requests — home hero girls/boys links hit this on every visit.
 */
export async function resolveCategoryFilterIds(slug: string): Promise<string[] | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  return unstable_cache(
    () => resolveCategoryFilterIdsUncached(normalizedSlug),
    ['storefront-category-filter-ids', normalizedSlug],
    { revalidate: 300 }
  )();
}
