import { db } from '@white-shop/db';
import { PRIMARY_PRODUCT_CONTENT_LOCALE } from '@/constants/product-content-locales';
import {
  resolveDisplayLabel,
  resolveDisplayName,
} from '@/lib/admin/attribute-locale-helpers';
import { logger } from '@/lib/utils/logger';
import { withAdminAttributesCache } from '@/lib/cache/admin-reference-cache';
import { parseColors } from './admin-attributes-write/utils';

type AttributeValueRow = {
  id: string;
  value: string;
  colors?: unknown;
  imageUrl?: string | null;
  translations?: Array<{ locale: string; label: string }>;
};

function mapAttributeValue(value: AttributeValueRow) {
  const valueTranslations = Array.isArray(value.translations) ? value.translations : [];

  return {
    id: value.id,
    value: value.value,
    label: resolveDisplayLabel(valueTranslations, value.value),
    colors: parseColors(value.colors),
    imageUrl: value.imageUrl || null,
    translations: valueTranslations,
  };
}

class AdminAttributesReadService {
  /** Get attributes (columns managed via Prisma migrations). */
  async getAttributes() {
    return withAdminAttributesCache(async () => this.fetchAttributes());
  }

  private async fetchAttributes() {
    const attributes = await db.attribute.findMany({
      include: {
        translations: true,
        values: {
          include: {
            translations: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    logger.debug('[ADMIN ATTRIBUTES READ] Loaded attributes with all locales', {
      count: attributes.length,
      primaryLocale: PRIMARY_PRODUCT_CONTENT_LOCALE,
    });

    return {
      data: attributes.map((attribute) => {
        const translations = Array.isArray(attribute.translations)
          ? attribute.translations
          : [];
        const values = Array.isArray(attribute.values) ? attribute.values : [];

        return {
          id: attribute.id,
          key: attribute.key,
          name: resolveDisplayName(translations, attribute.key),
          type: attribute.type,
          filterable: attribute.filterable,
          translations,
          values: values.map((value) => mapAttributeValue(value)),
        };
      }),
    };
  }
}

export const adminAttributesReadService = new AdminAttributesReadService();
