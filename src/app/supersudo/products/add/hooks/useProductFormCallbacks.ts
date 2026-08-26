import { logger } from "@/lib/utils/logger";
/**
 * Hook for product form callbacks and event handlers
 */

import type { ChangeEvent } from 'react';
import type { Brand, Category, Attribute, GeneratedVariant } from '../types';
import { generateSlug } from '../utils/productUtils';
import { ensureOneMainVariant } from '../utils/variantMainHelpers';
import { pickPrimaryFormFields, resolveSharedSlug } from '../utils/product-locale-fields';
import type { ProductContentLocale } from '@/constants/product-content-locales';
import type { ProductTranslationsByLocale } from '../utils/product-locale-fields';

interface UseProductFormCallbacksProps {
  formData: {
    title: string;
    slug: string;
    primaryCategoryId: string;
    translations: ProductTranslationsByLocale;
  };
  contentLocale: ProductContentLocale;
  categories: Category[];
  selectedAttributesForVariants: Set<string>;
  selectedAttributeValueIds: Record<string, string[]>;
  generatedVariants: GeneratedVariant[];
  setFormData: (updater: (prev: any) => any) => void;
  setSelectedAttributesForVariants: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  setSelectedAttributeValueIds: (value: Record<string, string[]> | ((prev: Record<string, string[]>) => Record<string, string[]>)) => void;
  setGeneratedVariants: (value: GeneratedVariant[] | ((prev: GeneratedVariant[]) => GeneratedVariant[])) => void;
  setSimpleProductData: (value: any | ((prev: any) => any)) => void;
  checkIsClothingCategory: (categoryId: string, categories: Category[]) => boolean;
}

export function useProductFormCallbacks({
  formData,
  contentLocale,
  categories,
  selectedAttributesForVariants,
  selectedAttributeValueIds,
  generatedVariants,
  setFormData,
  setSelectedAttributesForVariants,
  setSelectedAttributeValueIds,
  setGeneratedVariants,
  setSimpleProductData,
  checkIsClothingCategory,
}: UseProductFormCallbacksProps) {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      const translations = {
        ...prev.translations,
        [contentLocale]: { ...prev.translations[contentLocale], title },
      };
      const primary = pickPrimaryFormFields(translations);
      return {
        ...prev,
        translations,
        title: primary.title,
        slug: resolveSharedSlug(prev.slug, title),
      };
    });
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const descriptionHtml = e.target.value;
    setFormData((prev) => {
      const translations = {
        ...prev.translations,
        [contentLocale]: { ...prev.translations[contentLocale], descriptionHtml },
      };
      const primary = pickPrimaryFormFields(translations);
      return {
        ...prev,
        translations,
        descriptionHtml: primary.descriptionHtml,
      };
    });
  };

  const isClothingCategory = () => checkIsClothingCategory(formData.primaryCategoryId, categories);

  const handleAttributeToggle = (attributeId: string, checked: boolean) => {
    const newSet = new Set(selectedAttributesForVariants);
    if (checked) {
      newSet.add(attributeId);
    } else {
      newSet.delete(attributeId);
      const newValueIds = { ...selectedAttributeValueIds };
      delete newValueIds[attributeId];
      setSelectedAttributeValueIds(newValueIds);
    }
    setSelectedAttributesForVariants(newSet);
  };

  const handleAttributeRemove = (attributeId: string) => {
    const newSet = new Set(selectedAttributesForVariants);
    newSet.delete(attributeId);
    const newValueIds = { ...selectedAttributeValueIds };
    delete newValueIds[attributeId];
    setSelectedAttributeValueIds(newValueIds);
    setSelectedAttributesForVariants(newSet);
  };

  const handleVariantDelete = (variantId: string) => {
    setGeneratedVariants((prev) => {
      const filtered = prev.filter((v) => v.id !== variantId);
      const deletedWasMain = prev.find((v) => v.id === variantId)?.isMain;
      if (deletedWasMain && filtered.length > 0) {
        return filtered.map((v, index) => ({ ...v, isMain: index === 0 }));
      }
      return ensureOneMainVariant(filtered);
    });
  };

  const handleVariantAdd = () => {
    const baseSlug = formData.slug || generateSlug(formData.title) || 'PROD';
    const newVariant: GeneratedVariant = {
      id: `variant-${Date.now()}-${Math.random()}`,
      selectedValueIds: [],
      price: '0.00',
      compareAtPrice: '0.00',
      stock: '0',
      sku: baseSlug.toUpperCase(),
      image: null,
      isMain: false,
    };
    setGeneratedVariants((prev) => {
      const updated = ensureOneMainVariant([...prev, newVariant]);
      logger.debug('✅ [VARIANT BUILDER] New manual variant added:', {
        newVariantId: newVariant.id,
        totalVariants: updated.length,
        manualVariants: updated.filter((v) => v.id !== 'variant-all').length,
        autoVariants: updated.filter((v) => v.id === 'variant-all').length,
      });
      return updated;
    });
  };

  return {
    handleTitleChange,
    handleSlugChange,
    handleDescriptionChange,
    isClothingCategory,
    handleAttributeToggle,
    handleAttributeRemove,
    handleVariantDelete,
    handleVariantAdd,
  };
}

