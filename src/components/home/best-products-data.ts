import {
  BEST_PRODUCTS_CARD_COUNT,
  BEST_PRODUCTS_PLACEHOLDER_COMPARE_PRICE_AMD,
  BEST_PRODUCTS_PLACEHOLDER_PRICE_AMD,
  BEST_PRODUCTS_PLACEHOLDER_SUBTITLE,
  BEST_PRODUCTS_PLACEHOLDER_TITLE,
} from '../../constants/home-sections';
import type { HomeProductCardData } from './HomeProductCard';

interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  image: string | null;
  inStock: boolean;
  brand?: { name: string } | null;
  defaultVariantId?: string | null;
}

export function mapToHomeProductCard(product: CatalogProduct): HomeProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    subtitle: product.brand?.name ?? null,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    originalPrice: product.originalPrice,
    image: product.image,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId,
  };
}

function createPlaceholderCard(index: number): HomeProductCardData {
  return {
    id: `best-products-placeholder-${index}`,
    slug: 'products',
    title: BEST_PRODUCTS_PLACEHOLDER_TITLE,
    subtitle: BEST_PRODUCTS_PLACEHOLDER_SUBTITLE,
    price: BEST_PRODUCTS_PLACEHOLDER_PRICE_AMD,
    compareAtPrice: BEST_PRODUCTS_PLACEHOLDER_COMPARE_PRICE_AMD,
    image: null,
    inStock: true,
  };
}

export function getBestProductsFallbackList(): HomeProductCardData[] {
  return Array.from({ length: BEST_PRODUCTS_CARD_COUNT }, (_, index) =>
    createPlaceholderCard(index)
  );
}

export function fillBestProductsRow(products: HomeProductCardData[]): HomeProductCardData[] {
  if (products.length >= BEST_PRODUCTS_CARD_COUNT) {
    return products.slice(0, BEST_PRODUCTS_CARD_COUNT);
  }

  const fallbacks = getBestProductsFallbackList();
  return [...products, ...fallbacks.slice(0, BEST_PRODUCTS_CARD_COUNT - products.length)];
}
