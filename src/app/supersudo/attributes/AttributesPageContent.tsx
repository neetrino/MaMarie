'use client';

import { useMemo, useState } from 'react';
import { Input } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';
import { localizeAttributesForDisplay } from '@/lib/admin/reference-locale-display';
import { useAttributes } from './useAttributes';
import { AttributeLocaleSwitcher } from './AttributeLocaleSwitcher';
import { CreateAttributeForm } from './CreateAttributeForm';
import { AttributeCard } from './AttributeCard';

export function AttributesPageContent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const {
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
    handleRemoveImage,
    handleSaveInlineValue,
    toggleExpand,
  } = useAttributes();

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredAttributes = useMemo(() => {
    if (!normalizedSearch) return attributes;

    return attributes.filter((attribute) => {
      const nameHit =
        attribute.name.toLowerCase().includes(normalizedSearch) ||
        attribute.key.toLowerCase().includes(normalizedSearch) ||
        (attribute.translations || []).some((row) =>
          row.name.toLowerCase().includes(normalizedSearch),
        );
      if (nameHit) return true;

      return attribute.values.some(
        (value) =>
          value.label.toLowerCase().includes(normalizedSearch) ||
          (value.translations || []).some((row) =>
            row.label.toLowerCase().includes(normalizedSearch),
          ),
      );
    });
  }, [attributes, normalizedSearch]);

  const displayAttributes = useMemo(
    () => localizeAttributesForDisplay(filteredAttributes, contentLocale),
    [filteredAttributes, contentLocale],
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.attributes.loadingAttributes')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-gray-600">{t('admin.attributes.subtitle')}</p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showAddForm ? t('admin.attributes.cancel') : t('admin.attributes.addAttribute')}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('admin.attributes.namePlaceholder')}
          className="max-w-md"
        />
        <AttributeLocaleSwitcher value={contentLocale} onChange={setContentLocale} />
      </div>

      {showAddForm ? (
        <CreateAttributeForm
          contentLocale={contentLocale}
          formNames={formNames}
          isCreatingAttribute={isCreatingAttribute}
          onContentLocaleChange={setContentLocale}
          onFormNameChange={updateFormName}
          onSubmit={handleCreateAttribute}
          onCancel={() => {
            setShowAddForm(false);
            resetFormNames();
          }}
        />
      ) : null}

      {displayAttributes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {t('admin.attributes.noAttributes')}
          </h3>
          <p className="mb-4 text-gray-600">{t('admin.attributes.getStarted')}</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            {t('admin.attributes.createAttribute')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayAttributes.map((attribute) => (
            <AttributeCard
              key={attribute.id}
              attribute={attribute}
              isExpanded={expandedAttributes.has(attribute.id)}
              contentLocale={contentLocale}
              editingAttribute={editingAttribute}
              editingAttributeNames={editingAttributeNames}
              savingAttribute={savingAttribute}
              newValueLabels={newValueLabels}
              addingValueTo={addingValueTo}
              deletingValue={deletingValue}
              valueError={valueError}
              expandedValueId={expandedValueId}
              editingLabels={editingLabels}
              editingColors={editingColors}
              editingImageUrl={editingImageUrl}
              savingValue={savingValue}
              imageUploading={imageUploading}
              fileInputRef={fileInputRef}
              onToggleExpand={toggleExpand}
              onContentLocaleChange={setContentLocale}
              onEditingAttributeNameChange={updateEditingAttributeName}
              onUpdateAttributeName={handleUpdateAttributeName}
              onToggleAttributeEdit={toggleAttributeEdit}
              onDeleteAttribute={handleDeleteAttribute}
              onNewValueLabelChange={updateNewValueLabel}
              onAddValue={handleAddValue}
              onDeleteValue={handleDeleteValue}
              onToggleValueEdit={toggleValueEdit}
              onEditingColorsChange={setEditingColors}
              onEditingLabelChange={updateEditingLabel}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              onSaveInlineValue={handleSaveInlineValue}
            />
          ))}
        </div>
      )}
    </>
  );
}
