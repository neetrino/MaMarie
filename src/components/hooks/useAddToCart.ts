'use client';

import { useRouter } from 'next/navigation';
import { logger } from '../../lib/utils/logger';
import { useTranslation } from '../../lib/i18n-client';

export interface AddToCartFlyContext {
  origin?: HTMLElement | null;
  imageUrl?: string | null;
}

interface UseAddToCartProps {
  productId: string;
  productSlug: string;
  inStock: boolean;
  /**
   * Kept for API compatibility with existing card calls.
   * Card flow now redirects to PDP before any add-to-cart action.
   */
  defaultVariantId?: string | null;
  /** Kept for API compatibility with existing card calls. */
  price?: number;
  /** Kept for API compatibility with existing card calls. */
  title?: string;
  /** Kept for API compatibility with existing card calls. */
  image?: string | null;
  /** Kept for API compatibility with existing card calls. */
  originalPrice?: number | null;
  /** Kept for API compatibility with existing card calls. */
  stock?: number;
  /** Card CTA: open product page to choose color/size before cart add. */
  redirectToProductPage?: boolean;
}

/**
 * Hook for adding products to cart
 * @param props - Product information
 * @returns Object with loading state and addToCart function
 */
export function useAddToCart({
  productId: _productId,
  productSlug,
  inStock,
  defaultVariantId: _defaultVariantId,
  price: _price,
  title: _title,
  image: _image,
  originalPrice: _originalPrice,
  stock: _stock,
  redirectToProductPage = true,
}: UseAddToCartProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const addToCart = (_fly?: AddToCartFlyContext) => {
    if (!inStock) {
      return;
    }

    // Validate product slug before making API call
    if (!productSlug || productSlug.trim() === '' || productSlug.includes(' ')) {
      logger.warn('[PRODUCT CARD] Invalid product slug', { productSlug });
      alert(t('common.alerts.invalidProduct'));
      return;
    }

    if (redirectToProductPage) {
      const encodedSlug = encodeURIComponent(productSlug.trim());
      router.push(`/products/${encodedSlug}`);
    }
  };

  return { isAddingToCart: false, addToCart };
}




