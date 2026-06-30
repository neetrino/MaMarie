'use client';

import { useState, useEffect } from 'react';
import { Card } from '@shop/ui';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';
import { getColorHex } from '../lib/colorMap';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters, readCachedProductsFilters, writeCachedProductsFilters } from './ProductsFiltersProvider';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import {
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
} from '../constants/products-catalog';

type ColorFilterVariant = 'default' | 'catalog';

interface ColorFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedColors?: string[];
  variant?: ColorFilterVariant;
}

interface ColorOption {
  value: string;
  label: string;
  count: number;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export function ColorFilter({
  category,
  search,
  minPrice,
  maxPrice,
  selectedColors = [],
  variant = 'default',
}: ColorFilterProps) {
  const filtersContext = useProductsFilters();
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const { t } = useTranslation();
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const activeSelected = catalog?.selectedColors ?? selectedColors;
  const [selected, setSelected] = useState<string[]>(activeSelected);

  useEffect(() => {
    if (filtersContext?.data?.colors) {
      setColors(filtersContext.data.colors);
      setLoading(false);
      return;
    }
    if (filtersContext === null) {
      fetchColors();
    } else {
      setLoading(filtersContext.loading);
    }
  }, [category, search, minPrice, maxPrice, filtersContext?.data?.colors, filtersContext?.loading, filtersContext === null]);

  useEffect(() => {
    setSelected(activeSelected);
  }, [activeSelected]);

  const fetchColors = async () => {
    const cached = readCachedProductsFilters({ category, search, minPrice, maxPrice });
    if (cached) {
      setColors(cached.colors);
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

      const response = await apiClient.get<{ colors: ColorOption[]; sizes: any[] }>('/api/v1/products/filters', { params });
      const existing = readCachedProductsFilters({ category, search, minPrice, maxPrice });
      writeCachedProductsFilters(
        { category, search, minPrice, maxPrice },
        {
          colors: response.colors || [],
          sizes: response.sizes || existing?.sizes || [],
          brands: existing?.brands || [],
          priceRange: existing?.priceRange || {
            min: 0,
            max: 100000,
            stepSize: null,
            stepSizePerCurrency: null,
          },
        }
      );

      setColors(response.colors || []);
    } catch (error) {
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleColorToggle = (colorValue: string) => {
    const newSelected = selected.includes(colorValue)
      ? selected.filter((c) => c !== colorValue)
      : [...selected, colorValue];

    setSelected(newSelected);
    applyFilters(newSelected);
  };

  const applyFilters = (colorsToApply: string[]) => {
    applyPatch({
      colors: colorsToApply.length > 0 ? colorsToApply.join(',') : undefined,
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
          {t('products.filters.color.loading')}
        </div>
      );
    }
    return (
      <Card className="p-4 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.color.title')}</h3>
        <div className="text-sm text-gray-500">{t('products.filters.color.loading')}</div>
      </Card>
    );
  }

  const catalogContent =
    colors.length === 0 ? (
      <div
        className="py-2 text-[#555]"
        style={{
          fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
          lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
        }}
      >
        {t('products.filters.color.noColors')}
      </div>
    ) : (
      <div className="grid grid-cols-4 gap-x-2.5 gap-y-3">
        {colors.map((color) => {
          const isSelected = selected.includes(color.value);
          const colorHex =
            color.colors && Array.isArray(color.colors) && color.colors.length > 0
              ? color.colors[0]
              : getColorHex(color.label);
          const hasImage = color.imageUrl && color.imageUrl.trim() !== '';

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorToggle(color.value)}
              aria-pressed={isSelected}
              aria-label={color.label}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-105 ${
                isSelected ? 'border-[#57423b] ring-2 ring-[#57423b]/20' : 'border-[#e8e8e8]'
              }`}
              style={hasImage ? undefined : { backgroundColor: colorHex }}
            >
              {hasImage ? (
                <img
                  src={color.imageUrl!}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    );

  if (variant === 'catalog') {
    return <div>{catalogContent}</div>;
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">{t('products.filters.color.title')}</h3>
      {colors.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.color.noColors')}
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {colors.map((color) => {
            const isSelected = selected.includes(color.value);
            // Determine color hex: use colors[0] if available, otherwise use getColorHex
            const colorHex = color.colors && Array.isArray(color.colors) && color.colors.length > 0 
              ? color.colors[0] 
              : getColorHex(color.label);
            const hasImage = color.imageUrl && color.imageUrl.trim() !== '';

            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorToggle(color.value)}
                aria-pressed={isSelected}
                className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors group ${
                  isSelected
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex-shrink-0 overflow-hidden ${
                      isSelected ? 'border-blue-500 border-2' : 'border-gray-300'
                    }`}
                    style={hasImage ? {} : { backgroundColor: colorHex }}
                    aria-label={color.label}
                  >
                    {hasImage ? (
                      <img 
                        src={color.imageUrl!} 
                        alt={color.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to color hex if image fails to load
                          (e.target as HTMLImageElement).style.backgroundColor = colorHex;
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  <span
                    className={`text-sm group-hover:text-gray-700 ${
                      isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {color.label}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'text-blue-700 bg-blue-100'
                      : 'text-gray-500 bg-gray-100'
                  }`}
                >
                  {color.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

