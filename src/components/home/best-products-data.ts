import type { HomeProductCardData } from './HomeProductCard';
import type {
  ProductColorOption,
  ProductSizeOption,
} from '../../lib/services/product-variant-attributes';

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
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
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
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    averageRating: product.averageRating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,
  };
}
