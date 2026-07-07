import { useCallback } from 'react';
import { useAdminCategories as useSharedAdminCategories } from '../../providers/AdminReferenceDataProvider';
import type { Category } from '../types';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

/**
 * Hook for fetching and managing categories (shared admin cache).
 */
export function useCategories(): UseCategoriesReturn {
  const { categories, loading, refetchCategories } = useSharedAdminCategories();

  const fetchCategories = useCallback(async () => {
    await refetchCategories();
  }, [refetchCategories]);

  return {
    categories: categories as Category[],
    loading,
    error: null,
    fetchCategories,
  };
}
