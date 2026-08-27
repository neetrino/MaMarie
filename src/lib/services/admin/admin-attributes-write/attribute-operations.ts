import { db, Prisma } from '@white-shop/db';
import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  isProductContentLocale,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import {
  resolveAttributeKeyFromNames,
  type AttributeLocaleTextMap,
} from '@/lib/admin/attribute-locale-helpers';
import { invalidateAdminAttributesCache } from '@/lib/cache/admin-reference-cache';
import { logger } from '../../../utils/logger';
import { formatAttribute } from './utils';

type NameTranslationInput = { locale: string; name: string };

function namesMapFromRows(
  rows: Array<{ locale: ProductContentLocale; name: string }>,
): AttributeLocaleTextMap {
  const map: AttributeLocaleTextMap = { en: '', hy: '', ru: '' };
  for (const row of rows) {
    map[row.locale] = row.name;
  }
  return map;
}

function normalizeNameTranslations(data: {
  name?: string;
  locale?: string;
  translations?: NameTranslationInput[];
}): Array<{ locale: ProductContentLocale; name: string }> {
  if (Array.isArray(data.translations) && data.translations.length > 0) {
    const rows: Array<{ locale: ProductContentLocale; name: string }> = [];
    for (const row of data.translations) {
      if (!isProductContentLocale(row.locale) || !row.name?.trim()) {
        continue;
      }
      rows.push({ locale: row.locale, name: row.name.trim() });
    }
    return rows;
  }

  if (data.name?.trim()) {
    const rawLocale = data.locale || '';
    const locale: ProductContentLocale = isProductContentLocale(rawLocale)
      ? rawLocale
      : PRIMARY_PRODUCT_CONTENT_LOCALE;
    return [{ locale, name: data.name.trim() }];
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
 * Create attribute with one or more locale names.
 */
export async function createAttribute(data: {
  name?: string;
  key?: string;
  type?: string;
  filterable?: boolean;
  locale?: string;
  translations?: NameTranslationInput[];
}) {
  const nameRows = normalizeNameTranslations(data);
  if (nameRows.length === 0) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one attribute name translation is required',
    };
  }

  const key = (data.key?.trim() || resolveAttributeKeyFromNames(namesMapFromRows(nameRows))).trim();

  if (!key) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Attribute key could not be generated from the provided name',
    };
  }

  logger.info('Creating attribute', { key, locales: nameRows.map((row) => row.locale) });

  const existing = await db.attribute.findUnique({ where: { key } });
  if (existing) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Attribute already exists',
      detail: `Attribute with key '${key}' already exists`,
    };
  }

  try {
    const attribute = await db.attribute.create({
      data: {
        key,
        type: data.type || 'select',
        filterable: data.filterable !== false,
        translations: {
          create: nameRows,
        },
      },
      include: {
        translations: true,
        values: {
          include: {
            translations: true,
          },
        },
      },
    });

    invalidateAdminAttributesCache();
    return formatAttribute(attribute);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw {
        status: 409,
        type: 'https://api.shop.am/problems/conflict',
        title: 'Attribute already exists',
        detail: `Attribute with key '${key}' already exists`,
      };
    }
    throw error;
  }
}

/**
 * Update attribute name translations (single locale or batch).
 */
export async function updateAttributeTranslation(
  attributeId: string,
  data: {
    name?: string;
    locale?: string;
    translations?: NameTranslationInput[];
  },
) {
  const nameRows = normalizeNameTranslations(data);
  if (nameRows.length === 0) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one attribute name translation is required',
    };
  }

  logger.info('Updating attribute translations', {
    attributeId,
    locales: nameRows.map((row) => row.locale),
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

  await db.$transaction(
    nameRows.map((row) =>
      db.attributeTranslation.upsert({
        where: {
          attributeId_locale: {
            attributeId,
            locale: row.locale,
          },
        },
        update: { name: row.name },
        create: {
          attributeId,
          locale: row.locale,
          name: row.name,
        },
      }),
    ),
  );

  invalidateAdminAttributesCache();
  return loadFormattedAttribute(attributeId);
}
