'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStoredCurrency, DEFAULT_CURRENCY } from '../../../lib/currency';
import { getStoredLanguage, DEFAULT_LANGUAGE, type LanguageCode } from '../../../lib/language';
import { t } from '../../../lib/i18n';
import { buildWishlistProductSnapshot } from '../../../lib/wishlist-product-cache';
import type { Review } from '../../../components/ProductReviews/utils';
import { useAttributeGroups } from './useAttributeGroups';
import { useProductImages } from './hooks/useProductImages';
import { useProductFetch } from './hooks/useProductFetch';
import { useWishlistCompare } from './hooks/useWishlistCompare';
import { useProductReviews } from './hooks/useProductReviews';
import { useVariantSelection } from './hooks/useVariantSelection';
import { useProductActions } from './hooks/useProductActions';
import { useProductQuantity } from './hooks/useProductQuantity';
import { useProductCalculations } from './hooks/useProductCalculations';
import type { Product } from './types';

interface UseProductPageOptions {
  slugParam: string;
  initialProduct: Product;
  initialReviews: Review[];
  serverLang: LanguageCode;
}

function parseSlugParam(rawSlug: string): { slug: string; variantIdFromUrl: string | null } {
  const slugParts = rawSlug.includes(':') ? rawSlug.split(':') : [rawSlug];
  return {
    slug: slugParts[0] ?? '',
    variantIdFromUrl: slugParts.length > 1 ? slugParts[1] : null,
  };
}

export function useProductPage({
  slugParam,
  initialProduct,
  initialReviews,
  serverLang,
}: UseProductPageOptions) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const { slug, variantIdFromUrl } = parseSlugParam(slugParam);

  const {
    product,
    loading,
    notFound,
  } = useProductFetch({
    slug,
    variantIdFromUrl,
    initialProduct,
    serverLang,
  });

  const images = useProductImages(product);

  const {
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
    currentVariant,
    getOptionValue,
    handleColorSelect,
    handleSizeSelect,
    handleAttributeValueSelect,
  } = useVariantSelection({
    product,
    images,
    setCurrentImageIndex,
  });

  const attributeGroups = useAttributeGroups({
    product,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
  });

  const {
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    isOutOfStock,
    colorGroups,
    sizeGroups,
    isVariationRequired,
    unavailableAttributes,
    hasUnavailableAttributes,
    canAddToCart,
  } = useProductCalculations({
    product,
    currentVariant,
    attributeGroups,
    selectedColor,
    selectedSize,
  });

  const { quantity, setQuantity, maxQuantity, adjustQuantity } = useProductQuantity({
    currentVariant,
    isOutOfStock,
    isVariationRequired,
  });

  const { isInWishlist, setIsInWishlist, isInCompare, setIsInCompare } = useWishlistCompare({
    productId: product?.id || null,
  });

  const { reviews, averageRating } = useProductReviews({
    slug,
    productId: product?.id ?? null,
    initialReviews,
  });

  const wishlistSnapshot = useMemo(() => {
    if (!product) {
      return null;
    }

    return buildWishlistProductSnapshot({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price,
      originalPrice,
      compareAtPrice,
      discountPercent,
      image: images[0] ?? currentVariant?.imageUrl ?? null,
      inStock: !isOutOfStock,
      brand: product.brand ? { id: product.brand.id, name: product.brand.name } : null,
      defaultVariantId: currentVariant?.id ?? product.variants[0]?.id ?? null,
      averageRating,
      reviewsCount: reviews.length,
    });
  }, [
    product,
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    images,
    currentVariant,
    isOutOfStock,
    averageRating,
    reviews.length,
  ]);

  const { handleAddToWishlist, handleCompareToggle } = useProductActions({
    productId: product?.id || null,
    productSnapshot: wishlistSnapshot,
    isInWishlist,
    setIsInWishlist,
    isInCompare,
    setIsInCompare,
    setShowMessage,
    language,
  });

  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);

  useEffect(() => {
    const handleCurrencyUpdate = () => setCurrency(getStoredCurrency());
    const handleCurrencyRatesUpdate = () => setCurrency(getStoredCurrency());
    const handleLanguageUpdate = () => setLanguage(getStoredLanguage());

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
    window.addEventListener('language-updated', handleLanguageUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  useEffect(() => {
    if (images.length > 0 && currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [images.length, currentImageIndex]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && variantIdFromUrl) {
      const variantById = product.variants.find(v => v.id === variantIdFromUrl || v.id.endsWith(variantIdFromUrl));
      const variantByIndex = product.variants[parseInt(variantIdFromUrl) - 1];
      const initialVariant = variantById || variantByIndex || product.variants[0];
      setSelectedVariant(initialVariant);
      setCurrentImageIndex(0);
    }
  }, [product, variantIdFromUrl, setSelectedVariant]);

  const scrollToReviews = useCallback(() => {
    const reviewsElement = document.getElementById('product-reviews');
    if (reviewsElement) {
      reviewsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const getRequiredAttributesMessage = (): string => {
    const needsColor = colorGroups.length > 0 && colorGroups.some(g => g.stock > 0) && !selectedColor;
    const needsSize = sizeGroups.length > 0 && sizeGroups.some(g => g.stock > 0) && !selectedSize;
    
    if (needsColor && needsSize) return t(language, 'product.selectColorAndSize');
    if (needsColor) return t(language, 'product.selectColor');
    if (needsSize) return t(language, 'product.selectSize');
    return t(language, 'product.selectOptions');
  };

  return {
    product,
    loading,
    notFound,
    images,
    currentImageIndex,
    setCurrentImageIndex,
    currency,
    language,
    selectedVariant,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
    isAddingToCart,
    setIsAddingToCart,
    showMessage,
    setShowMessage,
    isInWishlist,
    isInCompare,
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
    handleCompareToggle,
    getRequiredAttributesMessage,
  };
}
