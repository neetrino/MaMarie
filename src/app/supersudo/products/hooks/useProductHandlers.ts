import { useState, type Dispatch, type SetStateAction } from 'react';
import type { FormEvent } from 'react';
import { apiClient } from '../../../../lib/api-client';
import { useTranslation } from '../../../../lib/i18n-client';
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
      alert(t('admin.products.bulkDeleteFinished').replace('{success}', (ids.length - failed.length).toString()).replace('{total}', ids.length.toString()));
    } catch (err) {
      console.error('❌ [ADMIN] Bulk delete products error:', err);
      alert(t('admin.products.failedToDelete'));
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
      alert(t('admin.products.duplicateSuccess'));
    } catch (err: unknown) {
      console.error('❌ [ADMIN] Error duplicating product:', err);
      const message =
        err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      alert(t('admin.products.duplicateError').replace('{message}', message));
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
      alert(t('admin.products.deletedSuccess'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      console.error('❌ [ADMIN] Error deleting product:', err);
      alert(t('admin.products.errorDeleting').replace('{message}', message));
    }
  };

  const handleTogglePublished = async (productId: string, currentStatus: boolean, productTitle: string) => {
    try {
      const newStatus = !currentStatus;
      const updateData = {
        published: newStatus,
      };

      logger.debug(`🔄 [ADMIN] Updating product status to ${newStatus ? 'published' : 'draft'}`);

      await apiClient.put(`/api/v1/admin/products/${productId}`, updateData);

      logger.debug(`✅ [ADMIN] Product ${newStatus ? 'published' : 'unpublished'} successfully`);

      fetchProducts();

      if (newStatus) {
        alert(t('admin.products.productPublished').replace('{title}', productTitle));
      } else {
        alert(t('admin.products.productDraft').replace('{title}', productTitle));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('admin.common.unknownErrorFallback');
      console.error('❌ [ADMIN] Error updating product status:', err);
      alert(t('admin.products.errorUpdatingStatus').replace('{message}', message));
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
      alert(t('admin.products.errorUpdatingFeatured').replace('{message}', message));
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
        alert(t('admin.products.featuredToggleFinished').replace('{success}', successCount.toString()).replace('{total}', products.length.toString()));
      }
    } catch (err) {
      setProducts(previousProducts);
      console.error('❌ [ADMIN] Toggle all featured error:', err);
      alert(t('admin.products.failedToUpdateFeatured'));
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
    handleDeleteProduct,
    handleTogglePublished,
    handleToggleFeatured,
    handleToggleAllFeatured,
  };
}
