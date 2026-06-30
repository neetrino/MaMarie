'use client';

import { useState, useEffect } from 'react';
import { Card, Input } from '@shop/ui';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';
import { useTranslation } from '../lib/i18n-client';
import {
  PRODUCTS_CATALOG_FILTER_ACCENT,
  PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
  PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
  PRODUCTS_CATALOG_TEXT_DARK,
} from '../constants/products-catalog';
import { useProductsFilters, readCachedProductsFilters, writeCachedProductsFilters } from './ProductsFiltersProvider';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';

type BrandFilterVariant = 'default' | 'catalog';

interface BrandFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedBrands?: string[];
  variant?: BrandFilterVariant;
}

interface BrandOption {
  id: string;
  name: string;
  count: number;
}

function CheckboxIndicator({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="flex shrink-0 items-center justify-center border-2"
        style={{
          width: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
          height: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
          borderRadius: PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
          borderColor: PRODUCTS_CATALOG_FILTER_ACCENT,
          backgroundColor: PRODUCTS_CATALOG_FILTER_ACCENT,
        }}
        aria-hidden
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="shrink-0 border-2 border-[#d0d0d0]"
      style={{
        width: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
        height: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
        borderRadius: PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
      }}
      aria-hidden
    />
  );
}

export function BrandFilter({
  category,
  search,
  minPrice,
  maxPrice,
  selectedBrands = [],
  variant = 'default',
}: BrandFilterProps) {
  const filtersContext = useProductsFilters();
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const activeSelected = catalog?.selectedBrands ?? selectedBrands;
  const { t } = useTranslation();
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(activeSelected);

  useEffect(() => {
    setSelected(activeSelected);
  }, [activeSelected]);

  useEffect(() => {
    if (filtersContext?.data?.brands) {
      setBrands(filtersContext.data.brands);
      setFilteredBrands(filtersContext.data.brands);
      setLoading(false);
      return;
    }
    if (filtersContext === null) {
      fetchBrands();
    } else {
      setLoading(filtersContext.loading);
    }
  }, [category, search, minPrice, maxPrice, filtersContext?.data?.brands, filtersContext?.loading, filtersContext === null]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const query = searchQuery.toLowerCase().trim();
      setFilteredBrands(
        brands.filter((brand) => brand.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, brands]);

  const fetchBrands = async () => {
    const cached = readCachedProductsFilters({ category, search, minPrice, maxPrice });
    if (cached) {
      setBrands(cached.brands);
      setFilteredBrands(cached.brands);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const language = getStoredLanguage();
      const params: Record<string, string> = { lang: language };
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const response = await apiClient.get<{ brands: BrandOption[] }>('/api/v1/products/filters', { params });
      const list = response.brands ?? [];
      const existing = readCachedProductsFilters({ category, search, minPrice, maxPrice });
      writeCachedProductsFilters(
        { category, search, minPrice, maxPrice },
        {
          colors: existing?.colors || [],
          sizes: existing?.sizes || [],
          brands: list,
          priceRange: existing?.priceRange || {
            min: 0,
            max: 100000,
            stepSize: null,
            stepSizePerCurrency: null,
          },
        }
      );
      setBrands(list);
      setFilteredBrands(list);
    } catch (err) {
      setBrands([]);
      setFilteredBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = (brandId: string) => {
    const newBrands = selected.includes(brandId)
      ? selected.filter((id) => id !== brandId)
      : [...selected, brandId];

    setSelected(newBrands);
    applyPatch({
      brand: newBrands.length > 0 ? newBrands.join(',') : undefined,
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
          {t('products.filters.brand.loading')}
        </div>
      );
    }
    return (
      <Card className="p-4 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.brand.title')}</h3>
        <div className="text-sm text-gray-500">{t('products.filters.brand.loading')}</div>
      </Card>
    );
  }

  if (variant === 'catalog') {
    if (brands.length === 0) {
      return (
        <div
          className="py-2 text-[#555]"
          style={{
            fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
            lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('products.filters.brand.noBrands')}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2.5">
        {brands.map((brand) => {
          const isSelected = selected.includes(brand.id);

          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleBrandSelect(brand.id)}
              className="flex w-full items-center gap-3 text-left"
              aria-pressed={isSelected}
            >
              <CheckboxIndicator selected={isSelected} />
              <span
                className={isSelected ? 'font-semibold' : 'font-medium text-[#555]'}
                style={{
                  fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
                  lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
                  color: isSelected ? PRODUCTS_CATALOG_TEXT_DARK : undefined,
                }}
              >
                {brand.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.brand.title')}</h3>
      
      {/* Search Input */}
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder={t('products.filters.brand.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Brand List */}
      {filteredBrands.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredBrands.map((brand) => {
            const isSelected = activeSelected.includes(brand.id);

            return (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand.id)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded transition-all duration-200 group ${
                  isSelected
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span
                  className={`text-sm transition-colors ${
                    isSelected
                      ? 'text-blue-900 font-medium'
                      : 'text-gray-900 group-hover:text-gray-700'
                  }`}
                >
                  {brand.name}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'text-blue-700 bg-blue-100'
                      : 'text-gray-500 bg-gray-100'
                  }`}
                >
                  {brand.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.brand.noBrands')}
        </div>
      )}
    </Card>
  );
}

