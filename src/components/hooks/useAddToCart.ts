'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { ApiError } from '../../lib/api-client/types';
import { isQuietCartStockValidationError } from '../../lib/api-client/error-handler';
import { logger } from '../../lib/utils/logger';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import type { CartItem, GuestCartItem } from '../../app/cart/types';
import { dispatchCartUpdated } from '../../lib/cart-events';
import { openCartDrawer } from '../../lib/cart-drawer';
import { getCartCount } from '../../lib/storageCounts';
import { readGuestCartItems, writeGuestCartItems } from '../../lib/guest-cart-storage';
import { playCartFlyAnimation } from '../../lib/cart-fly-animation';

interface ProductDetails {
  id: string;
  slug: string;
  variants?: Array<{
    id: string;
    sku: string;
    price: number;
    stock: number;
    available: boolean;
  }>;
}

export interface AddToCartFlyContext {
  origin?: HTMLElement | null;
  imageUrl?: string | null;
}

interface UseAddToCartProps {
  productId: string;
  productSlug: string;
  inStock: boolean;
  /** When present, skip GET /api/v1/products/:slug and use this variant for add-to-cart (one request instead of two). */
  defaultVariantId?: string | null;
  /** Unit price (AMD) — stored in guest cart so Header doesn't need extra API calls. */
  price?: number;
  /** Cached for instant cart drawer display. */
  title?: string;
  image?: string | null;
  originalPrice?: number | null;
  stock?: number;
}

interface OptimisticCartItemInput {
  item: { id: string; quantity: number; price: number };
  productId: string;
  productSlug: string;
  variantId: string;
  title: string;
  image?: string | null;
  stock?: number;
  originalPrice?: number | null;
}

interface EagerCartUpdateInput extends Omit<OptimisticCartItemInput, 'item' | 'variantId'> {
  price?: number;
}

function buildOptimisticCartItem({
  item,
  productId,
  productSlug,
  variantId,
  title,
  image,
  stock,
  originalPrice,
}: OptimisticCartItemInput): CartItem {
  return {
    id: item.id,
    variant: {
      id: variantId,
      sku: '',
      stock,
      product: {
        id: productId,
        title,
        slug: productSlug,
        image: image ?? null,
      },
    },
    quantity: item.quantity,
    price: item.price,
    originalPrice: originalPrice ?? null,
    total: item.price * item.quantity,
  };
}

function dispatchEagerCartUpdate(
  variantId: string | null | undefined,
  product: EagerCartUpdateInput,
): void {
  if (!variantId || product.price === undefined) {
    return;
  }

  dispatchCartUpdated({
    cartSummary: {
      itemsCount: getCartCount() + 1,
      total: product.price,
    },
    optimisticItem: buildOptimisticCartItem({
      item: {
        id: `optimistic-${product.productId}-${variantId}`,
        quantity: 1,
        price: product.price,
      },
      variantId,
      ...product,
    }),
  });
}

/**
 * Hook for adding products to cart
 * @param props - Product information
 * @returns Object with loading state and addToCart function
 */
