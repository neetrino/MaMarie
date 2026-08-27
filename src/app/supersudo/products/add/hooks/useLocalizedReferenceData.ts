import { useMemo } from 'react';
import type { ProductContentLocale } from '@/constants/product-content-locales';
import {
  localizeAttributesForDisplay,
  localizeBrandsForDisplay,
  localizeCategoriesForDisplay,
} from '@/lib/admin/reference-locale-display';
import type { Attribute, Brand, Category } from '../types';

export function useLocalizedReferenceData(
  categories: Category[],
  brands: Brand[],
  attributes: Attribute[],
  contentLocale: ProductContentLocale,
) {
  return useMemo(
    () => ({
      categories: localizeCategoriesForDisplay(categories, contentLocale),
      brands: localizeBrandsForDisplay(brands, contentLocale),
      attributes: localizeAttributesForDisplay(attributes, contentLocale),
    }),
    [categories, brands, attributes, contentLocale],
  );
}
