'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { showToast } from '../../../components/Toast';
import {
  DEFAULT_PRODUCT_CONTENT_LOCALE,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  PRODUCT_CONTENT_LOCALES,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import {
  brandLocaleNameMapFromRows,
  emptyBrandLocaleNameMap,
  pickPrimaryBrandName,
  resolveBrandSlug,
  toBrandTranslationRows,
} from '@/lib/admin/brand-locale-helpers';
import type { BrandFormState } from './BrandFormSheet';

export interface BrandListItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  published?: boolean;
  translations?: Array<{ locale: string; name: string }>;
}

function createEmptyFormState(): BrandFormState {
  return {
    names: emptyBrandLocaleNameMap(),
    slug: '',
    logoUrl: '',
    published: 'published',
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useBrandForm(onSaved: () => void) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandListItem | null>(null);
  const [formData, setFormData] = useState<BrandFormState>(createEmptyFormState);
  const [contentLocale, setContentLocale] = useState<ProductContentLocale>(
    DEFAULT_PRODUCT_CONTENT_LOCALE,
  );
  const [slugIsManual, setSlugIsManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const incompleteLocales = (() => {
    const missing = new Set<ProductContentLocale>();
    for (const locale of PRODUCT_CONTENT_LOCALES) {
      if (!formData.names[locale].trim()) {
        missing.add(locale);
      }
    }
    return missing;
  })();

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormData(createEmptyFormState());
    setContentLocale(DEFAULT_PRODUCT_CONTENT_LOCALE);
    setSlugIsManual(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (brand: BrandListItem) => {
    const names = brand.translations?.length
      ? brandLocaleNameMapFromRows(
          brand.translations.map((row) => ({ locale: row.locale, text: row.name })),
        )
      : (() => {
          const map = emptyBrandLocaleNameMap();
          map[PRIMARY_PRODUCT_CONTENT_LOCALE] = brand.name;
          return map;
        })();

    setEditingBrand(brand);
    setFormData({
      names,
      slug: brand.slug,
      logoUrl: brand.logoUrl || '',
      published: brand.published ? 'published' : 'draft',
    });
    setContentLocale(DEFAULT_PRODUCT_CONTENT_LOCALE);
    setSlugIsManual(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData(createEmptyFormState());
    setSlugIsManual(false);
  };

  const handleNameChange = (locale: ProductContentLocale, value: string) => {
    setFormData((current) => {
      const names = { ...current.names, [locale]: value };
      return {
        ...current,
        names,
        slug: resolveBrandSlug(names, current.slug, slugIsManual),
      };
    });
  };

  const handleSlugChange = (value: string) => {
    setSlugIsManual(value.trim().length > 0);
    setFormData((current) => ({ ...current, slug: value }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFile = files.find((file) => file.type.startsWith('image/'));
    if (!imageFile) {
      showToast(t('admin.attributes.valueModal.selectImageFile'), 'warning');
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
        error instanceof Error
          ? error.message
          : t('admin.attributes.valueModal.failedToProcessImage');
      showToast(message, 'error');
    } finally {
      setImageUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const primaryName = pickPrimaryBrandName(formData.names);
    if (!primaryName) {
      showToast(t('admin.brands.nameRequired'), 'warning');
      setContentLocale(PRIMARY_PRODUCT_CONTENT_LOCALE);
      return;
    }
    if (!formData.slug.trim()) {
      showToast(t('admin.brands.slugRequired'), 'warning');
      return;
    }

    const payload = {
      translations: toBrandTranslationRows(formData.names),
      slug: formData.slug.trim(),
      logoUrl: formData.logoUrl.trim() || null,
      published: formData.published === 'published',
    };

    setSubmitting(true);
    try {
      if (editingBrand) {
        await apiClient.put(`/api/v1/admin/brands/${editingBrand.id}`, payload);
        showToast(t('admin.brands.updatedSuccess'), 'success');
      } else {
        await apiClient.post('/api/v1/admin/brands', payload);
        showToast(t('admin.brands.createdSuccess'), 'success');
      }
      onSaved();
      handleCloseModal();
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; detail?: string; message?: string };
      const errorMessage =
        error.data?.detail || error.detail || error.message || t('admin.brands.unknownError');
      showToast(`${t('admin.brands.errorSaving')}\n\n${errorMessage}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    editingBrand,
    formData,
    contentLocale,
    submitting,
    imageUploading,
    incompleteLocales,
    setContentLocale,
    setFormData,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleNameChange,
    handleSlugChange,
    handleImageUpload,
    handleSubmit,
  };
}