export function useAddToCart({
  productId,
  productSlug,
  inStock,
  defaultVariantId,
  price: propPrice,
  title: propTitle,
  image: propImage,
  originalPrice: propOriginalPrice,
  stock: propStock,
}: UseAddToCartProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = async (fly?: AddToCartFlyContext) => {
    if (!inStock) {
      return;
    }

    // Validate product slug before making API call
    if (!productSlug || productSlug.trim() === '' || productSlug.includes(' ')) {
      logger.warn('[PRODUCT CARD] Invalid product slug', { productSlug });
      alert(t('common.alerts.invalidProduct'));
      return;
    }

    playCartFlyAnimation({
      fromElement: fly?.origin ?? null,
      imageUrl: fly?.imageUrl ?? null,
    });
    openCartDrawer();

    // If user is not logged in, use localStorage for cart
    if (!isLoggedIn) {
      setIsAddingToCart(true);
      try {
        const cart = readGuestCartItems();

        let variantId: string;
        let variantStock: number | undefined = propStock;
        let variantPrice: number | undefined = propPrice || undefined;
        if (defaultVariantId) {
          variantId = defaultVariantId;
        } else {
          const encodedSlug = encodeURIComponent(productSlug.trim());
          const productDetails = await apiClient.get<ProductDetails>(`/api/v1/products/${encodedSlug}`);
          if (!productDetails.variants || productDetails.variants.length === 0) {
            alert(t('common.alerts.noVariantsAvailable'));
            setIsAddingToCart(false);
            return;
          }
          variantId = productDetails.variants[0].id;
          variantStock = productDetails.variants[0].stock;
          if (!variantPrice) variantPrice = productDetails.variants[0].price;
        }

        const existingItem = cart.find(
          (item) => item.productId === productId && item.variantId === variantId,
        );
        const currentQuantityInCart = existingItem?.quantity || 0;
        const totalQuantity = currentQuantityInCart + 1;

        if (variantStock !== undefined && totalQuantity > variantStock) {
          alert(t('common.alerts.noMoreStockAvailable'));
          setIsAddingToCart(false);
          return;
        }

        if (existingItem) {
          existingItem.quantity = totalQuantity;
          if (!existingItem.productSlug) existingItem.productSlug = productSlug;
          if (variantPrice) existingItem.price = variantPrice;
          if (propTitle) existingItem.title = propTitle;
          if (propImage != null) existingItem.image = propImage;
          if (propOriginalPrice != null) existingItem.originalPrice = propOriginalPrice;
          if (variantStock !== undefined) existingItem.stock = variantStock;
        } else {
          const newItem: GuestCartItem = {
            productId,
            productSlug,
            variantId,
            quantity: 1,
            price: variantPrice || 0,
            title: propTitle,
            image: propImage ?? null,
            originalPrice: propOriginalPrice ?? null,
            stock: variantStock,
          };
          cart.push(newItem);
        }

        writeGuestCartItems(cart);
        dispatchCartUpdated();
      } catch (error: unknown) {
        logger.error('[PRODUCT CARD] Error adding to guest cart', { error });
        const err = error as { message?: string; status?: number };
        if (err?.message?.includes('does not exist') || err?.message?.includes('404') || err?.status === 404) {
          alert(t('common.alerts.productNotFound'));
        } else {
          router.push(`/login?redirect=/products`);
        }
      } finally {
        setIsAddingToCart(false);
      }
      return;
    }

    setIsAddingToCart(true);

    try {
      let variantId: string;
      let variantPrice = propPrice;
      let variantStock = propStock;
      if (defaultVariantId) {
        variantId = defaultVariantId;
      } else {
        const encodedSlug = encodeURIComponent(productSlug.trim());
        const productDetails = await apiClient.get<ProductDetails>(`/api/v1/products/${encodedSlug}`);
        if (!productDetails.variants || productDetails.variants.length === 0) {
          alert(t('common.alerts.noVariantsAvailable'));
          return;
        }
        variantId = productDetails.variants[0].id;
        variantPrice = productDetails.variants[0].price;
        variantStock = productDetails.variants[0].stock;
      }

      dispatchEagerCartUpdate(variantId, {
        productId,
        productSlug,
        title: propTitle ?? t('common.messages.product'),
        image: propImage,
        price: variantPrice,
        stock: variantStock,
        originalPrice: propOriginalPrice,
      });

      const response = await apiClient.post<{
        item: { id: string; quantity: number; price: number };
        cartSummary?: { itemsCount: number; total: number };
      }>(
        '/api/v1/cart/items',
        {
          productId: productId,
          variantId: variantId,
          quantity: 1,
        }
      );

      dispatchCartUpdated({
        cartSummary: response.cartSummary,
        optimisticItem: buildOptimisticCartItem({
          item: response.item,
          productId,
          productSlug,
          variantId,
          title: propTitle ?? t('common.messages.product'),
          image: propImage,
          stock: propStock,
          originalPrice: propOriginalPrice,
        }),
      });
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        statusCode?: number;
        data?: unknown;
        response?: {
          data?: {
            detail?: string;
            title?: string;
          };
        };
      };

      if (error instanceof ApiError && isQuietCartStockValidationError(error.status, error.data)) {
        alert(t('common.alerts.noMoreStockAvailable'));
        window.dispatchEvent(new Event('cart-updated'));
        setIsAddingToCart(false);
        return;
      }

      if (err?.message?.includes('does not exist') || err?.message?.includes('404') || err?.status === 404 || err?.statusCode === 404) {
        alert(t('common.alerts.productNotFound'));
        setIsAddingToCart(false);
        return;
      }

      if (
        err.response?.data?.detail?.includes('No more stock available') ||
        err.response?.data?.detail?.includes('exceeds available stock') ||
        err.response?.data?.title === 'Insufficient stock'
      ) {
        alert(t('common.alerts.noMoreStockAvailable'));
        setIsAddingToCart(false);
        return;
      }

      logger.error('[PRODUCT CARD] Error adding to cart', { error });

      if (err.message?.includes('401') || err.message?.includes('Unauthorized') || err?.status === 401 || err?.statusCode === 401) {
        router.push(`/login?redirect=/products`);
      } else {
        alert(t('common.alerts.failedToAddToCart'));
      }
      window.dispatchEvent(new Event('cart-updated'));
    } finally {
      setIsAddingToCart(false);
    }
  };

  return { isAddingToCart, addToCart };
}




