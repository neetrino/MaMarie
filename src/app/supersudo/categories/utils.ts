import {
  buildFlatCategoryTree,
  filterFlatCategoryTreeByTitle,
  paginateFlatCategoryTreeGroups,
} from '../../../lib/categories/build-flat-category-tree';
import type { Category, CategoryWithLevel } from './types';

export function buildCategoryTree(categories: Category[]): CategoryWithLevel[] {
  return buildFlatCategoryTree(categories);
}

export function filterCategoryTreeByTitle(
  categories: CategoryWithLevel[],
  searchQuery: string,
): CategoryWithLevel[] {
  return filterFlatCategoryTreeByTitle(categories, searchQuery, (item) => item.title);
}

export function paginateCategoryTree(
  categories: CategoryWithLevel[],
  page: number,
  itemsPerPage: number,
): { pageItems: CategoryWithLevel[]; totalPages: number } {
  return paginateFlatCategoryTreeGroups(categories, page, itemsPerPage);
}
