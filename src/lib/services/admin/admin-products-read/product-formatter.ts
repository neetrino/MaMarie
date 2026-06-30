import { processImageUrl, smartSplitUrls } from "../../../utils/image-utils";

function categoryTitleFromTranslations(
  translations: Array<{ title: string }> | undefined
): string {
  return Array.isArray(translations) && translations.length > 0 ? translations[0].title : "";
}

/**
 * Comma-separated category titles; primary category first when set.
 */
function formatCategorySummary(product: {
  primaryCategoryId: string | null;
  categories?: Array<{
    id: string;
    translations?: Array<{ title: string }>;
  }>;
}): string {
  const cats = product.categories ?? [];
  if (cats.length === 0) {
    return "";
  }
  const primaryId = product.primaryCategoryId;
  const ordered = [...cats].sort((a, b) => {
    if (primaryId) {
      if (a.id === primaryId && b.id !== primaryId) return -1;
      if (b.id === primaryId && a.id !== primaryId) return 1;
    }
    return categoryTitleFromTranslations(a.translations).localeCompare(
      categoryTitleFromTranslations(b.translations),
      undefined,
      { sensitivity: "base" }
    );
  });
  return ordered
    .map((c) => categoryTitleFromTranslations(c.translations))
    .filter(Boolean)
    .join(", ");
}

/**
 * Format product for list response
 */
export function formatProductForList(product: {
  id: string;
  published: boolean;
  featured: boolean | null;
  discountPercent: number | null;
  createdAt: Date;
  primaryCategoryId: string | null;
  translations?: Array<{
    slug: string;
    title: string;
  }>;
  variants?: Array<{
    price: number;
    stock: number;
    compareAtPrice: number | null;
    imageUrl?: string | null;
  }>;
  media?: unknown[];
  categories?: Array<{
    id: string;
    translations?: Array<{ title: string }>;
  }>;
}) {
  // Безопасное получение translation с проверкой на существование массива
  const translation = Array.isArray(product.translations) && product.translations.length > 0
    ? product.translations[0]
    : null;
  
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const variant =
    variants.length > 0
      ? variants.reduce((cheapest, current) =>
          current.price < cheapest.price ? current : cheapest
        )
      : null;

  const image =
    extractImageFromMedia(product.media) ?? extractImageFromVariants(variants);

  return {
    id: product.id,
    slug: translation?.slug || "",
    title: translation?.title || "",
    published: product.published,
    featured: product.featured || false,
    price: variant?.price || 0,
    stock: variant?.stock || 0,
    discountPercent: product.discountPercent || 0,
    compareAtPrice: variant?.compareAtPrice || null,
    colorStocks: [], // Can be enhanced later
    image,
    createdAt: product.createdAt.toISOString(),
    categorySummary: formatCategorySummary(product),
  };
}

/**
 * Extract image from media array
 */
function extractImageFromMedia(media: unknown[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const firstMedia = media[0];
  
  if (typeof firstMedia === "string") {
    return firstMedia;
  }
  
  if (firstMedia && typeof firstMedia === "object" && "url" in firstMedia) {
    const mediaObj = firstMedia as { url?: string };
    return mediaObj.url || null;
  }

  return null;
}

/**
 * Fallback: variable products often store images only on variants.
 */
function extractImageFromVariants(
  variants: Array<{ imageUrl?: string | null }>
): string | null {
  for (const variant of variants) {
    if (!variant.imageUrl?.trim()) {
      continue;
    }
    const urls = smartSplitUrls(variant.imageUrl);
    for (const url of urls) {
      const processed = processImageUrl(url);
      if (processed) {
        return processed;
      }
    }
  }
  return null;
}

