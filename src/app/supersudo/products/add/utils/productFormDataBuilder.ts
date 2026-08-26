/**
 * Utilities for building product form data
 */

import type { ProductData, Variant, ProductLabel } from '../types';
import {
  createEmptyTranslationsByLocale,
  pickPrimaryFormFields,
  type ProductTranslationsByLocale,
} from './product-locale-fields';
import {
  isProductContentLocale,
  pickProductContentTranslation,
  type ProductContentLocale,
} from '@/constants/product-content-locales';

interface FormData {
  title: string;
  slug: string;
  descriptionHtml: string;
  translations: ProductTranslationsByLocale;
  brandIds: string[];
  primaryCategoryId: string;
  categoryIds: string[];
  published: boolean;
  featured: boolean;
  imageUrls: string[];
  featuredImageIndex: number;
  mainProductImage: string;
  variants: Variant[];
  labels: ProductLabel[];
}

function translationsFromProduct(product: ProductData): ProductTranslationsByLocale {
  const translations = createEmptyTranslationsByLocale();
  const rows = product.translations ?? [];

  for (const row of rows) {
    if (!isProductContentLocale(row.locale)) {
      continue;
    }
    const locale: ProductContentLocale = row.locale;
    translations[locale] = {
      title: row.title || '',
      descriptionHtml: row.descriptionHtml || '',
    };
  }

  if (!rows.some((row) => isProductContentLocale(row.locale))) {
    translations.hy = {
      title: product.title || '',
      descriptionHtml: product.descriptionHtml || '',
    };
  }

  return translations;
}

function sharedSlugFromProduct(product: ProductData): string {
  const rows = product.translations ?? [];
  const picked = pickProductContentTranslation(rows, 'hy');
  return picked?.slug || product.slug || '';
}

/**
 * Builds form data from product data
 */
export function buildFormData(
  product: ProductData,
  normalizedMedia: string[],
  featuredIndexFromApi: number,
  mainProductImage: string,
  mergedVariant: Variant
): FormData {
  const brandIds = product.brandId ? [product.brandId] : [];
  const translations = translationsFromProduct(product);
  const primary = pickPrimaryFormFields(translations);

  return {
    title: primary.title,
    slug: sharedSlugFromProduct(product),
    descriptionHtml: primary.descriptionHtml,
    translations,
    brandIds: brandIds,
    primaryCategoryId: product.primaryCategoryId || '',
    categoryIds: product.categoryIds || [],
    published: product.published || false,
    featured: product.featured || false,
    imageUrls: normalizedMedia,
    featuredImageIndex:
      featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length
        ? featuredIndexFromApi
        : 0,
    mainProductImage:
      normalizedMedia.length > 0 &&
      normalizedMedia[featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length ? featuredIndexFromApi : 0]
        ? normalizedMedia[featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length ? featuredIndexFromApi : 0]
        : mainProductImage || '',
    variants: [mergedVariant],
    labels: (product.labels || []).map((label) => ({
      id: label.id || '',
      type: label.type || 'text',
      value: label.value || '',
      position: label.position || 'top-left',
      color: label.color || null,
    })),
  };
}
