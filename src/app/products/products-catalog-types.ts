import type {
  ProductColorOption,
  ProductSizeOption,
} from '../../lib/services/product-variant-attributes';

export interface ProductsCatalogProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
  labels?: Array<{
    id: string;
    type: 'text' | 'percentage';
    value: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string | null;
  }>;
  originalPrice?: number | null;
}

export interface ProductsCatalogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsCatalogResponse {
  data: ProductsCatalogProduct[];
  meta: ProductsCatalogMeta;
}
