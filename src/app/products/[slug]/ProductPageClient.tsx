'use client';

import Link from 'next/link';
import { useLayoutEffect, type ReactNode } from 'react';
import { apiClient } from '../../../lib/api-client';
import { t } from '../../../lib/i18n';
import { useAuth } from '../../../lib/auth/AuthContext';
import { RelatedProducts } from '../../../components/RelatedProducts';
import { ProductReviews } from '../../../components/ProductReviews';
import { LazyWhenVisible } from '../../../components/LazyWhenVisible';
import type { Review } from '../../../components/ProductReviews/utils';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductInfoAndActions } from './ProductInfoAndActions';
import { ProductPageFrame } from './ProductPageFrame';
import { ProductPageShell } from './ProductPageShell';
import { useProductPage } from './useProductPage';
import { dispatchCartUpdated } from '../../../lib/cart-events';
import {
  clearCartSnapshot,
  clearGuestCartItems,
  readCartSnapshot,
  readGuestCartItems,
  upsertCartSnapshotItem,
  writeCartSnapshot,
  writeGuestCartItems,
} from '../../../lib/guest-cart-storage';
import type { CartItem, GuestCartItem } from '../../../app/cart/types';
import { playCartFlyAnimation } from '../../../lib/cart-fly-animation';
import {
  PRODUCT_PDP_GRID_CLASS,
  PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX,
  PRODUCT_PDP_REVIEWS_PLACEHOLDER_MIN_HEIGHT_PX,
} from './constants';
import type { Product } from './types';
import type { LanguageCode } from '../../../lib/language';

interface ProductPageClientProps {
  slugParam: string;
  initialProduct: Product;
  initialReviews: Review[];
  serverLang: LanguageCode;
  /** Streamed related row from the server (Suspense). */
  relatedSection?: ReactNode;
}

