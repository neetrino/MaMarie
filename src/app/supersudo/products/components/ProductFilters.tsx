'use client';

import type { FormEvent } from 'react';
import { useTranslation } from '../../../../lib/i18n-client';
import { ClaySelect, ClaySelectChevron } from '../../../../components/ClaySelect';
import {
  CLAY_SELECT_DROPDOWN_ANIMATION_MS,
  CLAY_SELECT_DROPDOWN_GAP_PX,
  CLAY_SELECT_MULTI_PANEL_CLASS,
  getClaySelectTriggerClass,
} from '../../../../constants/clay-select';
import type { Category } from '../types';

interface ProductFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  skuSearch: string;
  setSkuSearch: (sku: string) => void;
  selectedCategories: Set<string>;
  setSelectedCategories: (categories: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesExpanded: boolean;
  setCategoriesExpanded: (expanded: boolean) => void;
  stockFilter: 'all' | 'inStock' | 'outOfStock';
  setStockFilter: (filter: 'all' | 'inStock' | 'outOfStock') => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  handleSearch: (e: FormEvent) => void;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export function ProductFilters({
  search,
  setSearch,
  skuSearch,
  setSkuSearch,
  selectedCategories,
  setSelectedCategories,
  categories,
  categoriesLoading,
  categoriesExpanded,
  setCategoriesExpanded,
  stockFilter,
  setStockFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleSearch,
  setPage,
}: ProductFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 mb-6">
      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.products.searchByTitleOrSlug')}
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e as any);
              }
            }}
            placeholder={t('admin.products.searchPlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.products.searchBySku')}
          </label>
          <input
            type="text"
            value={skuSearch}
            onChange={(e) => {
              setSkuSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t('admin.products.skuPlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.products.filterByCategory')}
          </label>
          <div className="relative" data-category-dropdown>
            <button
              type="button"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className={getClaySelectTriggerClass(categoriesExpanded)}
              style={{ minHeight: 42 }}
            >
              <span className={`truncate text-sm ${selectedCategories.size === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                {selectedCategories.size === 0
                  ? t('admin.products.allCategories')
                  : selectedCategories.size === 1
                  ? categories.find(c => selectedCategories.has(c.id))?.title || '1 category'
                  : `${selectedCategories.size} categories`}
              </span>
              <ClaySelectChevron isOpen={categoriesExpanded} />
            </button>
            {categoriesExpanded && (
              <div
                className={`${CLAY_SELECT_MULTI_PANEL_CLASS} pointer-events-auto translate-y-0 opacity-100`}
                style={{
                  top: `calc(100% + ${CLAY_SELECT_DROPDOWN_GAP_PX}px)`,
                  transitionDuration: `${CLAY_SELECT_DROPDOWN_ANIMATION_MS}ms`,
                }}
              >
                {categoriesLoading ? (
                  <div className="p-3 text-sm text-gray-500 text-center">{t('admin.products.loadingCategories')}</div>
                ) : categories.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 text-center">{t('admin.products.noCategoriesAvailable')}</div>
                ) : (
                  <div className="p-2">
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(category.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedCategories);
                              if (e.target.checked) {
                                newSelected.add(category.id);
                              } else {
                                newSelected.delete(category.id);
                              }
                              setSelectedCategories(newSelected);
                              setPage(1);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{category.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Stock Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.products.filterByStock')}
          </label>
          <ClaySelect
            value={stockFilter}
            onChange={(value) => {
              setStockFilter(value as 'all' | 'inStock' | 'outOfStock');
              setPage(1);
            }}
            placeholder={t('admin.products.allProducts')}
            options={[
              { value: 'all', label: t('admin.products.allProducts') },
              { value: 'inStock', label: t('admin.products.inStock') },
              { value: 'outOfStock', label: t('admin.products.outOfStock') },
            ]}
          />
        </div>
      </div>
    </div>
  );
}






