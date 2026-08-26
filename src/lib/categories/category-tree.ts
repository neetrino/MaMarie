/**
 * Shared category tree types and helpers (used by API services and UI).
 */

export interface CategoryTreeNode {
  id: string;
  slug: string;
  title: string;
  fullPath: string;
  children: CategoryTreeNode[];
}

export interface FlatCategoryTreeNode extends CategoryTreeNode {
  level: number;
  treeKey: string;
}

/**
 * Depth-first flatten (matches legacy CategoryNavigation ordering).
 */
export function flattenCategoryTree(
  cats: CategoryTreeNode[],
  level = 0,
  parentPath = '',
): FlatCategoryTreeNode[] {
  const result: FlatCategoryTreeNode[] = [];
  for (const cat of cats) {
    const treeKey = parentPath ? `${parentPath}/${cat.id}` : cat.id;
    result.push({ ...cat, level, treeKey });
    if (cat.children?.length) {
      result.push(...flattenCategoryTree(cat.children, level + 1, treeKey));
    }
  }
  return result;
}
