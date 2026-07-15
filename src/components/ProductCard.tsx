'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useWishlist } from './hooks/useWishlist';
import { buildWishlistProductSnapshot } from '../lib/wishlist-product-cache';
import { useAddToCart } from './hooks/useAddToCart';
import { useCurrency } from './hooks/useCurrency';
import { ProductCardList } from './ProductCard/ProductCardList';
import { ProductCardGrid } from './ProductCard/ProductCardGrid';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
    logoUrl?: string | null;
  } | null;
  defaultVariantId?: string | null;
  labels?: import('./ProductLabels').ProductLabel[];
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  globalDiscount?: number | null;
  discountPercent?: number | null;
  colors?: Array<{ value: string; imageUrl?: string | null; colors?: string[] | null }>;
}

type ViewMode = 'list' | 'grid-2' | 'grid-3';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
}

/**
 * Product card component with Compare, Wishlist and Cart icons
 * Displays product image, title, category, price and action buttons
 */
export function ProductCard({ product, viewMode = 'grid-3' }: ProductCardProps) {
  const isCompact = viewMode === 'grid-3';
  const currency = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist(product.id);
  const { isAddingToCart, addToCart } = useAddToCart({
    productId: product.id,
    productSlug: product.slug,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId ?? undefined,
    price: product.price,
    title: product.title,
    image: product.image,
    originalPrice: product.originalPrice ?? product.compareAtPrice,
  });
  const [imageError, setImageError] = useState(false);

  // Wishlist mirrors cart behavior: guests can save products locally.
  const handleWishlistToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(buildWishlistProductSnapshot({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      compareAtPrice: product.compareAtPrice,
      discountPercent: product.discountPercent,
      image: product.image,
      inStock: product.inStock,
      brand: product.brand ? { id: product.brand.id, name: product.brand.name } : null,
      defaultVariantId: product.defaultVariantId,
      colors: product.colors,
    }));
  };

  // Handle add to cart
  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget as HTMLElement;
    const card = button.closest('[data-product-card]');
    const origin =
      (card?.querySelector('[data-product-fly-origin]') as HTMLElement | null) ?? button;
    addToCart({ origin, imageUrl: product.image });
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <ProductCardList
        product={product}
        currency={currency}
        isInWishlist={isInWishlist}
        isAddingToCart={isAddingToCart}
        imageError={imageError}
        onImageError={() => setImageError(true)}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
      />
    );
  }

  // Grid view layout
  return (
    <ProductCardGrid
      product={product}
      currency={currency}
      isInWishlist={isInWishlist}
      isAddingToCart={isAddingToCart}
      imageError={imageError}
      isCompact={isCompact}
      onImageError={() => setImageError(true)}
      onWishlistToggle={handleWishlistToggle}
      onAddToCart={handleAddToCart}
    />
  );
}

