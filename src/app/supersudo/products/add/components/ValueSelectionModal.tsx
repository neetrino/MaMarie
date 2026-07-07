'use client';

import { useTranslation } from '../../../../../lib/i18n-client';
import { getColorHex } from '../../../../../lib/colorMap';
import type { Attribute, GeneratedVariant } from '../types';
import { logger } from '@/lib/utils/logger';
import { AdminSideSheet } from '../../../components/AdminSideSheet';
import {
  AdminSideSheetCancelButton,
  AdminSideSheetFooter,
} from '../../../components/AdminSideSheetActions';

interface ValueSelectionModalProps {
  openValueModal: { variantId: string; attributeId: string } | null;
  variant: GeneratedVariant | undefined;
  attribute: Attribute | undefined;
  onClose: () => void;
  onVariantUpdate: (updater: (prev: GeneratedVariant[]) => GeneratedVariant[]) => void;
  onAttributeValueIdsUpdate: (updater: (prev: Record<string, string[]>) => Record<string, string[]>) => void;
  selectedAttributeValueIds: Record<string, string[]>;
}

export function ValueSelectionModal({
  openValueModal,
  variant,
  attribute,
  onClose,
  onVariantUpdate,
  onAttributeValueIdsUpdate,
  selectedAttributeValueIds,
}: ValueSelectionModalProps) {
  const { t } = useTranslation();

  if (!openValueModal || !variant || !attribute) return null;

  const isColor = attribute.key === 'color';
  const selectedValueIds = variant.selectedValueIds.filter((id) => {
    return attribute.values.some((v) => v.id === id);
  });

  const handleSelectAll = (checked: boolean) => {
    const isAutoVariant = variant.id === 'variant-all';

    if (checked) {
      const allValueIds = attribute.values.map((v) => v.id);
      const currentIds = variant.selectedValueIds;
      const newIds = [...new Set([...currentIds, ...allValueIds])];

      onVariantUpdate((prev) => prev.map((v) => (v.id === variant.id ? { ...v, selectedValueIds: newIds } : v)));

      if (isAutoVariant) {
        onAttributeValueIdsUpdate((prev) => ({
          ...prev,
          [openValueModal.attributeId]: allValueIds,
        }));
      }
    } else {
      const valueIdsToRemove = attribute.values.map((v) => v.id);
      const newIds = variant.selectedValueIds.filter((id) => !valueIdsToRemove.includes(id));

      onVariantUpdate((prev) => prev.map((v) => (v.id === variant.id ? { ...v, selectedValueIds: newIds } : v)));

      if (isAutoVariant) {
        onAttributeValueIdsUpdate((prev) => ({
          ...prev,
          [openValueModal.attributeId]: [],
        }));
      }
    }
  };

  const handleValueToggle = (valueId: string, checked: boolean) => {
    const isAutoVariant = variant.id === 'variant-all';
    const currentIds = variant.selectedValueIds;
    let newIds: string[];

    if (checked) {
      newIds = [...currentIds, valueId];
    } else {
      newIds = currentIds.filter((id) => id !== valueId);
    }

    onVariantUpdate((prev) => {
      const updated = prev.map((v) => (v.id === variant.id ? { ...v, selectedValueIds: newIds } : v));
      logger.debug('✅ [VARIANT BUILDER] Value selection updated:', {
        variantId: variant.id,
        isAutoVariant,
        valueId,
        action: checked ? 'added' : 'removed',
        newSelectedIds: newIds.length,
        totalVariants: updated.length,
      });
      return updated;
    });

    if (isAutoVariant) {
      const currentAttrIds = selectedAttributeValueIds[openValueModal.attributeId] || [];
      let newAttrIds: string[];
      if (checked) {
        newAttrIds = [...currentAttrIds, valueId];
      } else {
        newAttrIds = currentAttrIds.filter((id) => id !== valueId);
      }

      onAttributeValueIdsUpdate((prev) => ({
        ...prev,
        [openValueModal.attributeId]: newAttrIds,
      }));
    }
  };

  const footer = (
    <AdminSideSheetFooter>
      <AdminSideSheetCancelButton type="button" onClick={onClose}>
        {t('admin.common.close')}
      </AdminSideSheetCancelButton>
    </AdminSideSheetFooter>
  );

  return (
    <AdminSideSheet
      isOpen
      title={`${t('admin.products.add.selectValues')} ${attribute.name}`}
      closeLabel={t('admin.common.close')}
      onClose={onClose}
      footer={footer}
    >
      <label className="mb-3 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-2 hover:bg-gray-50">
        <input
          type="checkbox"
          checked={attribute.values.length > 0 && selectedValueIds.length === attribute.values.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-900">All</span>
      </label>

      <div className="my-3 border-t border-gray-200" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {attribute.values.map((value) => {
          const isSelected = variant.selectedValueIds.includes(value.id);
          const valueColorHex =
            isColor && value.colors && value.colors.length > 0
              ? value.colors[0]
              : isColor
                ? getColorHex(value.label)
                : null;

          return (
            <label
              key={value.id}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-transparent bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleValueToggle(value.id, e.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {isColor && value.imageUrl ? (
                <img
                  src={value.imageUrl}
                  alt={value.label}
                  className="h-8 w-8 shrink-0 rounded border border-gray-300 object-cover"
                />
              ) : isColor && valueColorHex ? (
                <span
                  className="inline-block h-6 w-6 shrink-0 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: valueColorHex }}
                />
              ) : null}
              <span className="text-center text-xs font-medium text-gray-900">{value.label}</span>
            </label>
          );
        })}
      </div>
    </AdminSideSheet>
  );
}
