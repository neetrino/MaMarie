'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Input } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { logger } from '@/lib/utils/logger';
import { localizeBrandsForDisplay } from '@/lib/admin/reference-locale-display';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { useAdminBrands } from '../providers/AdminReferenceDataProvider';
import { showToast } from '../../../components/Toast';
import { AttributeLocaleSwitcher } from '../attributes/AttributeLocaleSwitcher';
import { BrandFormSheet } from './BrandFormSheet';
import { BrandsTable } from './BrandsTable';
import { useBrandForm, type BrandListItem } from './useBrandForm';

export function BrandsSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const { brands: sharedBrands, loading: sharedBrandsLoading, refetchBrands } = useAdminBrands();
  const [brands, setBrands] = useState<BrandListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const data = await refetchBrands();
      setBrands((data as BrandListItem[]) || []);
    } catch (err) {
      logger.error('❌ [ADMIN] Error fetching brands:', err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, [refetchBrands]);

  const form = useBrandForm(fetchBrands);

  useEffect(() => {
    if (!sharedBrandsLoading) {
      setBrands(sharedBrands as BrandListItem[]);
      setLoading(false);
    }
  }, [sharedBrands, sharedBrandsLoading]);

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.brands.deleteConfirm').replace('{name}', brandName),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/brands/${brandId}`);
      fetchBrands();
      showToast(t('admin.brands.deletedSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; detail?: string; message?: string };
      const errorMessage =
        error.data?.detail || error.detail || error.message || t('admin.brands.unknownError');
      showToast(`${t('admin.brands.errorDeleting')}\n\n${errorMessage}`, 'error');
    }
  };

  const filteredBrands = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(normalizedSearch) ||
        brand.slug.toLowerCase().includes(normalizedSearch) ||
        brand.translations?.some((row) => row.name.toLowerCase().includes(normalizedSearch)),
    );
  }, [brands, searchQuery]);

  const displayBrands = useMemo(
    () => localizeBrandsForDisplay(filteredBrands, form.contentLocale),
    [filteredBrands, form.contentLocale],
  );

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.brands.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.brands.title')}</h2>
        <Button
          onClick={form.handleOpenAddModal}
          variant="primary"
          size="sm"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('admin.brands.addNew')}
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('admin.brands.enterBrandName')}
          className="max-w-md"
        />
        <AttributeLocaleSwitcher value={form.contentLocale} onChange={form.setContentLocale} />
      </div>

      {displayBrands.length === 0 ? (
        <p className="py-2 text-sm text-gray-500">{t('admin.brands.noBrands')}</p>
      ) : (
        <BrandsTable
          brands={displayBrands}
          onEdit={form.handleOpenEditModal}
          onDelete={handleDeleteBrand}
        />
      )}

      <BrandFormSheet
        isOpen={form.showModal}
        isEditing={Boolean(form.editingBrand)}
        formData={form.formData}
        contentLocale={form.contentLocale}
        submitting={form.submitting}
        imageUploading={form.imageUploading}
        incompleteLocales={form.incompleteLocales}
        onClose={form.handleCloseModal}
        onContentLocaleChange={form.setContentLocale}
        onNameChange={form.handleNameChange}
        onSlugChange={form.handleSlugChange}
        onPublishedChange={(published) =>
          form.setFormData((current) => ({ ...current, published }))
        }
        onImageUpload={form.handleImageUpload}
        onRemoveImage={() => form.setFormData((current) => ({ ...current, logoUrl: '' }))}
        onSubmit={form.handleSubmit}
      />
    </>
  );
}
