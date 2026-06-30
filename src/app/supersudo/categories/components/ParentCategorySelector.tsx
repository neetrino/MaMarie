'use client';

import { useTranslation } from '../../../../lib/i18n-client';
import { isRootCategory } from '../../../../lib/categories/category-parent-ids';
import type { Category } from '../types';

interface ParentCategorySelectorProps {
  categories: Category[];
  selectedParentIds: string[];
  excludedCategoryId?: string;
  onChange: (parentIds: string[]) => void;
}

export function ParentCategorySelector({
  categories,
  selectedParentIds,
  excludedCategoryId,
  onChange,
}: ParentCategorySelectorProps) {
  const { t } = useTranslation();

  const rootCategories = categories.filter(
    (category) => isRootCategory(category) && category.id !== excludedCategoryId,
  );

  const toggleParent = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedParentIds, categoryId]);
      return;
    }

    onChange(selectedParentIds.filter((id) => id !== categoryId));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('admin.categories.parentCategory')}
      </label>
      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
        {rootCategories.length === 0 ? (
          <p className="text-sm text-gray-500">{t('admin.categories.noCategories')}</p>
        ) : (
          rootCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedParentIds.includes(category.id)}
                onChange={(event) => toggleParent(category.id, event.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category.title}</span>
            </label>
          ))
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {selectedParentIds.length === 0
          ? t('admin.categories.rootCategory')
          : t('admin.categories.selectedParentsCount').replace(
              '{count}',
              String(selectedParentIds.length),
            )}
      </p>
    </div>
  );
}
