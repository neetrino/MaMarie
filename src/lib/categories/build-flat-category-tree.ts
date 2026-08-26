import { getEffectiveParentIds } from './category-parent-ids';

export interface CategoryTreeIdentity {
  id: string;
  parentId?: string | null;
  parentIds?: string[];
}

export type FlatCategoryTreeItem<T extends CategoryTreeIdentity> = T & {
  level: number;
  treeKey: string;
};

interface CategoryTreeNodeInternal<T extends CategoryTreeIdentity> {
  item: T;
  children: CategoryTreeNodeInternal<T>[];
}

function attachCategoryToParents<T extends CategoryTreeIdentity>(
  categories: T[],
  nodeById: Map<string, CategoryTreeNodeInternal<T>>,
  roots: CategoryTreeNodeInternal<T>[],
): void {
  for (const category of categories) {
    const node = nodeById.get(category.id);
    if (!node) {
      continue;
    }

    const parentIds = getEffectiveParentIds({
      parentId: category.parentId ?? null,
      parentIds: category.parentIds,
    });

    if (parentIds.length === 0) {
      roots.push(node);
      continue;
    }

    let attachedToParent = false;
    for (const parentId of parentIds) {
      if (parentId === category.id) {
        continue;
      }
      const parent = nodeById.get(parentId);
      if (parent) {
        parent.children.push(node);
        attachedToParent = true;
      }
    }

    if (!attachedToParent) {
      roots.push(node);
    }
  }
}

function flattenCategoryNodes<T extends CategoryTreeIdentity>(
  nodes: CategoryTreeNodeInternal<T>[],
  level: number,
  parentPath: string,
  result: FlatCategoryTreeItem<T>[],
): void {
  for (const node of nodes) {
    const treeKey = parentPath ? `${parentPath}/${node.item.id}` : node.item.id;
    result.push({ ...node.item, level, treeKey });
    const ancestorIds = parentPath ? parentPath.split('/') : [];
    if (ancestorIds.includes(node.item.id) || node.children.length === 0) {
      continue;
    }
    flattenCategoryNodes(node.children, level + 1, treeKey, result);
  }
}

/**
 * Depth-first list: each parent followed by its subcategories (with level + unique treeKey).
 */
export function buildFlatCategoryTree<T extends CategoryTreeIdentity>(
  categories: T[],
): FlatCategoryTreeItem<T>[] {
  const nodeById = new Map<string, CategoryTreeNodeInternal<T>>();
  const roots: CategoryTreeNodeInternal<T>[] = [];

  for (const category of categories) {
    nodeById.set(category.id, { item: category, children: [] });
  }

  attachCategoryToParents(categories, nodeById, roots);

  const result: FlatCategoryTreeItem<T>[] = [];
  flattenCategoryNodes(roots, 0, '', result);
  return result;
}

export function filterFlatCategoryTreeByTitle<T extends CategoryTreeIdentity>(
  items: FlatCategoryTreeItem<T>[],
  query: string,
  getTitle: (item: FlatCategoryTreeItem<T>) => string,
): FlatCategoryTreeItem<T>[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  const includeKeys = new Set<string>();
  for (const item of items) {
    if (!getTitle(item).toLowerCase().includes(normalized)) {
      continue;
    }

    const parts = item.treeKey.split('/');
    let path = '';
    for (const part of parts) {
      path = path ? `${path}/${part}` : part;
      includeKeys.add(path);
    }
  }

  return items.filter((item) => includeKeys.has(item.treeKey));
}

export function paginateFlatCategoryTreeGroups<T extends CategoryTreeIdentity>(
  items: FlatCategoryTreeItem<T>[],
  page: number,
  itemsPerPage: number,
): { pageItems: FlatCategoryTreeItem<T>[]; totalPages: number } {
  const groups: FlatCategoryTreeItem<T>[][] = [];
  let currentGroup: FlatCategoryTreeItem<T>[] = [];

  for (const item of items) {
    if (item.level === 0 && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(item);
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  const pages: FlatCategoryTreeItem<T>[][] = [];
  let pageBucket: FlatCategoryTreeItem<T>[] = [];
  for (const group of groups) {
    if (pageBucket.length > 0 && pageBucket.length + group.length > itemsPerPage) {
      pages.push(pageBucket);
      pageBucket = [];
    }
    pageBucket.push(...group);
  }
  if (pageBucket.length > 0) {
    pages.push(pageBucket);
  }

  const totalPages = Math.max(pages.length, 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    pageItems: pages[safePage - 1] ?? [],
    totalPages,
  };
}
