import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n-client';
import { patchAdminQueryData } from '@/lib/admin/admin-query-cache';
import { ADMIN_QUERY_KEYS } from '@/lib/admin/admin-query-keys';
import { PRIMARY_PRODUCT_CONTENT_LOCALE } from '@/constants/product-content-locales';
import { toSlug } from '@/lib/utils/slug';
import type { Brand, Category } from '../types';
import { logger } from "@/lib/utils/logger";

interface UseBrandAndCategoryCreationProps {
  formData: {
    brandIds: string[];
    primaryCategoryId: string;
  };
  useNewBrand: boolean;
  newBrandName: string;
  useNewCategory: boolean;
  newCategoryName: string;
  setBrands: (updater: (prev: Brand[]) => Brand[]) => void;
  setCategories: (updater: (prev: Category[]) => Category[]) => void;
  setLoading: (loading: boolean) => void;
}

export function useBrandAndCategoryCreation({
  formData,
  useNewBrand,
  newBrandName,
  useNewCategory,
  newCategoryName,
  setBrands,
  setCategories,
  setLoading,
}: UseBrandAndCategoryCreationProps) {
  const { t } = useTranslation();

  const createBrandAndCategory = async (): Promise<{
    finalBrandIds: string[];
    finalPrimaryCategoryId: string;
    creationMessages: string[];
    error: boolean;
  }> => {
    const creationMessages: string[] = [];
    const finalBrandIds = [...formData.brandIds];
    let finalPrimaryCategoryId = formData.primaryCategoryId;

    // Create new brand if provided
    if (useNewBrand && newBrandName.trim()) {
      try {
        logger.debug('🏷️ [ADMIN] Creating new brand:', newBrandName);
        const brandResponse = await apiClient.post<{ data: Brand }>('/api/v1/admin/brands', {
          name: newBrandName.trim(),
          locale: 'en',
        });
        if (brandResponse.data) {
          if (!finalBrandIds.includes(brandResponse.data.id)) {
            finalBrandIds.push(brandResponse.data.id);
          }
          patchAdminQueryData<Brand[]>(ADMIN_QUERY_KEYS.brands, (current) => {
            const list = current ?? [];
            if (list.some((item) => item.id === brandResponse.data.id)) {
              return list;
            }
            return [...list, brandResponse.data];
          });
          setBrands((prev) => [...prev, brandResponse.data]);
          logger.debug('✅ [ADMIN] Brand created:', brandResponse.data.id);
          creationMessages.push(t('admin.products.add.brandCreatedSuccess').replace('{name}', newBrandName.trim()));
        }
      } catch (err: any) {
        console.error('❌ [ADMIN] Error creating brand:', err);
        setLoading(false);
        return { finalBrandIds, finalPrimaryCategoryId, creationMessages, error: true };
      }
    }

    // Create new category if provided
    if (useNewCategory && newCategoryName.trim()) {
      try {
        logger.debug('📁 [ADMIN] Creating new category:', newCategoryName);
        const trimmedName = newCategoryName.trim();
        const categoryResponse = await apiClient.post<{ data: Category }>('/api/v1/admin/categories', {
          translations: [{ locale: PRIMARY_PRODUCT_CONTENT_LOCALE, title: trimmedName }],
          slug: toSlug(trimmedName),
          requiresSizes: false,
          published: true,
        });
        if (categoryResponse.data) {
          finalPrimaryCategoryId = categoryResponse.data.id;
          patchAdminQueryData<Category[]>(ADMIN_QUERY_KEYS.categories, (current) => {
            const list = current ?? [];
            if (list.some((item) => item.id === categoryResponse.data.id)) {
              return list;
            }
            return [...list, categoryResponse.data];
          });
          setCategories((prev) => [...prev, categoryResponse.data]);
          logger.debug('✅ [ADMIN] Category created:', categoryResponse.data.id);
          creationMessages.push(
            t('admin.products.add.categoryCreatedSuccess').replace('{name}', trimmedName)
          );
        }
      } catch (err: unknown) {
        logger.error('❌ [ADMIN] Error creating category:', err);
        setLoading(false);
        return { finalBrandIds, finalPrimaryCategoryId, creationMessages, error: true };
      }
    }

    return { finalBrandIds, finalPrimaryCategoryId, creationMessages, error: false };
  };

  return { createBrandAndCategory };
}






