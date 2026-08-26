import {
  isProductContentLocale,
  pickProductContentTranslation,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  type ProductContentLocale,
} from '@/constants/product-content-locales';

export interface ProductTranslationInput {
  locale: ProductContentLocale;
  title: string;
  slug: string;
  subtitle?: string;
  descriptionHtml?: string;
}

interface TranslationLike {
  locale?: unknown;
  title?: unknown;
  slug?: unknown;
  subtitle?: unknown;
  descriptionHtml?: unknown;
}

function asOptionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseTranslationRow(row: TranslationLike): ProductTranslationInput | null {
  if (typeof row.locale !== 'string' || !isProductContentLocale(row.locale)) {
    return null;
  }
  if (typeof row.title !== 'string' || row.title.trim().length === 0) {
    return null;
  }
  return {
    locale: row.locale,
    title: row.title.trim(),
    slug: typeof row.slug === 'string' ? row.slug.trim() : '',
    subtitle: asOptionalText(row.subtitle),
    descriptionHtml: asOptionalText(row.descriptionHtml),
  };
}

export function pickPrimaryTranslation(
  translations: ProductTranslationInput[],
): ProductTranslationInput {
  return pickProductContentTranslation(translations, PRIMARY_PRODUCT_CONTENT_LOCALE) ?? translations[0];
}

function applySharedSlug(
  translations: ProductTranslationInput[],
  sharedSlug: string,
): ProductTranslationInput[] {
  return translations.map((row) => ({ ...row, slug: sharedSlug }));
}

export function normalizeProductTranslationInputs(data: {
  translations?: unknown;
  title?: unknown;
  slug?: unknown;
  locale?: unknown;
  subtitle?: unknown;
  descriptionHtml?: unknown;
}): ProductTranslationInput[] {
  if (Array.isArray(data.translations) && data.translations.length > 0) {
    const parsed = data.translations
      .map((row) => (row && typeof row === 'object' ? parseTranslationRow(row as TranslationLike) : null))
      .filter((row): row is ProductTranslationInput => row !== null);

    const byLocale = new Map<ProductContentLocale, ProductTranslationInput>();
    for (const row of parsed) {
      byLocale.set(row.locale, row);
    }
    const uniqueRows = Array.from(byLocale.values());
    const sharedSlug =
      (typeof data.slug === 'string' && data.slug.trim()) ||
      uniqueRows.find((row) => row.slug)?.slug ||
      '';
    if (!sharedSlug) {
      return [];
    }
    return applySharedSlug(uniqueRows, sharedSlug);
  }

  if (typeof data.title !== 'string' || typeof data.slug !== 'string') {
    return [];
  }

  const locale =
    typeof data.locale === 'string' && isProductContentLocale(data.locale)
      ? data.locale
      : PRIMARY_PRODUCT_CONTENT_LOCALE;

  const single = parseTranslationRow({
    locale,
    title: data.title,
    slug: data.slug,
    subtitle: data.subtitle,
    descriptionHtml: data.descriptionHtml,
  });

  return single ? [single] : [];
}
