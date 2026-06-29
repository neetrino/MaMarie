'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  PRODUCTS_CATALOG_CARD_GAP_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  PRODUCTS_CATALOG_CTA_BG,
  PRODUCTS_CATALOG_CTA_HEIGHT_PX,
  PRODUCTS_CATALOG_CTA_INSET_SHADOW,
  PRODUCTS_CATALOG_CTA_WIDTH_PX,
} from '../constants/products-catalog';
import { mapToHomeProductCard } from './home/best-products-data';
import { HomeProductCard, type HomeProductCardData } from './home/HomeProductCard';
import { useTranslation } from '../lib/i18n-client';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
}

type ViewMode = 'list' | 'grid-2' | 'grid-3';

interface ProductsGridProps {
  products: Product[];
  sortBy?: string;
  loadMoreHref?: string | null;
}

export function ProductsGrid({ products, sortBy = 'default', loadMoreHref = null }: ProductsGridProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid-2');
  const [sortedProducts, setSortedProducts] = useState<HomeProductCardData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('products-view-mode');
    if (stored && ['list', 'grid-2', 'grid-3'].includes(stored)) {
      setViewMode(stored as ViewMode);
    } else {
      setViewMode('grid-2');
      localStorage.setItem('products-view-mode', 'grid-2');
    }
  }, []);

  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent<ViewMode>) => {
      setViewMode(event.detail);
    };

    window.addEventListener('view-mode-changed', handleViewModeChange as EventListener);
    return () => {
      window.removeEventListener('view-mode-changed', handleViewModeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setSortedProducts(sorted.map(mapToHomeProductCard));
  }, [products, sortBy]);

  if (sortedProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-[#757571]">{t('products.grid.noProducts')}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex w-full flex-wrap justify-center lg:justify-start"
        style={{ gap: PRODUCTS_CATALOG_CARD_GAP_PX }}
      >
        {sortedProducts.map((product) => (
          <HomeProductCard
            key={product.id}
            product={product}
            layoutWidthPx={PRODUCTS_CATALOG_CARD_WIDTH_PX}
            layoutHeightPx={PRODUCTS_CATALOG_CARD_HEIGHT_PX}
          />
        ))}
      </div>

      {loadMoreHref ? (
        <Link
          href={loadMoreHref}
          className="mt-10 flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
          style={{
            width: PRODUCTS_CATALOG_CTA_WIDTH_PX,
            height: PRODUCTS_CATALOG_CTA_HEIGHT_PX,
            borderRadius: 9999,
            backgroundColor: PRODUCTS_CATALOG_CTA_BG,
            boxShadow: PRODUCTS_CATALOG_CTA_INSET_SHADOW,
          }}
        >
          {t('products.catalog.seeAll')}
        </Link>
      ) : null}
    </div>
  );
}
