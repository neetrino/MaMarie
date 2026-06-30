'use client';

import { useState, useEffect } from 'react';
import { Card } from '@shop/ui';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters, readCachedProductsFilters, writeCachedProductsFilters } from './ProductsFiltersProvider';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import {
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_NOTE_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_NOTE_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_SIZE_CHIP_FONT_SIZE_PX,
} from '../constants/products-catalog';

type SizeFilterVariant = 'default' | 'catalog';

interface SizeFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedSizes?: string[];
  variant?: SizeFilterVariant;
}

interface SizeOption {
  value: string;
  count: number;
}


export function SizeFilter({
  category,
  search,
  minPrice,
  maxPrice,
  selectedSizes = [],
  variant = 'default',
}: SizeFilterProps) {
  const filtersContext = useProductsFilters();
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const { t } = useTranslation();
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const activeSelected = catalog?.selectedSizes ?? selectedSizes;
  const [selected, setSelected] = useState<string[]>(activeSelected);

  useEffect(() => {
    if (filtersContext?.data?.sizes) {
      setSizes(filtersContext.data.sizes);
      setLoading(false);
      return;
    }
    if (filtersContext === null) {
      fetchSizes();
    } else {
      setLoading(filtersContext.loading);
    }
  }, [category, search, minPrice, maxPrice, filtersContext?.data?.sizes, filtersContext?.loading, filtersContext === null]);

  useEffect(() => {
    setSelected(activeSelected);
  }, [activeSelected]);

  const fetchSizes = async () => {
    const cached = readCachedProductsFilters({ category, search, minPrice, maxPrice });
    if (cached) {
      setSizes(cached.sizes);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const language = getStoredLanguage();
      const params: Record<string, string> = {
        lang: language,
      };
      
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await apiClient.get<{ colors: any[]; sizes: SizeOption[] }>('/api/v1/products/filters', { params });
      const existing = readCachedProductsFilters({ category, search, minPrice, maxPrice });
      writeCachedProductsFilters(
        { category, search, minPrice, maxPrice },
        {
          colors: existing?.colors || response.colors || [],
          sizes: response.sizes || [],
          brands: existing?.brands || [],
          priceRange: existing?.priceRange || {
            min: 0,
            max: 100000,
            stepSize: null,
            stepSizePerCurrency: null,
          },
        }
      );

      setSizes(response.sizes || []);
    } catch (error) {
      setSizes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (sizeValue: string) => {
    const newSelected = selected.includes(sizeValue)
      ? selected.filter((s) => s !== sizeValue)
      : [...selected, sizeValue];

    setSelected(newSelected);
    applyFilters(newSelected);
  };

  const applyFilters = (sizesToApply: string[]) => {
    applyPatch({
      sizes: sizesToApply.length > 0 ? sizesToApply.join(',') : undefined,
    });
  };

  if (loading) {
    if (variant === 'catalog') {
      return (
        <div
          className="text-[#555]"
          style={{
            fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
            lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('products.filters.size.loading')}
        </div>
      );
    }
    return (
      <Card className="p-4 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.size.title')}</h3>
        <div className="text-sm text-gray-500">{t('products.filters.size.loading')}</div>
      </Card>
    );
  }

  const catalogSizes = sizes.length > 0 ? sizes : [];
  const catalogContent =
    catalogSizes.length === 0 ? (
      <div
        className="py-2 text-[#555]"
        style={{
          fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
          lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
        }}
      >
        {t('products.filters.size.noSizes')}
      </div>
    ) : (
      <>
        <div className="grid grid-cols-4 gap-2">
          {catalogSizes.map((size) => {
            const isSelected = selected.includes(size.value);
            return (
              <button
                key={size.value}
                type="button"
                onClick={() => handleSizeToggle(size.value)}
                className={`flex h-[34px] items-center justify-center rounded-[14px] border-2 font-semibold transition-colors ${
                  isSelected
                    ? 'border-[#57423b] bg-[#ef95aa] text-[#1d1c16]'
                    : 'border-[#e8e8e8] bg-white text-[#555] hover:border-[#d0d0d0]'
                }`}
                style={{ fontSize: PRODUCTS_CATALOG_FILTER_SIZE_CHIP_FONT_SIZE_PX }}
              >
                {size.value}
              </button>
            );
          })}
        </div>
        <p
          className="pt-2.5 text-[#aaa]"
          style={{
            fontSize: PRODUCTS_CATALOG_FILTER_NOTE_SIZE_PX,
            lineHeight: `${PRODUCTS_CATALOG_FILTER_NOTE_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('products.catalog.filters.sizeNote')}
        </p>
      </>
    );

  if (variant === 'catalog') {
    return <div>{catalogContent}</div>;
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.size.title')}</h3>
      {sizes.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.size.noSizes')}
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sizes.map((size) => {
            const isSelected = selected.includes(size.value);

            return (
              <button
                key={size.value}
                onClick={() => handleSizeToggle(size.value)}
                className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors group ${
                  isSelected
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span
                  className={`text-sm group-hover:text-gray-700 ${
                    isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'
                  }`}
                >
                  {size.value}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'text-blue-700 bg-blue-100'
                      : 'text-gray-500 bg-gray-100'
                  }`}
                >
                  {size.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

