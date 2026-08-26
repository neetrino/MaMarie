'use client';

import { useTranslation } from '../lib/i18n-client';
import { useCategories } from './CategoryNavigation/hooks/useCategories';
import { CategoryHierarchyLabel } from './category-tree/CategoryHierarchyLabel';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import { getCategoryTreeIndentClass } from '../constants/category-tree-ui';
import {
  PRODUCTS_CATALOG_FILTER_ACCENT,
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
} from '../constants/products-catalog';
import { getCategoryTreeParentId } from '../lib/categories/category-tree-parent';
import type { Category } from './CategoryNavigation/utils';

type CategoryFilterVariant = 'default' | 'catalog';

interface CategoryFilterProps {
  currentCategory?: string;
  categoryScope?: string;
  variant?: CategoryFilterVariant;
}

function RadioIndicator({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full border-2"
        style={{
          width: 18,
          height: 18,
          borderColor: PRODUCTS_CATALOG_FILTER_ACCENT,
          backgroundColor: PRODUCTS_CATALOG_FILTER_ACCENT,
        }}
      >
        <span className="rounded-full bg-white" style={{ width: 7, height: 7 }} />
      </span>
    );
  }

  return (
    <span
      className="shrink-0 rounded-full border-2 border-[#d0d0d0]"
      style={{ width: 18, height: 18 }}
      aria-hidden
    />
  );
}

function countCategoryIds(categories: Category[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const category of categories) {
    counts.set(category.id, (counts.get(category.id) ?? 0) + 1);
  }
  return counts;
}

function isCategoryOptionSelected(
  category: Category,
  currentCategory: string | undefined,
  categoryScope: string | undefined,
  idCounts: Map<string, number>
): boolean {
  if (!currentCategory) {
    return false;
  }
  if (currentCategory === category.id) {
    const shared = (idCounts.get(category.id) ?? 0) > 1;
    if (!shared) {
      return true;
    }
    return (categoryScope ?? '') === (getCategoryTreeParentId(category.treeKey) ?? '');
  }
  return currentCategory === category.slug;
}

export function CategoryFilter({
  currentCategory,
  categoryScope,
  variant = 'default',
}: CategoryFilterProps) {
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const catalog = useOptionalProductsCatalog();
  const { t } = useTranslation();
  const { categories, loading } = useCategories();
  const idCounts = countCategoryIds(categories);
  const activeCategory = catalog?.params.category ?? currentCategory;
  const activeScope = catalog?.params.categoryScope ?? categoryScope;

  const handleSelect = (category: Category | null) => {
    if (!category) {
      applyPatch({ category: undefined, categoryScope: undefined });
      return;
    }

    const parentId = getCategoryTreeParentId(category.treeKey);
    const isSharedNode = (idCounts.get(category.id) ?? 0) > 1 && Boolean(parentId);
    applyPatch({
      category: category.id,
      categoryScope: isSharedNode ? parentId : undefined,
    });
  };

  if (variant !== 'catalog') {
    return null;
  }

  if (loading && categories.length === 0) {
    return (
      <p
        className="text-[#555]"
        style={{
          fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
          lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
        }}
      >
        {t('products.filters.color.loading')}
      </p>
    );
  }

  return (
    <div className="flex max-h-80 flex-col gap-2.5 overflow-y-auto">
      <CategoryFilterOption
        selected={!activeCategory}
        level={0}
        label={t('products.catalog.filters.all')}
        onSelect={() => handleSelect(null)}
      />
      {categories.map((category) => (
        <CategoryFilterOption
          key={category.treeKey}
          selected={isCategoryOptionSelected(category, activeCategory, activeScope, idCounts)}
          level={category.level}
          label={category.title}
          onSelect={() => handleSelect(category)}
        />
      ))}
    </div>
  );
}

function CategoryFilterOption({
  selected,
  level,
  label,
  onSelect,
}: {
  selected: boolean;
  level: number;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 text-left ${getCategoryTreeIndentClass(level)}`}
    >
      <RadioIndicator selected={selected} />
      <span
        style={{
          fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
          lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
        }}
      >
        <CategoryHierarchyLabel
          title={label}
          level={level}
          selected={selected}
          tone="catalog"
          indented={false}
        />
      </span>
    </button>
  );
}
