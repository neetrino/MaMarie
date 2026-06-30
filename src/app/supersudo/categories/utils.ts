import { getEffectiveParentIds } from '../../../lib/categories/category-parent-ids';
import type { Category, CategoryWithLevel } from './types';

/**
 * Build category tree with hierarchy levels
 */
export function buildCategoryTree(categories: Category[]): CategoryWithLevel[] {
  type CategoryWithLevelInternal = Category & { level: number; children?: CategoryWithLevelInternal[] };
  
  const categoryMap = new Map<string, CategoryWithLevelInternal>();
  const rootCategories: CategoryWithLevelInternal[] = [];

  // First pass: create map
  categories.forEach(cat => {
    const { children, ...catWithoutChildren } = cat;
    categoryMap.set(cat.id, { ...catWithoutChildren, level: 0 });
  });

  // Second pass: build tree
  categories.forEach(cat => {
    const categoryNode = categoryMap.get(cat.id)!;
    const parentIds = getEffectiveParentIds(cat);

    if (parentIds.length === 0) {
      rootCategories.push(categoryNode);
      return;
    }

    parentIds.forEach((parentId) => {
      if (!categoryMap.has(parentId)) {
        return;
      }

      const parent = categoryMap.get(parentId)!;
      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push({
        ...categoryNode,
        level: (parent.level || 0) + 1,
      });
    });
  });

  // Flatten tree for display; treeKey is unique even when a category has multiple parents
  const flattenTree = (
    nodes: CategoryWithLevelInternal[],
    result: CategoryWithLevel[] = [],
    parentPath = '',
  ): CategoryWithLevel[] => {
    nodes.forEach((node) => {
      const treeKey = parentPath ? `${parentPath}/${node.id}` : node.id;
      result.push({ ...node, level: node.level, treeKey });
      if (node.children) {
        flattenTree(node.children, result, treeKey);
      }
    });
    return result;
  };

  return flattenTree(rootCategories);
}




