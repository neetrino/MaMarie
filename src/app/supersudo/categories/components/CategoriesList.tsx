'use client';

import { useState, useEffect } from 'react';
import { Button } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import { getEffectiveParentIds } from '../../../../lib/categories/category-parent-ids';
import { CategoryHierarchyLabel } from '../../../../components/category-tree/CategoryHierarchyLabel';
import { getCategoryTreeIndentClass } from '../../../../constants/category-tree-ui';
import { buildCategoryTree, filterCategoryTreeByTitle, paginateCategoryTree } from '../utils';
import { CategoriesPagination } from './CategoriesPagination';
import {
  ADMIN_TABLE,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_THEAD,
} from '../../constants/admin-table-classes';
import type { Category, CategoryWithLevel } from '../types';

interface CategoriesListProps {
  categories: Category[];
  searchQuery: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
}

const ITEMS_PER_PAGE = 20;

export function CategoriesList({ categories, searchQuery, onEdit, onDelete }: CategoriesListProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const categoryTree = buildCategoryTree(categories);
  const filteredCategories = filterCategoryTreeByTitle(categoryTree, searchQuery);
  const { pageItems: paginatedCategories, totalPages } = paginateCategoryTree(
    filteredCategories,
    currentPage,
    ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categories.length, searchQuery]);

  if (filteredCategories.length === 0) {
    return <p className="text-sm text-gray-500 py-2">{t('admin.categories.noCategories')}</p>;
  }

  return (
    <>
      <div className={ADMIN_TABLE_OUTER_SCROLL}>
        <table className={ADMIN_TABLE}>
          <thead className={ADMIN_TABLE_THEAD}>
            <tr>
              <th className={ADMIN_TABLE_TH}>{t('admin.categories.image')}</th>
              <th className={ADMIN_TABLE_TH}>{t('admin.categories.categoryTitle')}</th>
              <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.products.category')}</th>
              <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.products.actions')}</th>
            </tr>
          </thead>
          <tbody className={ADMIN_TABLE_TBODY}>
            {paginatedCategories.map((category: CategoryWithLevel) => (
              <CategoryTableRow
                key={category.treeKey}
                category={category}
                categories={categories}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <CategoriesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCategories.length}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

function CategoryTableRow({
  category,
  categories,
  onEdit,
  onDelete,
}: {
  category: CategoryWithLevel;
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
}) {
  const { t } = useTranslation();
  const parentTitles = getEffectiveParentIds(category)
    .map((parentId) => categories.find((cat) => cat.id === parentId)?.title)
    .filter(Boolean);
  const imageUrl = processImageUrl(category.imageUrl);

  return (
    <tr className={ADMIN_TABLE_ROW}>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap`}>
        <CategoryRowImage title={category.title} imageUrl={imageUrl} />
      </td>
      <td className={ADMIN_TABLE_TD}>
        <CategoryHierarchyLabel title={category.title} level={category.level} />
        <div className={`text-xs text-gray-500 ${getCategoryTreeIndentClass(category.level)}`}>
          {category.slug}
        </div>
      </td>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center text-gray-700`}>
        {parentTitles.length > 0
          ? parentTitles.join(', ')
          : t('admin.categories.rootCategory')}
      </td>
      <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center`}>
        <CategoryRowActions
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function CategoryRowImage({ title, imageUrl }: { title: string; imageUrl: string }) {
  if (!imageUrl) {
    return (
      <div className="h-10 w-10 rounded border border-dashed border-gray-300 text-xs text-gray-400 flex items-center justify-center">
        —
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="h-10 w-10 rounded object-cover border border-gray-200"
    />
  );
}

function CategoryRowActions({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryWithLevel;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryTitle: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onEdit(category)}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        aria-label={t('admin.common.edit')}
        title={t('admin.common.edit')}
      >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDelete(category.id, category.title)}
        className="text-red-600 hover:text-red-800 hover:bg-red-50"
        aria-label={t('admin.common.delete')}
        title={t('admin.common.delete')}
      >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
  );
}

function processImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}
