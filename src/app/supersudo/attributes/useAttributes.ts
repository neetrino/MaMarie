'use client';

import { useEffect, useState, useCallback, useRef, ChangeEvent } from 'react';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { showToast } from '../../../components/Toast';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { useAdminAttributesReference } from '../providers/AdminReferenceDataProvider';
import {
  DEFAULT_PRODUCT_CONTENT_LOCALE,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import {
  attributeLocaleTextMapFromRows,
  emptyAttributeLocaleTextMap,
  pickPrimaryAttributeText,
  resolveAttributeKeyFromNames,
  toAttributeTranslationRows,
  type AttributeLocaleTextMap,
} from '@/lib/admin/attribute-locale-helpers';

export interface AttributeValue {
  id: string;
  value: string;
  label: string;
  colors?: string[];
  imageUrl?: string | null;
  translations?: Array<{ locale: string; label: string }>;
}

export interface Attribute {
  id: string;
  key: string;
  name: string;
  type: string;
  filterable: boolean;
  translations?: Array<{ locale: string; name: string }>;
  values: AttributeValue[];
}

function labelsToApiPayload(map: AttributeLocaleTextMap) {
  return toAttributeTranslationRows(map).map((row) => ({
    locale: row.locale,
    label: row.text,
  }));
}

function namesToApiPayload(map: AttributeLocaleTextMap) {
  return toAttributeTranslationRows(map).map((row) => ({
    locale: row.locale,
    name: row.text,
  }));
}

export function useAttributes() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const {
    attributes: sharedAttributes,
    loading: sharedAttributesLoading,
    refetchAttributes,
  } = useAdminAttributesReference();

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreatingAttribute, setIsCreatingAttribute] = useState(false);
  const [contentLocale, setContentLocale] = useState<ProductContentLocale>(
    DEFAULT_PRODUCT_CONTENT_LOCALE,
  );
  const [editingAttribute, setEditingAttribute] = useState<string | null>(null);
  const [editingAttributeNames, setEditingAttributeNames] =
    useState<AttributeLocaleTextMap>(emptyAttributeLocaleTextMap());
  const [savingAttribute, setSavingAttribute] = useState(false);
  const [expandedAttributes, setExpandedAttributes] = useState<Set<string>>(new Set());
  const [formNames, setFormNames] = useState<AttributeLocaleTextMap>(emptyAttributeLocaleTextMap());
  const [newValueLabels, setNewValueLabels] =
    useState<AttributeLocaleTextMap>(emptyAttributeLocaleTextMap());
  const [addingValueTo, setAddingValueTo] = useState<string | null>(null);
  const [deletingValue, setDeletingValue] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{
    attributeId: string;
    value: AttributeValue;
  } | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);
  const [expandedValueId, setExpandedValueId] = useState<string | null>(null);
  const [editingLabels, setEditingLabels] =
    useState<AttributeLocaleTextMap>(emptyAttributeLocaleTextMap());
  const [editingColors, setEditingColors] = useState<string[]>([]);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [savingValue, setSavingValue] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAttributes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await refetchAttributes();
      setAttributes((data as Attribute[]) || []);
    } catch (err) {
      console.error('❌ [ADMIN] Error fetching attributes:', err);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  }, [refetchAttributes]);

  useEffect(() => {
    if (!sharedAttributesLoading) {
      setAttributes(sharedAttributes as Attribute[]);
      setLoading(false);
    }
  }, [sharedAttributes, sharedAttributesLoading]);

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingAttribute) {
      return;
    }

    const primaryName = pickPrimaryAttributeText(formNames);
    if (!primaryName) {
      showToast(t('admin.attributes.fillName'), 'warning');
      setContentLocale(PRIMARY_PRODUCT_CONTENT_LOCALE);
      return;
    }

    setIsCreatingAttribute(true);
    try {
      await apiClient.post('/api/v1/admin/attributes', {
        key: resolveAttributeKeyFromNames(formNames),
        type: 'select',
        filterable: true,
        translations: namesToApiPayload(formNames),
      });
      setShowAddForm(false);
      setFormNames(emptyAttributeLocaleTextMap());
      fetchAttributes();
      showToast(t('admin.attributes.createdSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage = error?.data?.detail || error?.message || 'Failed to create attribute';
      showToast(t('admin.attributes.errorCreating').replace('{message}', errorMessage), 'error');
    } finally {
      setIsCreatingAttribute(false);
    }
  };

  const handleDeleteAttribute = async (attributeId: string, attributeName: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.attributes.deleteConfirm').replace('{name}', attributeName),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/api/v1/admin/attributes/${attributeId}`);
      fetchAttributes();
      showToast(t('admin.attributes.deletedSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage = error?.data?.detail || error?.message || 'Failed to delete attribute';
      showToast(t('admin.attributes.errorDeleting').replace('{message}', errorMessage), 'error');
    }
  };

  const handleUpdateAttributeName = async (attributeId: string) => {
    const primaryName = pickPrimaryAttributeText(editingAttributeNames);
    if (!primaryName) {
      showToast(t('admin.attributes.fillName'), 'warning');
      setContentLocale(PRIMARY_PRODUCT_CONTENT_LOCALE);
      return;
    }

    try {
      setSavingAttribute(true);
      await apiClient.patch(`/api/v1/admin/attributes/${attributeId}/translations`, {
        translations: namesToApiPayload(editingAttributeNames),
      });
      setEditingAttribute(null);
      setEditingAttributeNames(emptyAttributeLocaleTextMap());
      fetchAttributes();
      showToast(t('admin.attributes.nameUpdatedSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      showToast(error?.data?.detail || error?.message || 'Failed to update attribute name', 'error');
    } finally {
      setSavingAttribute(false);
    }
  };

  const toggleAttributeEdit = (attribute: Attribute) => {
    if (editingAttribute === attribute.id) {
      setEditingAttribute(null);
      setEditingAttributeNames(emptyAttributeLocaleTextMap());
      return;
    }

    setEditingAttribute(attribute.id);
    setEditingAttributeNames(
      attributeLocaleTextMapFromRows(
        (attribute.translations || []).map((row) => ({ locale: row.locale, text: row.name })),
      ),
    );
    if (!attribute.translations?.length && attribute.name) {
      setEditingAttributeNames({
        ...emptyAttributeLocaleTextMap(),
        [PRIMARY_PRODUCT_CONTENT_LOCALE]: attribute.name,
      });
    }
  };

  const handleAddValue = async (attributeId: string) => {
    const primaryLabel = pickPrimaryAttributeText(newValueLabels);
    if (!primaryLabel) {
      showToast(t('admin.attributes.enterValue'), 'warning');
      setValueError(t('admin.attributes.enterValue'));
      setContentLocale(PRIMARY_PRODUCT_CONTENT_LOCALE);
      return;
    }

    const attribute = attributes.find((attr) => attr.id === attributeId);
    if (!attribute) {
      showToast(t('admin.attributes.attributeNotFound'), 'error');
      return;
    }

    const duplicate = attribute.values.find(
      (val) => val.label.toLowerCase().trim() === primaryLabel.toLowerCase(),
    );
    if (duplicate) {
      const errorMsg = t('admin.attributes.valueAlreadyExists').replace('{value}', primaryLabel);
      showToast(errorMsg, 'error', 5000);
      setValueError(errorMsg);
      return;
    }

    setValueError(null);
    try {
      setAddingValueTo(attributeId);
      await apiClient.post(`/api/v1/admin/attributes/${attributeId}/values`, {
        translations: labelsToApiPayload(newValueLabels),
      });
      setNewValueLabels(emptyAttributeLocaleTextMap());
      setAddingValueTo(null);
      showToast(t('admin.attributes.valueAddedSuccess'), 'success');
      fetchAttributes();
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage =
        error?.data?.detail || error?.message || t('admin.attributes.failedToAddValue');
      if (errorMessage.includes('already exists')) {
        const duplicateMsg = t('admin.attributes.valueAlreadyExists').replace(
          '{value}',
          primaryLabel,
        );
        showToast(duplicateMsg, 'error', 5000);
        setValueError(duplicateMsg);
      } else {
        showToast(errorMessage, 'error', 5000);
        setValueError(errorMessage);
      }
      setAddingValueTo(null);
    }
  };

  const handleDeleteValue = async (attributeId: string, valueId: string, valueLabel: string) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.attributes.deleteValueConfirm').replace('{label}', valueLabel),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) return;

    try {
      setDeletingValue(valueId);
      await apiClient.delete(`/api/v1/admin/attributes/${attributeId}/values/${valueId}`);
      fetchAttributes();
      setDeletingValue(null);
      showToast(t('admin.attributes.valueDeletedSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage = error?.data?.detail || error?.message || 'Failed to delete value';
      showToast(
        t('admin.attributes.errorDeletingValue').replace('{message}', errorMessage),
        'error',
      );
      setDeletingValue(null);
    }
  };

  const toggleValueEdit = (attributeId: string, value: AttributeValue) => {
    if (expandedValueId === value.id) {
      setExpandedValueId(null);
      setEditingValue(null);
      setEditingLabels(emptyAttributeLocaleTextMap());
      setEditingColors([]);
      setEditingImageUrl(null);
      return;
    }

    const fromTranslations = attributeLocaleTextMapFromRows(
      (value.translations || []).map((row) => ({ locale: row.locale, text: row.label })),
    );
    if (!value.translations?.length && value.label) {
      fromTranslations[PRIMARY_PRODUCT_CONTENT_LOCALE] = value.label;
    }

    setExpandedValueId(value.id);
    setEditingValue({ attributeId, value });
    setEditingLabels(fromTranslations);
    setEditingColors(value.colors || []);
    setEditingImageUrl(value.imageUrl || null);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFile = files.find((file) => file.type.startsWith('image/'));
    if (!imageFile) {
      showToast(t('admin.attributes.valueModal.selectImageFile'), 'warning');
      event.target.value = '';
      return;
    }

    try {
      setImageUploading(true);
      setEditingImageUrl(await fileToBase64(imageFile));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      showToast(message || t('admin.attributes.valueModal.failedToProcessImage'), 'error');
    } finally {
      setImageUploading(false);
      event.target.value = '';
    }
  };

  const handleSaveInlineValue = async () => {
    if (!editingValue) return;
    const primaryLabel = pickPrimaryAttributeText(editingLabels);
    if (!primaryLabel) {
      showToast(t('admin.attributes.enterValue'), 'warning');
      setContentLocale(PRIMARY_PRODUCT_CONTENT_LOCALE);
      return;
    }

    try {
      setSavingValue(true);
      await apiClient.patch(
        `/api/v1/admin/attributes/${editingValue.attributeId}/values/${editingValue.value.id}`,
        {
          translations: labelsToApiPayload(editingLabels),
          colors: editingColors,
          imageUrl: editingImageUrl,
        },
      );
      setExpandedValueId(null);
      setEditingValue(null);
      setEditingLabels(emptyAttributeLocaleTextMap());
      setEditingColors([]);
      setEditingImageUrl(null);
      fetchAttributes();
      showToast(t('admin.attributes.valueUpdatedSuccess'), 'success');
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage = error?.data?.detail || error?.message || 'Failed to update value';
      showToast(
        t('admin.attributes.errorUpdatingValue')?.replace('{message}', errorMessage) ||
          errorMessage,
        'error',
      );
    } finally {
      setSavingValue(false);
    }
  };

  const toggleExpand = (attributeId: string) => {
    setExpandedAttributes((prev) => {
      const next = new Set(prev);
      if (next.has(attributeId)) next.delete(attributeId);
      else next.add(attributeId);
      return next;
    });
  };

  const updateFormName = (locale: ProductContentLocale, name: string) => {
    setFormNames((prev) => ({ ...prev, [locale]: name }));
  };

  const updateEditingAttributeName = (locale: ProductContentLocale, name: string) => {
    setEditingAttributeNames((prev) => ({ ...prev, [locale]: name }));
  };

  const updateNewValueLabel = (locale: ProductContentLocale, label: string) => {
    setNewValueLabels((prev) => ({ ...prev, [locale]: label }));
    if (valueError) setValueError(null);
  };

  const updateEditingLabel = (locale: ProductContentLocale, label: string) => {
    setEditingLabels((prev) => ({ ...prev, [locale]: label }));
  };

  const resetFormNames = () => {
    setFormNames(emptyAttributeLocaleTextMap());
  };

  return {
    attributes,
    loading,
    showAddForm,
    isCreatingAttribute,
    contentLocale,
    editingAttribute,
    editingAttributeNames,
    savingAttribute,
    expandedAttributes,
    formNames,
    newValueLabels,
    addingValueTo,
    deletingValue,
    editingValue,
    valueError,
    expandedValueId,
    editingLabels,
    editingColors,
    editingImageUrl,
    savingValue,
    imageUploading,
    fileInputRef,
    setShowAddForm,
    setContentLocale,
    setEditingColors,
    setValueError,
    updateFormName,
    updateEditingAttributeName,
    updateNewValueLabel,
    updateEditingLabel,
    resetFormNames,
    handleCreateAttribute,
    handleDeleteAttribute,
    handleUpdateAttributeName,
    toggleAttributeEdit,
    handleAddValue,
    handleDeleteValue,
    toggleValueEdit,
    handleImageUpload,
    handleRemoveImage: () => setEditingImageUrl(null),
    handleSaveInlineValue,
    toggleExpand,
  };
}
