'use client';

import { useMemo, useState } from 'react';
import { Input } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';
import { PRIMARY_PRODUCT_CONTENT_LOCALE } from '@/constants/product-content-locales';
import { localizeAttributesForDisplay } from '@/lib/admin/reference-locale-display';
import { useAttributes } from './useAttributes';
import { ValueEditForm } from './ValueEditForm';
import { AttributeLocaleSwitcher } from './AttributeLocaleSwitcher';

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
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('admin.attributes.createNewAttribute')}
          </h2>
          <form onSubmit={handleCreateAttribute} className="space-y-4">
            <AttributeLocaleSwitcher value={contentLocale} onChange={setContentLocale} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.attributes.name')}{' '}
                <span className="text-red-500">{t('admin.attributes.required')}</span>
                {contentLocale === PRIMARY_PRODUCT_CONTENT_LOCALE ? (
                  <span className="ml-1 text-xs text-gray-500">
                    ({t('admin.attributes.primaryLocaleRequired')})
                  </span>
                ) : null}
              </label>
              <input
                type="text"
                value={formNames[contentLocale]}
                onChange={(e) => updateFormName(contentLocale, e.target.value)}
                placeholder={t('admin.attributes.namePlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500">{t('admin.attributes.keyAutoGenerated')}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isCreatingAttribute}
                className="rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingAttribute
                  ? t('admin.attributes.creating')
                  : t('admin.attributes.createAttribute')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetFormNames();
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                {t('admin.attributes.cancel')}
              </button>
            </div>
          </form>
        </div>
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
          {displayAttributes.map((attribute) => {
            const isExpanded = expandedAttributes.has(attribute.id);
            return (
              <div
                key={attribute.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50">
                  <div className="flex flex-1 items-center gap-4">
                    <button
                      onClick={() => toggleExpand(attribute.id)}
                      className="text-gray-400 transition-colors hover:text-gray-600"
                    >
                      <svg
                        className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="flex-1">
                      {editingAttribute === attribute.id ? (
                        <div className="space-y-3">
                          <AttributeLocaleSwitcher
                            value={contentLocale}
                            onChange={setContentLocale}
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={editingAttributeNames[contentLocale]}
                              onChange={(e) =>
                                updateEditingAttributeName(contentLocale, e.target.value)
                              }
                              className="rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:border-transparent focus:ring-2 focus:ring-gray-900"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateAttributeName(attribute.id)}
                              disabled={savingAttribute}
                              className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingAttribute
                                ? t('admin.attributes.saving')
                                : t('admin.attributes.save')}
                            </button>
                            <button
                              onClick={() => toggleAttributeEdit(attribute)}
                              disabled={savingAttribute}
                              className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
                            >
                              {t('admin.attributes.cancel')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{attribute.name}</h3>
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              {attribute.key}
                            </span>
                            {attribute.filterable ? (
                              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                {t('admin.attributes.filterable')}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {attribute.values.length === 1
                              ? t('admin.attributes.values').replace(
                                  '{count}',
                                  attribute.values.length.toString(),
                                )
                              : t('admin.attributes.valuesPlural').replace(
                                  '{count}',
                                  attribute.values.length.toString(),
                                )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {editingAttribute !== attribute.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAttributeEdit(attribute)}
                        className="rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        title={t('admin.attributes.editAttribute')}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(attribute.id, attribute.name)}
                        className="rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                        title={t('admin.attributes.deleteAttribute')}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : null}
                </div>

                {isExpanded ? (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="mb-4 space-y-3">
                      <AttributeLocaleSwitcher value={contentLocale} onChange={setContentLocale} />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newValueLabels[contentLocale]}
                            onChange={(e) => updateNewValueLabel(contentLocale, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newValueLabels[contentLocale].trim()) {
                                handleAddValue(attribute.id);
                              }
                            }}
                            placeholder={t('admin.attributes.addNewValue')}
                            className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 ${
                              valueError
                                ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-gray-900'
                            }`}
                          />
                          {valueError ? (
                            <p className="mt-1 text-sm text-red-600">{valueError}</p>
                          ) : null}
                        </div>
                        <button
                          onClick={() => handleAddValue(attribute.id)}
                          disabled={addingValueTo === attribute.id}
                          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {addingValueTo === attribute.id
                            ? t('admin.attributes.adding')
                            : t('admin.attributes.add')}
                        </button>
                      </div>
                    </div>

                    {attribute.values.length === 0 ? (
                      <p className="py-4 text-center text-sm text-gray-500">
                        {t('admin.attributes.noValuesYet')}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {attribute.values.map((value) => {
                          const isValueExpanded = expandedValueId === value.id;
                          return (
                            <div
                              key={value.id}
                              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                            >
                              <div className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50">
                                <div className="flex flex-1 items-center gap-2">
                                  {value.colors && value.colors.length > 0 ? (
                                    <span
                                      className="inline-block h-5 w-5 flex-shrink-0 rounded-full border border-gray-300"
                                      style={{ backgroundColor: value.colors[0] }}
                                      title={value.colors[0]}
                                    />
                                  ) : value.imageUrl ? (
                                    <img
                                      src={value.imageUrl}
                                      alt={value.label}
                                      className="h-5 w-5 flex-shrink-0 rounded border border-gray-300 object-cover"
                                    />
                                  ) : null}
                                  <span className="text-sm font-medium text-gray-900">
                                    {value.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleValueEdit(attribute.id, value)}
                                    className="text-gray-600 transition-colors hover:text-gray-900"
                                    title={t('admin.attributes.configureValue')}
                                  >
                                    <svg
                                      className={`h-4 w-4 transition-transform ${isValueExpanded ? 'rotate-90' : ''}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteValue(attribute.id, value.id, value.label)
                                    }
                                    disabled={deletingValue === value.id}
                                    className="text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                                    title={t('admin.attributes.deleteValue')}
                                  >
                                    {deletingValue === value.id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                    ) : (
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {isValueExpanded ? (
                                <ValueEditForm
                                  attributeKey={attribute.key}
                                  contentLocale={contentLocale}
                                  editingLabels={editingLabels}
                                  editingColors={editingColors}
                                  editingImageUrl={editingImageUrl}
                                  savingValue={savingValue}
                                  imageUploading={imageUploading}
                                  fileInputRef={fileInputRef}
                                  onContentLocaleChange={setContentLocale}
                                  onLabelChange={updateEditingLabel}
                                  onColorsChange={setEditingColors}
                                  onImageUpload={handleImageUpload}
                                  onRemoveImage={handleRemoveImage}
                                  onSave={handleSaveInlineValue}
                                  onCancel={() => toggleValueEdit(attribute.id, value)}
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
