import type { ProductTranslationInput } from "../product-translation-input";

/**
 * Update product data interface
 */
export interface UpdateProductData {
  title?: string;
  slug?: string;
  subtitle?: string;
  descriptionHtml?: string;
  brandId?: string;
  primaryCategoryId?: string;
  categoryIds?: string[];
  published?: boolean;
  featured?: boolean;
  locale?: string;
  translations?: ProductTranslationInput[];
  media?: unknown[];
  labels?: Array<{
    id?: string;
    type: string;
    value: string;
    position: string;
    color?: string | null;
  }>;
  attributeIds?: string[];
  variants?: Array<{
    id?: string;
    price: string | number;
    compareAtPrice?: string | number;
    stock: string | number;
    sku?: string;
    color?: string;
    size?: string;
    imageUrl?: string;
    isMain?: boolean;
    published?: boolean;
    options?: Array<{
      attributeKey: string;
      value: string;
      valueId?: string;
    }>;
  }>;
}




