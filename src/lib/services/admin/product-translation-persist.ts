import type { Prisma } from '@white-shop/db';
import { ensureUniqueProductSlug } from './product-slug-utils';
import type { ProductTranslationInput } from './product-translation-input';

export async function buildUniqueTranslationCreates(
  tx: Prisma.TransactionClient,
  translations: ProductTranslationInput[],
  excludeProductId?: string,
): Promise<
  Array<{
    locale: string;
    title: string;
    slug: string;
    subtitle?: string;
    descriptionHtml?: string;
  }>
> {
  if (translations.length === 0) {
    return [];
  }

  const sharedSlug = await ensureUniqueProductSlug({
    tx,
    slug: translations[0].slug,
    excludeProductId,
  });

  return translations.map((translation) => ({
    locale: translation.locale,
    title: translation.title,
    slug: sharedSlug,
    subtitle: translation.subtitle,
    descriptionHtml: translation.descriptionHtml,
  }));
}
