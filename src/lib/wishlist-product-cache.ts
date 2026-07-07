'use client';

import type { HomeProductCardData } from '../components/home/HomeProductCard';
import type {
  ProductColorOption,
  ProductSizeOption,
} from './services/product-variant-attributes';
import { logger } from './utils/logger';

export const WISHLIST_PRODUCT_CACHE_KEY = 'shop_wishlist_products';

export interface WishlistCachedProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  image: string | null;
  inStock: boolean;
  brand?: { id: string; name: string } | null;
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
}

export interface WishlistProductSnapshotInput {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  image?: string | null;
  inStock?: boolean;
  brand?: { id: string; name: string } | null;
  brandName?: string | null;
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
}

/** Normalizes card/PDP product fields into the wishlist cache shape. */
export function buildWishlistProductSnapshot(
  source: WishlistProductSnapshotInput,
): WishlistCachedProduct {
  return {
    id: source.id,
    slug: source.slug,
    title: source.title,
    price: source.price,
    originalPrice: source.originalPrice ?? null,
    compareAtPrice: source.compareAtPrice ?? null,
    discountPercent: source.discountPercent ?? null,
    image: source.image ?? null,
    inStock: source.inStock ?? true,
    brand:
      source.brand ??
      (source.brandName ? { id: '', name: source.brandName } : null),
    defaultVariantId: source.defaultVariantId ?? null,
    colors: source.colors ?? [],
    sizes: source.sizes ?? [],
    averageRating: source.averageRating ?? 0,
    reviewsCount: source.reviewsCount ?? 0,
  };
}

export function buildWishlistSnapshotFromHomeCard(
  product: HomeProductCardData,
): WishlistCachedProduct {
  return buildWishlistProductSnapshot({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    compareAtPrice: product.compareAtPrice,
    image: product.image,
    inStock: product.inStock,
    brandName: product.subtitle ?? null,
    defaultVariantId: product.defaultVariantId,
    colors: product.colors,
    sizes: product.sizes,
    averageRating: product.averageRating,
    reviewsCount: product.reviewsCount,
  });
}

function readCacheMap(): Record<string, WishlistCachedProduct> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(WISHLIST_PRODUCT_CACHE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, WishlistCachedProduct] =>
          typeof entry[0] === 'string' &&
          typeof entry[1] === 'object' &&
          entry[1] !== null &&
          typeof (entry[1] as WishlistCachedProduct).id === 'string',
      ),
    );
  } catch {
    return {};
  }
}

function writeCacheMap(map: Record<string, WishlistCachedProduct>): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(WISHLIST_PRODUCT_CACHE_KEY, JSON.stringify(map));
}

/** Stores a product card snapshot when it is added to the wishlist. */
export function cacheWishlistProduct(source: WishlistProductSnapshotInput): void {
  try {
    const map = readCacheMap();
    map[source.id] = buildWishlistProductSnapshot(source);
    writeCacheMap(map);
  } catch (error) {
    logger.error('Error caching wishlist product', { error, productId: source.id });
  }
}

/** Removes a cached product after it is removed from the wishlist. */
export function removeWishlistProductFromCache(productId: string): void {
  try {
    const map = readCacheMap();
    if (!(productId in map)) {
      return;
    }

    delete map[productId];
    writeCacheMap(map);
  } catch (error) {
    logger.error('Error removing wishlist product cache entry', { error, productId });
  }
}

/** Drops cache entries that are no longer in the wishlist id list. */
export function pruneWishlistProductCache(validIds: string[]): void {
  try {
    const validIdSet = new Set(validIds);
    const map = readCacheMap();
    let changed = false;

    for (const id of Object.keys(map)) {
      if (!validIdSet.has(id)) {
        delete map[id];
        changed = true;
      }
    }

    if (changed) {
      writeCacheMap(map);
    }
  } catch (error) {
    logger.error('Error pruning wishlist product cache', { error });
  }
}

/** Returns cached products in wishlist order (skips missing entries). */
export function getCachedWishlistProducts(ids: string[]): WishlistCachedProduct[] {
  const map = readCacheMap();
  return ids
    .map((id) => map[id])
    .filter((product): product is WishlistCachedProduct => product !== undefined);
}

/** Merges API results into the local wishlist product cache. */
export function upsertWishlistProductsCache(products: WishlistCachedProduct[]): void {
  if (products.length === 0) {
    return;
  }

  try {
    const map = readCacheMap();
    for (const product of products) {
      map[product.id] = product;
    }
    writeCacheMap(map);
  } catch (error) {
    logger.error('Error upserting wishlist product cache', { error });
  }
}
