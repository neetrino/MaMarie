'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@shop/ui';
import { useAuth } from '../../../lib/auth/AuthContext';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { logger } from '@/lib/utils/logger';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { ClaySelect } from '../../../components/ClaySelect';
import type { PartnerStoreFormData, PartnerStoreItem } from '@/lib/partner-stores/types';
import { getStoredLanguage } from '@/lib/language';

const EMPTY_FORM: PartnerStoreFormData = {
  name: '',
  address: '',
  logoUrl: '',
  published: 'draft',
};

function PartnerStoresSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [stores, setStores] = useState<PartnerStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<PartnerStoreItem | null>(null);
  const [formData, setFormData] = useState<PartnerStoreFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useBodyScrollLock(showModal);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const lang = getStoredLanguage();
      const response = await apiClient.get<{ data: PartnerStoreItem[] }>(
        `/api/v1/admin/partner-stores?lang=${lang}`,
      );
      setStores(response.data ?? []);
    } catch (error) {
      logger.error('❌ [ADMIN] Error fetching partner stores:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStores();
  }, [fetchStores]);

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.stores.deleteConfirm').replace('{name}', storeName),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/partner-stores/${storeId}`);
      await fetchStores();
      alert(t('admin.stores.deletedSuccess'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('admin.stores.unknownError');
      alert(`${t('admin.stores.errorDeleting')}\n\n${message}`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingStore(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleOpenEditModal = (store: PartnerStoreItem) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      logoUrl: store.logoUrl ?? '',
      published: store.published ? 'published' : 'draft',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStore(null);
    setFormData(EMPTY_FORM);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const imageFile = files.find((file) => file.type.startsWith('image/'));
    if (!imageFile) {
      alert(t('admin.attributes.valueModal.selectImageFile'));
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    try {
      setImageUploading(true);
      const base64 = await fileToBase64(imageFile);
      setFormData((current) => ({ ...current, logoUrl: base64 }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('admin.attributes.valueModal.failedToProcessImage');
      alert(message);
    } finally {
      setImageUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert(t('admin.stores.nameRequired'));
      return;
    }
    if (!formData.address.trim()) {
      alert(t('admin.stores.addressRequired'));
      return;
    }

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      logoUrl: formData.logoUrl.trim() || undefined,
      published: formData.published === 'published',
      locale: getStoredLanguage(),
    };

    setSubmitting(true);
    try {
      if (editingStore) {
        await apiClient.put(`/api/v1/admin/partner-stores/${editingStore.id}`, payload);
        alert(t('admin.stores.updatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/partner-stores', payload);
        alert(t('admin.stores.createdSuccess'));
      }

      await fetchStores();
      handleCloseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('admin.stores.unknownError');
      alert(`${t('admin.stores.errorSaving')}\n\n${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStores = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) {
      return stores;
    }

    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(normalizedSearch) ||
        store.address.toLowerCase().includes(normalizedSearch) ||
        store.slug.toLowerCase().includes(normalizedSearch),
    );
  }, [searchQuery, stores]);

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.stores.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.stores.title')}</h2>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="sm"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('admin.stores.addNew')}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('admin.stores.searchPlaceholder')}
          className="max-w-md"
        />
      </div>

      {filteredStores.length === 0 ? (
        <p className="py-2 text-sm text-gray-500">{t('admin.stores.noStores')}</p>
      ) : (
        <div className="max-h-[32rem] overflow-y-auto rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('admin.stores.storeName')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('admin.stores.address')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('admin.stores.status')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('admin.products.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-gray-100 bg-gray-50 transition-colors hover:bg-gray-100"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="h-10 w-10 rounded-md border border-gray-200 object-cover"
                        />
                      ) : null}
                      <span className="text-sm font-medium text-gray-900">{store.name}</span>
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-sm text-gray-500">{store.address}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {store.published ? t('admin.stores.published') : t('admin.stores.draft')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(store)}
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        aria-label={t('admin.stores.edit')}
                        title={t('admin.stores.edit')}
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDeleteStore(store.id, store.name)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-800"
                        aria-label={t('admin.stores.delete')}
                        title={t('admin.stores.delete')}
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStore ? t('admin.stores.editStore') : t('admin.stores.addNewStore')}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
              <div>
                <label htmlFor="store-name" className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.stores.storeName')}
                </label>
                <input
                  id="store-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
                  placeholder={t('admin.stores.enterStoreName')}
                  required
                />
              </div>

              <div>
                <label htmlFor="store-address" className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.stores.address')}
                </label>
                <textarea
                  id="store-address"
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                  className="min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
                  placeholder={t('admin.stores.enterAddress')}
                  required
                />
              </div>

              <ClaySelect
                id="store-status"
                label={t('admin.stores.status')}
                value={formData.published}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    published: value as PartnerStoreFormData['published'],
                  })
                }
                placeholder={t('admin.stores.published')}
                options={[
                  { value: 'published', label: t('admin.stores.published') },
                  { value: 'draft', label: t('admin.stores.draft') },
                ]}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('admin.stores.logo')}
                </label>
                {formData.logoUrl ? (
                  <div className="mb-3">
                    <div className="relative inline-block">
                      <img
                        src={formData.logoUrl}
                        alt={t('admin.stores.logoPreview')}
                        className="h-24 w-24 rounded-lg border border-gray-300 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: '' })}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                        title={t('admin.stores.removeLogo')}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                  {imageUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                      {t('admin.stores.uploadingLogo')}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {formData.logoUrl ? t('admin.stores.changeLogo') : t('admin.stores.uploadLogo')}
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void handleImageUpload(event);
                    }}
                    disabled={imageUploading}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>
                  {t('admin.stores.cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={submitting || imageUploading}>
                  {submitting
                    ? t('admin.stores.saving')
                    : editingStore
                      ? t('admin.stores.update')
                      : t('admin.stores.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function StoresAdminPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      router.push('/supersudo');
    }
  }, [isAdmin, isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <Card className="p-6">
      <PartnerStoresSection />
    </Card>
  );
}
