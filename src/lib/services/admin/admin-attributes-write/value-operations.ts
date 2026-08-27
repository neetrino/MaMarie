import { db } from '@white-shop/db';
import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  isProductContentLocale,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import { slugifyAttributeValue } from '@/lib/admin/attribute-locale-helpers';
import { invalidateAdminAttributesCache } from '@/lib/cache/admin-reference-cache';
import { logger } from '../../../utils/logger';
import { ensureColorsColumnsExist } from './migration';
import { formatAttribute } from './utils';

type LabelTranslationInput = { locale: string; label: string };

function normalizeLabelTranslations(data: {
  label?: string;
  locale?: string;
  translations?: LabelTranslationInput[];
}): Array<{ locale: ProductContentLocale; label: string }> {
  if (Array.isArray(data.translations) && data.translations.length > 0) {
    const rows: Array<{ locale: ProductContentLocale; label: string }> = [];
    for (const row of data.translations) {
      if (!isProductContentLocale(row.locale) || !row.label?.trim()) {
        continue;
      }
      rows.push({ locale: row.locale, label: row.label.trim() });
    }
    return rows;
  }

  if (data.label?.trim()) {
    const rawLocale = data.locale || '';
    const locale: ProductContentLocale = isProductContentLocale(rawLocale)
      ? rawLocale
      : PRIMARY_PRODUCT_CONTENT_LOCALE;
    return [{ locale, label: data.label.trim() }];
  }

  return [];
}

async function loadFormattedAttribute(attributeId: string) {
  const updatedAttribute = await db.attribute.findUnique({
    where: { id: attributeId },
    include: {
      translations: true,
      values: {
        include: {
          translations: true,
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!updatedAttribute) {
    throw {
      status: 500,
      type: 'https://api.shop.am/problems/internal-error',
      title: 'Internal Server Error',
      detail: 'Failed to retrieve updated attribute',
    };
  }

  return formatAttribute(updatedAttribute);
}

/**
 * Add attribute value with one or more locale labels.
 */
export async function addAttributeValue(
  attributeId: string,
  data: {
    label?: string;
    locale?: string;
    translations?: LabelTranslationInput[];
  },
) {
  const labelRows = normalizeLabelTranslations(data);
  if (labelRows.length === 0) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one value label translation is required',
    };
  }

  logger.info('Adding attribute value', {
    attributeId,
    locales: labelRows.map((row) => row.locale),
  });

  const attribute = await db.attribute.findUnique({ where: { id: attributeId } });
  if (!attribute) {
    throw {
      status: 404,
      type: 'https://api.shop.am/problems/not-found',
      title: 'Attribute not found',
      detail: `Attribute with id '${attributeId}' does not exist`,
    };
  }

  const primaryLabel =
    labelRows.find((row) => row.locale === PRIMARY_PRODUCT_CONTENT_LOCALE)?.label ||
    labelRows[0].label;
  const value = slugifyAttributeValue(primaryLabel);

  const existing = await db.attributeValue.findFirst({
    where: { attributeId, value },
  });

  if (existing) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Value already exists',
      detail: `Value '${primaryLabel}' already exists for this attribute`,
    };
  }

  await db.attributeValue.create({
    data: {
      attributeId,
      value,
      translations: {
        create: labelRows,
      },
    },
  });

  invalidateAdminAttributesCache();
  return loadFormattedAttribute(attributeId);
}

/**
 * Update attribute value (labels, colors, image).
 */
export async function updateAttributeValue(
  attributeId: string,
  valueId: string,
  data: {
    label?: string;
    colors?: string[];
    imageUrl?: string | null;
    locale?: string;
    translations?: LabelTranslationInput[];
  },
) {
  logger.info('Updating attribute value', { attributeId, valueId });

  try {
    await ensureColorsColumnsExist();
  } catch (migrationError: unknown) {
    const errorMessage =
      migrationError instanceof Error ? migrationError.message : String(migrationError);
    logger.warn('Migration check failed', { error: errorMessage });
  }

  const attributeValue = await db.attributeValue.findUnique({
    where: { id: valueId },
    include: {
      attribute: true,
      translations: true,
    },
  });

  if (!attributeValue) {
    throw {
      status: 404,
      type: 'https://api.shop.am/problems/not-found',
      title: 'Attribute value not found',
      detail: `Attribute value with id '${valueId}' does not exist`,
    };
  }

  if (attributeValue.attributeId !== attributeId) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Attribute value does not belong to the specified attribute',
    };
  }

  const labelRows = normalizeLabelTranslations(data);
  const updateData: {
    colors?: string[];
    imageUrl?: string | null;
  } = {};

  if (data.colors !== undefined) {
    updateData.colors = Array.isArray(data.colors) ? data.colors : [];
  }

  if (data.imageUrl !== undefined) {
    updateData.imageUrl = data.imageUrl || null;
  }

  if (labelRows.length > 0) {
    await db.$transaction(
      labelRows.map((row) => {
        const existing = attributeValue.translations.find((t) => t.locale === row.locale);
        if (existing) {
          return db.attributeValueTranslation.update({
            where: { id: existing.id },
            data: { label: row.label },
          });
        }
        return db.attributeValueTranslation.create({
          data: {
            attributeValueId: valueId,
            locale: row.locale,
            label: row.label,
          },
        });
      }),
    );
  }

  if (Object.keys(updateData).length > 0) {
    await db.attributeValue.update({
      where: { id: valueId },
      data: updateData,
    });
  }

  invalidateAdminAttributesCache();
  return loadFormattedAttribute(attributeId);
}
