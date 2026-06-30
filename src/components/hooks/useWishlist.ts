'use client';

import { useState, useEffect } from 'react';
import { WISHLIST_KEY } from '../../lib/storageCounts';
import { logger } from '../../lib/utils/logger';

export interface WishlistUpdatedDetail {
  ids: string[];
  count: number;
}

function readWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];

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

/**
 * Hook for managing wishlist state for a product
 * @param productId - The product ID to check/manage
 * @returns Object with wishlist state and toggle function
 */
export function useWishlist(productId: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      setIsInWishlist(readWishlistIds().includes(productId));
    };

    checkWishlist();

    const handleWishlistUpdate = () => checkWishlist();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [productId]);

  const toggleWishlist = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const wishlist = readWishlistIds();
      const nextIsInWishlist = !wishlist.includes(productId);
      const updated = nextIsInWishlist
        ? [...wishlist, productId]
        : wishlist.filter((id) => id !== productId);

      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      setIsInWishlist(nextIsInWishlist);
      
      window.dispatchEvent(
        new CustomEvent<WishlistUpdatedDetail>('wishlist-updated', {
          detail: {
            ids: updated,
            count: updated.length,
          },
        }),
      );
    } catch (error) {
      logger.error('Error updating wishlist', { error, productId });
    }
  };

  return { isInWishlist, toggleWishlist };
}




