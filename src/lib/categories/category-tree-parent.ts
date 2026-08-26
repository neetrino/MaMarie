/** Parent category id from a flattened treeKey (`id` or `ancestor/.../parent/id`). */
export function getCategoryTreeParentId(treeKey: string): string | undefined {
  const parts = treeKey.split('/').filter(Boolean);
  if (parts.length < 2) {
    return undefined;
  }
  return parts[parts.length - 2];
}

/** Prisma cuid values have no hyphens; storefront slugs are kebab-case. */
export function isCategoryIdFilterValue(value: string): boolean {
  return /^c[a-z0-9]{20,}$/i.test(value.trim());
}
