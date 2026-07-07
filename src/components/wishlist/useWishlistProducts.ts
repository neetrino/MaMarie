'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { getStoredLanguage } from '../../lib/language';
import { WISHLIST_KEY } from '../../lib/storageCounts';
import { logger } from '../../lib/utils/logger';
import {
  getCachedWishlistProducts,
  pruneWishlistProductCache,
  upsertWishlistProductsCache,
  type WishlistCachedProduct,
} from '../../lib/wishlist-product-cache';
import type { WishlistUpdatedDetail } from '../hooks/useWishlist';

function readWishlistIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(WISHLIST_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(parsed.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)),
    );
  } catch {
    return [];
  }
}

function orderProductsByIds(
  ids: string[],
  productById: Map<string, WishlistCachedProduct>,
): WishlistCachedProduct[] {
  return ids
    .map((id) => productById.get(id))
    .filter((product): product is WishlistCachedProduct => product !== undefined);
}

/** Loads wishlist products from cache first, then refreshes from the API. */
export function useWishlistProducts() {
  const [products, setProducts] = useState<WishlistCachedProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistProducts = useCallback(async (idsToLoad: string[], hasCachedDisplay: boolean) => {
    if (idsToLoad.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      if (!hasCachedDisplay) {
        setLoading(true);
      }

      const languagePreference = getStoredLanguage();
      const response = await apiClient.get<{
        data: WishlistCachedProduct[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/api/v1/products', {
        params: {
          ids: idsToLoad.join(','),
          limit: String(idsToLoad.length),
          lang: languagePreference,
        },
      });

      const productById = new Map(response.data.map((product) => [product.id, product]));
      const wishlistProducts = orderProductsByIds(idsToLoad, productById);
      upsertWishlistProductsCache(wishlistProducts);
      setProducts(wishlistProducts);

      const normalizedIds = wishlistProducts.map((product) => product.id);
      if (normalizedIds.length !== idsToLoad.length) {
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(normalizedIds));
        window.dispatchEvent(
          new CustomEvent<WishlistUpdatedDetail>('wishlist-updated', {
            detail: {
              ids: normalizedIds,
              count: normalizedIds.length,
            },
          }),
        );
      }
    } catch (error) {
      logger.error('[Wishlist] Error fetching wishlist products', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    const ids = readWishlistIds();
    setWishlistIds(ids);

    const cachedProducts = getCachedWishlistProducts(ids);
    const hasCachedDisplay = cachedProducts.length > 0;
    if (hasCachedDisplay) {
      setProducts(cachedProducts);
      setLoading(false);
    }

    void fetchWishlistProducts(ids, hasCachedDisplay);

    const handleWishlistUpdate = (event: Event) => {
      const wishlistDetail = (event as CustomEvent<WishlistUpdatedDetail | null>).detail;
      const updatedIds = wishlistDetail?.ids ?? readWishlistIds();
      setWishlistIds(updatedIds);
      pruneWishlistProductCache(updatedIds);

      const cached = getCachedWishlistProducts(updatedIds);
      if (cached.length > 0) {
        setProducts(cached);
        setLoading(false);
      }

      const cachedIdSet = new Set(cached.map((product) => product.id));
      if (updatedIds.some((id) => !cachedIdSet.has(id))) {
        void fetchWishlistProducts(updatedIds, cached.length > 0);
        return;
      }

      setProducts((prev) => prev.filter((product) => updatedIds.includes(product.id)));
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [fetchWishlistProducts]);

  return { products, wishlistIds, loading };
}