export function ProductPageClient({
  slugParam,
  initialProduct,
  initialReviews,
  serverLang,
  relatedSection,
}: ProductPageClientProps) {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const {
    product,
    loading,
    notFound,
    images,
    currentImageIndex,
    setCurrentImageIndex,
    currency,
    language,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
    isAddingToCart,
    setIsAddingToCart,
    showMessage,
    setShowMessage,
    isInWishlist,
    quantity,
    reviews,
    averageRating,
    slug,
    attributeGroups,
    colorGroups,
    sizeGroups,
    currentVariant,
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    maxQuantity,
    isOutOfStock,
    isVariationRequired,
    hasUnavailableAttributes,
    unavailableAttributes,
    canAddToCart,
    scrollToReviews,
    getOptionValue,
    adjustQuantity,
    handleColorSelect,
    handleSizeSelect,
    handleAttributeValueSelect,
    handleAddToWishlist,
    getRequiredAttributesMessage,
  } = useProductPage({
    slugParam,
    initialProduct,
    initialReviews,
    serverLang,
  });

  useLayoutEffect(() => {
    if (!product) {
      return;
    }
    window.scrollTo(0, 0);
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (isAuthLoading) {
      return;
    }

    const requiresColorSelection = colorGroups.length > 0 && colorGroups.some((group) => group.stock > 0);
    if (requiresColorSelection && !selectedColor) {
      setShowMessage(t(language, 'product.selectColor'));
      setTimeout(() => setShowMessage(null), 2000);
      return;
    }

    if (!canAddToCart || !product || !currentVariant) {
      return;
    }
    const flyOrigin = document.querySelector('[data-product-fly-origin]');
    const imageUrl = images[currentImageIndex] ?? images[0] ?? null;
    playCartFlyAnimation({
      fromElement: flyOrigin,
      imageUrl,
    });
    setIsAddingToCart(true);
    try {
      if (!isLoggedIn) {
        const cart = readGuestCartItems();
        const existing = cart.find((item) => item.variantId === currentVariant.id);
        if (existing) {
          existing.quantity += quantity;
          if (selectedColor) {
            existing.selectedColor = selectedColor;
          }
          if (selectedSize) {
            existing.selectedSize = selectedSize;
          }
        } else {
          const newItem: GuestCartItem = {
            productId: product.id,
            productSlug: product.slug,
            variantId: currentVariant.id,
            quantity,
            selectedColor: selectedColor ?? undefined,
            selectedSize: selectedSize ?? undefined,
            price,
            title: product.title,
            image: imageUrl,
            originalPrice: originalPrice ?? compareAtPrice ?? null,
            stock: maxQuantity,
          };
          cart.push(newItem);
        }
        writeGuestCartItems(cart);
        clearCartSnapshot();
        const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
        dispatchCartUpdated({ cartSummary: { itemsCount, total } });
      } else {
        type AddCartItemResponse = {
          item: { id: string; variantId: string; quantity: number; price: number };
          cartSummary: { itemsCount: number; total: number };
        };

        const response = await apiClient.post<AddCartItemResponse>('/api/v1/cart/items', {
          productId: product.id,
          variantId: currentVariant.id,
          quantity,
        });

        const optimisticItem: CartItem = {
          id: response.item.id,
          variant: {
            id: currentVariant.id,
            sku: currentVariant.sku ?? '',
            stock: maxQuantity,
            product: {
              id: product.id,
              title: product.title,
              slug: product.slug,
              image: imageUrl,
            },
          },
          quantity: response.item.quantity,
          price: response.item.price,
          originalPrice: originalPrice ?? compareAtPrice ?? null,
          total: response.item.price * response.item.quantity,
          selectedColor: selectedColor ?? null,
          selectedSize: selectedSize ?? null,
        };

        const nextSnapshot = upsertCartSnapshotItem(
          readCartSnapshot(),
          optimisticItem,
          response.cartSummary.itemsCount,
        );
        writeCartSnapshot(nextSnapshot);
        clearGuestCartItems();
        dispatchCartUpdated({
          optimisticItem,
          cartSummary: response.cartSummary,
        });
      }
    } catch {
      setShowMessage(t(language, 'product.errorAddingToCart'));
      setTimeout(() => setShowMessage(null), 2000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading && !product) {
    return <ProductPageShell />;
  }

  if (notFound && !product) {
    return (
      <ProductPageFrame className="text-center space-y-4">
        <p className="text-lg text-neutral-600">{t(language, 'common.messages.noProductsFound')}</p>
        <Link href="/products" className="inline-block text-blue-600 font-medium hover:underline">
          {t(language, 'common.navigation.products')}
        </Link>
      </ProductPageFrame>
    );
  }

  if (!product) {
    return (
      <ProductPageFrame className="text-center space-y-4">
        <p className="text-lg text-neutral-600">{t(language, 'common.messages.invalidProduct')}</p>
        <Link href="/products" className="inline-block text-blue-600 font-medium hover:underline">
          {t(language, 'common.navigation.products')}
        </Link>
      </ProductPageFrame>
    );
  }

  return (
    <ProductPageFrame>
      <div className={PRODUCT_PDP_GRID_CLASS}>
        <ProductImageGallery
          images={images}
          product={product}
          discountPercent={discountPercent}
          language={language}
          currentImageIndex={currentImageIndex}
          onImageIndexChange={setCurrentImageIndex}
          mainImagePriority={currentImageIndex === 0}
          isInWishlist={isInWishlist}
          onAddToWishlist={handleAddToWishlist}
        />

        <ProductInfoAndActions
          product={product}
          price={price}
          originalPrice={originalPrice}
          compareAtPrice={compareAtPrice}
          discountPercent={discountPercent}
          currency={currency}
          language={language}
          averageRating={averageRating}
          reviewsCount={reviews.length}
          quantity={quantity}
          maxQuantity={maxQuantity}
          isOutOfStock={isOutOfStock}
          isVariationRequired={isVariationRequired}
          hasUnavailableAttributes={hasUnavailableAttributes}
          unavailableAttributes={unavailableAttributes}
          canAddToCart={canAddToCart}
          isAddingToCart={isAddingToCart}
          isInWishlist={isInWishlist}
          showMessage={showMessage}
          isLoggedIn={isLoggedIn}
          currentVariant={currentVariant}
          attributeGroups={attributeGroups}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          selectedAttributeValues={selectedAttributeValues}
          colorGroups={colorGroups}
          sizeGroups={sizeGroups}
          onQuantityAdjust={adjustQuantity}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onScrollToReviews={scrollToReviews}
          onColorSelect={handleColorSelect}
          onSizeSelect={handleSizeSelect}
          onAttributeValueSelect={handleAttributeValueSelect}
          getOptionValue={getOptionValue}
          getRequiredAttributesMessage={getRequiredAttributesMessage}
        />
      </div>

      <div className="mt-24">
        {relatedSection ?? (
          <LazyWhenVisible minHeightPx={PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX}>
            <RelatedProducts
              productSlug={slug}
              categorySlug={product.categories?.[0]?.slug}
              currentProductId={product.id}
            />
          </LazyWhenVisible>
        )}
      </div>
      <div id="product-reviews" className="mt-16 scroll-mt-24">
        <LazyWhenVisible minHeightPx={PRODUCT_PDP_REVIEWS_PLACEHOLDER_MIN_HEIGHT_PX}>
          <ProductReviews
            productSlug={slug}
            productId={product.id}
            initialReviews={initialReviews}
          />
        </LazyWhenVisible>
      </div>
    </ProductPageFrame>
  );
}
