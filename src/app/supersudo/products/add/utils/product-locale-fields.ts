import {
  PRODUCT_CONTENT_LOCALES,
  pickProductContentTranslation,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import { generateSlug } from './productUtils';

export interface ProductLocaleFields {
  title: string;
  descriptionHtml: string;
}

export type ProductTranslationsByLocale = Record<ProductContentLocale, ProductLocaleFields>;

export function createEmptyLocaleFields(): ProductLocaleFields {
  return { title: '', descriptionHtml: '' };
}

export function createEmptyTranslationsByLocale(): ProductTranslationsByLocale {
  return {
    en: createEmptyLocaleFields(),
    hy: createEmptyLocaleFields(),
    ru: createEmptyLocaleFields(),
  };
}

export function pickPrimaryFormFields(
  translations: ProductTranslationsByLocale,
): ProductLocaleFields {
  const rows = PRODUCT_CONTENT_LOCALES.map((locale) => ({
    locale,
    ...translations[locale],
  }));
  const picked = pickProductContentTranslation(rows, PRIMARY_PRODUCT_CONTENT_LOCALE);
  return picked ?? translations.hy;
}

export function resolveSharedSlug(currentSlug: string, title: string): string {
  if (currentSlug.trim()) {
    return currentSlug;
  }
  return generateSlug(title);
}

export function translationsPayloadFromForm(
  translations: ProductTranslationsByLocale,
  sharedSlug: string,
) {
  const slug = sharedSlug.trim();

  return PRODUCT_CONTENT_LOCALES.flatMap((locale) => {
    const fields = translations[locale];
    const title = fields.title.trim();
    if (!title) {
      return [];
    }

    return [
      {
        locale,
        title,
        slug,
        descriptionHtml: fields.descriptionHtml.trim(),
      },
    ];
  });
}
