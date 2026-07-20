import { useState, type Dispatch, type SetStateAction } from 'react';
import type { FormEvent } from 'react';
import { apiClient } from '../../../../lib/api-client';
import { useTranslation } from '../../../../lib/i18n-client';
import { showToast } from '../../../../components/Toast';
import type { Product } from '../types';
import { logger } from "@/lib/utils/logger";
import { useAdminDialogs } from '../../context/AdminDialogsContext';

interface UseProductHandlersProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  fetchProducts: () => Promise<void>;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  setPage: (page: number | ((prev: number) => number)) => void;
  setBulkDeleting: (deleting: boolean) => void;
  setTogglingAllFeatured: (toggling: boolean) => void;
}

function patchProductFeatured(
  setProducts: Dispatch<SetStateAction<Product[]>>,
  productId: string,
  featured: boolean
): void {
  setProducts((prev) =>
    prev.map((product) => (product.id === productId ? { ...product, featured } : product))
  );
}

function patchProductPublished(
  setProducts: Dispatch<SetStateAction<Product[]>>,
  productId: string,
  published: boolean
): void {
  setProducts((prev) =>
    prev.map((product) => (product.id === productId ? { ...product, published } : product))
  );
}

export function useProductHandlers({
  products,
  setProducts,
  fetchProducts,
  selectedIds,
  setSelectedIds,
  setPage,
  setBulkDeleting,
  setTogglingAllFeatured,
}: UseProductHandlersProps) {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [duplicatingProductId, setDuplicatingProductId] = useState<string | null>(null);
  const [togglingFeaturedIds, setTogglingFeaturedIds] = useState<Set<string>>(new Set());
  const [togglingPublishedIds, setTogglingPublishedIds] = useState<Set<string>>(new Set());

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (products.length === 0) return;
    setSelectedIds(prev => {
      const allIds = products.map(p => p.id);
      const hasAll = allIds.every(id => prev.has(id));
      return hasAll ? new Set() : new Set(allIds);
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.products.bulkDeleteConfirm').replace('{count}', selectedIds.size.toString()),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) return;
    setBulkDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map(id => apiClient.delete(`/api/v1/admin/products/${id}`))
      );
      const failed = results.filter(r => r.status === 'rejected');
      setSelectedIds(new Set());
      await fetchProducts();
      showToast(
        t('admin.products.bulkDeleteFinished')
          .replace('{success}', (ids.length - failed.length).toString())
          .replace('{total}', ids.length.toString()),
        failed.length > 0 ? 'warning' : 'success',
      );
    } catch (err) {
      console.error('❌ [ADMIN] Bulk delete products error:', err);
      showToast(t('admin.products.failedToDelete'), 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    if (duplicatingProductId) {
      return;
    }
    setDuplicatingProductId(productId);
    try {
      await apiClient.post<{ id: string }>(
        `/api/v1/admin/products/${productId}/duplicate`,
        {}
      );
      await fetchProducts();
      showToast(t('admin.products.duplicateSuccess'), 'success');
    } catch (err: unknown) {
      console.error('❌ [ADMIN] Error duplicating product:', err);
      const message =
        err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      showToast(t('admin.products.duplicateError').replace('{message}', message), 'error');
    } finally {
      setDuplicatingProductId(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productTitle: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.products.deleteConfirm').replace('{title}', productTitle),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/products/${productId}`);
      logger.debug('✅ [ADMIN] Product deleted successfully');
      fetchProducts();
      showToast(t('admin.products.deletedSuccess'), 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      console.error('❌ [ADMIN] Error deleting product:', err);
      showToast(t('admin.products.errorDeleting').replace('{message}', message), 'error');
    }
  };

  const handleTogglePublished = async (
    productId: string,
    currentStatus: boolean,
    productTitle: string,
  ) => {
    if (togglingPublishedIds.has(productId)) {
      return;
    }

    const newStatus = !currentStatus;
    const previousProducts = products;

    patchProductPublished(setProducts, productId, newStatus);
    setTogglingPublishedIds((prev) => new Set(prev).add(productId));

    try {
      logger.debug(`🔄 [ADMIN] Updating product status to ${newStatus ? 'published' : 'draft'}`);
      await apiClient.put(`/api/v1/admin/products/${productId}`, { published: newStatus });
      logger.debug(`✅ [ADMIN] Product ${newStatus ? 'published' : 'unpublished'} successfully`);

      showToast(
        newStatus
          ? t('admin.products.productPublished').replace('{title}', productTitle)
          : t('admin.products.productDraft').replace('{title}', productTitle),
        'success',
      );
    } catch (err: unknown) {
      setProducts(previousProducts);
      const message = err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      console.error('❌ [ADMIN] Error updating product status:', err);
      showToast(t('admin.products.errorUpdatingStatus').replace('{message}', message), 'error');
    } finally {
      setTogglingPublishedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    if (togglingFeaturedIds.has(productId)) {
      return;
    }

    const newStatus = !currentStatus;
    const previousProducts = products;

    patchProductFeatured(setProducts, productId, newStatus);
    setTogglingFeaturedIds((prev) => new Set(prev).add(productId));

    try {
      logger.debug(`⭐ [ADMIN] Updating product featured status to ${newStatus ? 'featured' : 'not featured'}`);
      await apiClient.put(`/api/v1/admin/products/${productId}`, { featured: newStatus });
      logger.debug(`✅ [ADMIN] Product ${newStatus ? 'marked as featured' : 'removed from featured'} successfully`);
    } catch (err: unknown) {
      setProducts(previousProducts);
      const message = err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      console.error('❌ [ADMIN] Error updating product featured status:', err);
      showToast(t('admin.products.errorUpdatingFeatured').replace('{message}', message), 'error');
    } finally {
      setTogglingFeaturedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleToggleAllFeatured = async () => {
    if (products.length === 0) return;

    const allFeatured = products.every(p => p.featured);
    const newStatus = !allFeatured;
    const previousProducts = products;

    setProducts((prev) => prev.map((product) => ({ ...product, featured: newStatus })));
    setTogglingAllFeatured(true);

    try {
      const results = await Promise.allSettled(
        products.map(product =>
          apiClient.put(`/api/v1/admin/products/${product.id}`, { featured: newStatus })
        )
      );

      const failed = results.filter(r => r.status === 'rejected');
      const successCount = products.length - failed.length;

      logger.debug(`✅ [ADMIN] Toggle all featured completed: ${successCount}/${products.length} successful`);

      if (failed.length > 0) {
        setProducts(previousProducts);
        showToast(
          t('admin.products.featuredToggleFinished')
            .replace('{success}', successCount.toString())
            .replace('{total}', products.length.toString()),
          'warning',
        );
      }
    } catch (err) {
      setProducts(previousProducts);
      console.error('❌ [ADMIN] Toggle all featured error:', err);
      showToast(t('admin.products.failedToUpdateFeatured'), 'error');
    } finally {
      setTogglingAllFeatured(false);
    }
  };

  return {
    handleSearch,
    toggleSelect,
    toggleSelectAll,
    handleBulkDelete,
    handleDuplicateProduct,
    duplicatingProductId,
    togglingFeaturedIds,
    togglingPublishedIds,
    handleDeleteProduct,
    handleTogglePublished,
    handleToggleFeatured,
    handleToggleAllFeatured,
  };
}
