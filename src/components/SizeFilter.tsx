'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@shop/ui';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters } from './ProductsFiltersProvider';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersContext = useProductsFilters();
  const { t } = useTranslation();
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(selectedSizes);

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
    setSelected(selectedSizes);
  }, [selectedSizes]);

  const fetchSizes = async () => {
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

      // Fetch filters from API
      const response = await apiClient.get<{ colors: any[]; sizes: SizeOption[] }>('/api/v1/products/filters', { params });
      
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
    // Ստեղծում ենք նոր URLSearchParams URL-ի հիման վրա, որպեսզի պահպանենք բոլոր params-ները
    const params = new URLSearchParams(searchParams.toString());
    
    // Թարմացնում ենք sizes պարամետրը
    if (sizesToApply.length > 0) {
      params.set('sizes', sizesToApply.join(','));
    } else {
      params.delete('sizes');
    }
    
    // Reset page to 1 when filters change
    params.delete('page');

    router.push(`/products?${params.toString()}`);
  };

  if (loading) {
    if (variant === 'catalog') {
      return <div className="text-sm text-[#555]">{t('products.filters.size.loading')}</div>;
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
      <div className="py-2 text-sm text-[#555]">{t('products.filters.size.noSizes')}</div>
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
                className={`flex h-[34px] items-center justify-center rounded-[14px] border-2 text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'border-[#57423b] bg-[#ef95aa] text-[#1d1c16]'
                    : 'border-[#e8e8e8] bg-white text-[#555] hover:border-[#d0d0d0]'
                }`}
              >
                {size.value}
              </button>
            );
          })}
        </div>
        <p className="pt-2.5 text-[11px] leading-[16.5px] text-[#aaa]">
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

