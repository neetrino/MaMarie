import type { MouseEvent } from 'react';
import { WISHLIST_KEY, COMPARE_KEY } from '../types';
import { t } from '../../../../lib/i18n';
import type { LanguageCode } from '../../../../lib/language';
import {
  cacheWishlistProduct,
  pruneWishlistProductCache,
  removeWishlistProductFromCache,
  type WishlistProductSnapshotInput,
} from '../../../../lib/wishlist-product-cache';
import type { WishlistUpdatedDetail } from '../../../../components/hooks/useWishlist';

interface UseProductActionsProps {
  productId: string | null;
  productSnapshot?: WishlistProductSnapshotInput | null;
  isInWishlist: boolean;
  setIsInWishlist: (value: boolean) => void;
  isInCompare: boolean;
  setIsInCompare: (value: boolean) => void;
  setShowMessage: (message: string | null) => void;
  language: LanguageCode;
}

export function useProductActions({
  productId,
  productSnapshot,
  isInWishlist,
  setIsInWishlist,
  isInCompare,
  setIsInCompare,
  setShowMessage,
  language,
}: UseProductActionsProps) {
  const handleAddToWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      const wishlist: string[] = stored ? JSON.parse(stored) : [];
      
      if (isInWishlist) {
        const updated = wishlist.filter(id => id !== productId);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        removeWishlistProductFromCache(productId);
        pruneWishlistProductCache(updated);
        setIsInWishlist(false);
        window.dispatchEvent(
          new CustomEvent<WishlistUpdatedDetail>('wishlist-updated', {
            detail: { ids: updated, count: updated.length },
          }),
        );
      } else {
        const updated = [...wishlist, productId];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        if (productSnapshot) {
          cacheWishlistProduct(productSnapshot);
        }
        pruneWishlistProductCache(updated);
        setIsInWishlist(true);
        window.dispatchEvent(
          new CustomEvent<WishlistUpdatedDetail>('wishlist-updated', {
            detail: { ids: updated, count: updated.length },
          }),
        );
      }
    } catch {
      // Silently fail
    }
  };

  const handleCompareToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      const compare: string[] = stored ? JSON.parse(stored) : [];
      
      if (isInCompare) {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(compare.filter(id => id !== productId)));
        setIsInCompare(false);
        setShowMessage(t(language, 'product.removedFromCompare'));
      } else {
        if (compare.length >= 4) {
          setShowMessage(t(language, 'product.compareListFull'));
        } else {
          compare.push(productId);
          localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
          setIsInCompare(true);
          setShowMessage(t(language, 'product.addedToCompare'));
        }
      }
      
      setTimeout(() => setShowMessage(null), 2000);
      window.dispatchEvent(new Event('compare-updated'));
    } catch {
      // Silently fail
    }
  };

  return {
    handleAddToWishlist,
    handleCompareToggle,
  };
}
