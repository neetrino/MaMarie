'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useTranslation } from '../lib/i18n-client';
import { ColorPaletteSelector } from './ColorPaletteSelector';
import { logger } from '@/lib/utils/logger';
import { AdminSideSheet } from '../app/supersudo/components/AdminSideSheet';
import {
  AdminSideSheetCancelButton,
  AdminSideSheetFooter,
  AdminSideSheetPrimaryButton,
} from '../app/supersudo/components/AdminSideSheetActions';

interface AttributeValueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: {
    id: string;
    label: string;
    colors?: string[];
    imageUrl?: string | null;
  };
  attributeId: string;
  onSave: (data: {
    label?: string;
    colors?: string[];
    imageUrl?: string | null;
  }) => Promise<void>;
}

export function AttributeValueEditModal({
  isOpen,
  onClose,
  value,
  attributeId,
  onSave,
}: AttributeValueEditModalProps) {
  const { t } = useTranslation();
  const [label, setLabel] = useState(value.label);
  const [colors, setColors] = useState<string[]>(value.colors || []);
  const [imageUrl, setImageUrl] = useState<string | null>(value.imageUrl || null);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLabel(value.label);
      setColors(value.colors || []);
      setImageUrl(value.imageUrl || null);
    }
  }, [value, isOpen]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise<string>((resolve, reject) => {
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
      alert(t('admin.attributes.valueModal.selectImageFile'));
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    try {
      setImageUploading(true);
      const base64 = await fileToBase64(imageFile);
      setImageUrl(base64);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('admin.attributes.valueModal.failedToProcessImage');
      logger.error('Error uploading attribute value image', { attributeId, error: message });
      alert(message);
    } finally {
      setImageUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const saveData = {
        label: label.trim() !== value.label ? label.trim() : undefined,
        colors: colors.length > 0 ? colors : undefined,
        imageUrl: imageUrl,
      };
      logger.debug('Saving attribute value', {
        valueId: value.id,
        saveData,
      });
      await onSave(saveData);
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('admin.attributes.valueModal.failedToSave');
      logger.error('Error saving attribute value', { valueId: value.id, error: message });
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <AdminSideSheetFooter>
      <AdminSideSheetCancelButton type="button" onClick={onClose} disabled={saving}>
        {t('admin.attributes.valueModal.cancel')}
      </AdminSideSheetCancelButton>
      <AdminSideSheetPrimaryButton
        type="button"
        onClick={handleSave}
        disabled={saving || !label.trim()}
        className="flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {t('admin.attributes.valueModal.saving')}
          </>
        ) : (
          t('admin.attributes.valueModal.save')
        )}
      </AdminSideSheetPrimaryButton>
    </AdminSideSheetFooter>
  );

  return (
    <AdminSideSheet
      isOpen={isOpen}
      title={t('admin.attributes.valueModal.editValue')}
      closeLabel={t('admin.attributes.valueModal.close')}
      onClose={onClose}
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('admin.attributes.valueModal.label')}
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
            placeholder={t('admin.attributes.valueModal.labelPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {t('admin.attributes.valueModal.colors')}
            </label>
            <ColorPaletteSelector colors={colors} onColorsChange={setColors} />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {t('admin.attributes.valueModal.image')}
            </label>
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt={t('admin.attributes.valueModal.imagePreview')}
                    className="h-32 w-32 rounded-lg border border-gray-300 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                    title={t('admin.attributes.valueModal.removeImage')}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {imageUploading ? t('admin.attributes.valueModal.uploading') : t('admin.attributes.valueModal.changeImage')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {imageUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                    {t('admin.attributes.valueModal.uploading')}
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('admin.attributes.valueModal.uploadImage')}
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </AdminSideSheet>
  );
}
