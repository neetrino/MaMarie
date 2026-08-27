'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { flattenCategories, type Category } from '../utils';

interface CategoriesResponse {
  data: Category[];
}

/**
 * Hook for fetching categories
 */
export function useCategories() {
  const { lang } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<CategoriesResponse>('/api/v1/categories/tree', {
          params: { lang },
        });

        const categoriesList = response.data || [];
        const allCategories = flattenCategories(categoriesList);
        setCategories(allCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, [lang]);

  return { categories, loading };
}




