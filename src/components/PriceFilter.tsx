'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@shop/ui';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';
import { getStoredCurrency, formatPrice as formatCurrencyPrice, type CurrencyCode } from '../lib/currency';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters } from './ProductsFiltersProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import { PRODUCTS_CATALOG_FILTER_PRICE_FONT_SIZE_PX } from '../constants/products-catalog';

type PriceFilterVariant = 'default' | 'catalog';

interface PriceFilterProps {
  currentMinPrice?: string;
  currentMaxPrice?: string;
  category?: string;
  search?: string;
  variant?: PriceFilterVariant;
}

interface PriceRange {
  min: number;
  max: number;
  stepSize?: number | null;
  stepSizePerCurrency?: Partial<Record<CurrencyCode, number>> | null;
}

export function PriceFilter({
  currentMinPrice,
  currentMaxPrice,
  category,
  variant = 'default',
}: PriceFilterProps) {
  const filtersContext = useProductsFilters();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 100000,
    stepSize: null,
    stepSizePerCurrency: null,
  });
  const [minPrice, setMinPrice] = useState(currentMinPrice ? parseFloat(currentMinPrice) : 0);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice ? parseFloat(currentMaxPrice) : 100000);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('USD'); // Default для SSR
  const sliderRef = useRef<HTMLDivElement>(null);

  // Helper function to round value to step size
  const roundToStep = (value: number, step: number | null | undefined): number => {
    if (!step || step <= 0) return Math.round(value);
    return Math.round(value / step) * step;
  };

  // Загружаем валюту только на клиенте, чтобы избежать проблем с гидратацией
  useEffect(() => {
    const updateCurrency = () => {
      setCurrency(getStoredCurrency());
    };
    
    // Загружаем валюту при монтировании
    updateCurrency();
    
    // Слушаем изменения валюты
    if (typeof window !== 'undefined') {
      window.addEventListener('currency-updated', updateCurrency);
      return () => {
        window.removeEventListener('currency-updated', updateCurrency);
      };
    }
  }, []);

  useEffect(() => {
    if (filtersContext?.data?.priceRange) {
      const pr = filtersContext.data.priceRange;
      setPriceRange(pr as PriceRange);
      if (!currentMinPrice) setMinPrice(pr.min);
      if (!currentMaxPrice) setMaxPrice(pr.max);
      return;
    }
    if (filtersContext === null) {
      fetchPriceRange();
    }
  }, [category, filtersContext?.data?.priceRange, filtersContext === null]);

  useEffect(() => {
    if (currentMinPrice) {
      setMinPrice(parseFloat(currentMinPrice));
    } else {
      setMinPrice(priceRange.min);
    }
    if (currentMaxPrice) {
      setMaxPrice(parseFloat(currentMaxPrice));
    } else {
      setMaxPrice(priceRange.max);
    }
  }, [currentMinPrice, currentMaxPrice, priceRange]);

  const fetchPriceRange = async () => {
    try {
      const language = getStoredLanguage();
      const params: Record<string, string> = { lang: language };
      if (category) params.category = category;

      const response = await apiClient.get<PriceRange>('/api/v1/products/price-range', { params });
      setPriceRange(response);
      if (!currentMinPrice) setMinPrice(response.min);
      if (!currentMaxPrice) setMaxPrice(response.max);
    } catch (error) {
      console.error('Error fetching price range:', error);
    }
  };

  const resolveStepSize = (): number => {
    const perCurrency = priceRange.stepSizePerCurrency || {};
    const currencyStep = perCurrency[currency];
    if (currencyStep && currencyStep > 0) {
      return currencyStep;
    }
    if (priceRange.stepSize && priceRange.stepSize > 0) {
      return priceRange.stepSize;
    }
    return 1;
  };

  const getPercentage = (value: number) => {
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  };

  const handleMouseDown = (type: 'min' | 'max') => {
    setIsDragging(type);
  };

  const updatePrice = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const value = priceRange.min + (percentage / 100) * (priceRange.max - priceRange.min);
    const step = resolveStepSize();
    const roundedValue = roundToStep(value, step);

    if (isDragging === 'min') {
      const currentMax = typeof maxPrice === 'number' && !isNaN(maxPrice) ? maxPrice : priceRange.max;
      const newMin = Math.max(priceRange.min, Math.min(roundedValue, currentMax - step));
      setMinPrice(newMin);
    } else if (isDragging === 'max') {
      const currentMin = typeof minPrice === 'number' && !isNaN(minPrice) ? minPrice : priceRange.min;
      const newMax = Math.min(priceRange.max, Math.max(roundedValue, currentMin + step));
      setMaxPrice(newMax);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updatePrice(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    updatePrice(e.touches[0].clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, minPrice, maxPrice, priceRange]);

  // Auto-apply filter when dragging ends
  useEffect(() => {
    if (!isDragging) {
      // Only apply if values have changed from initial/default
      const shouldApplyMin = minPrice !== priceRange.min;
      const shouldApplyMax = maxPrice !== priceRange.max;
      
      if (shouldApplyMin || shouldApplyMax) {
        const timeoutId = setTimeout(() => {
          applyPatch({
            minPrice: shouldApplyMin ? String(minPrice) : undefined,
            maxPrice: shouldApplyMax ? String(maxPrice) : undefined,
          });
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [isDragging, minPrice, maxPrice, priceRange, applyPatch]);

  // Используем функцию форматирования из currency.ts для консистентности
  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price) || !isFinite(price)) {
      return formatCurrencyPrice(0, currency);
    }
    return formatCurrencyPrice(price, currency);
  };

  const safeMinPrice: number = typeof minPrice === 'number' && !isNaN(minPrice) && isFinite(minPrice) ? minPrice : 0;
  const safeMaxPrice: number = typeof maxPrice === 'number' && !isNaN(maxPrice) && isFinite(maxPrice) ? maxPrice : 100000;
  
  const minPercentage = getPercentage(safeMinPrice);
  const maxPercentage = getPercentage(safeMaxPrice);

  const sliderTrackClass =
    variant === 'catalog'
      ? 'relative h-[3px] cursor-pointer rounded-full bg-[#ebebeb]'
      : 'relative h-1 bg-gray-200 cursor-pointer';

  const activeRangeClass =
    variant === 'catalog'
      ? 'absolute h-[3px] rounded-full bg-[#5281e1]'
      : 'absolute h-1 bg-sky-400';

  const handleClass =
    variant === 'catalog'
      ? 'absolute z-10 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-[#5281e1] bg-white active:cursor-grabbing'
      : 'absolute cursor-grab active:cursor-grabbing z-10';

  const sliderContent = (
    <>
      <div className={variant === 'catalog' ? 'mb-4' : 'mb-4'}>
        <div
          ref={sliderRef}
          className={sliderTrackClass}
          onMouseDown={(e) => {
            const rect = sliderRef.current?.getBoundingClientRect();
            if (!rect) return;
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const value = priceRange.min + (percentage / 100) * (priceRange.max - priceRange.min);
    const step = resolveStepSize();
            const roundedValue = roundToStep(value, step);
            
            const currentMin = typeof minPrice === 'number' && !isNaN(minPrice) ? minPrice : priceRange.min;
            const currentMax = typeof maxPrice === 'number' && !isNaN(maxPrice) ? maxPrice : priceRange.max;
            
            if (Math.abs(roundedValue - currentMin) < Math.abs(roundedValue - currentMax)) {
              const newMin = Math.max(priceRange.min, Math.min(roundedValue, currentMax - step));
              setMinPrice(newMin);
              handleMouseDown('min');
            } else {
              const newMax = Math.min(priceRange.max, Math.max(roundedValue, currentMin + step));
              setMaxPrice(newMax);
              handleMouseDown('max');
            }
          }}
        >
          <div
            className={activeRangeClass}
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          <div
            className={handleClass}
            style={{
              left: `${minPercentage}%`,
              top: '50%',
              transform: variant === 'catalog' ? undefined : 'translate(-50%, -50%)',
              boxShadow: variant === 'catalog' ? '0px 2px 6px rgba(82, 129, 225, 0.4)' : undefined,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown('min');
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleMouseDown('min');
            }}
          >
            {variant === 'default' ? <div className="h-5 w-1 bg-sky-400" /> : null}
          </div>

          <div
            className={handleClass}
            style={{
              left: `${maxPercentage}%`,
              top: '50%',
              transform: variant === 'catalog' ? undefined : 'translate(-50%, -50%)',
              boxShadow: variant === 'catalog' ? '0px 2px 6px rgba(82, 129, 225, 0.4)' : undefined,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown('max');
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleMouseDown('max');
            }}
          >
            {variant === 'default' ? <div className="h-5 w-1 bg-sky-400" /> : null}
          </div>
        </div>
      </div>

      {variant === 'catalog' ? (
        <div className="flex items-center gap-4">
          <div className="rounded-[14px] bg-[#f5f7ff] px-3 py-2">
            <span
              className="font-bold text-[#5281e1]"
              style={{ fontSize: PRODUCTS_CATALOG_FILTER_PRICE_FONT_SIZE_PX }}
            >
              {formatPrice(Number(safeMinPrice) || 0)}
            </span>
          </div>
          <span className="h-px w-4 bg-[#ddd]" aria-hidden />
          <div className="rounded-[14px] bg-[#f5f7ff] px-3 py-2">
            <span
              className="font-bold text-[#5281e1]"
              style={{ fontSize: PRODUCTS_CATALOG_FILTER_PRICE_FONT_SIZE_PX }}
            >
              {formatPrice(Number(safeMaxPrice) || 100000)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700">
          <span className="text-sm text-gray-500">{t('products.filters.price.priceLabel')} </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(Number(safeMinPrice) || 0)} - {formatPrice(Number(safeMaxPrice) || 100000)}
          </span>
        </div>
      )}
    </>
  );

  if (variant === 'catalog') {
    return <div>{sliderContent}</div>;
  }

  return (
    <Card className="mb-6 p-4">
      <h3 className="mb-4 text-center text-base font-bold uppercase tracking-wide text-gray-800">
        {t('products.filters.price.title')}
      </h3>
      {sliderContent}
    </Card>
  );
}

