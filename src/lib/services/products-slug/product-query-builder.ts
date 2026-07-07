import { db } from "@white-shop/db";
import { logger } from "../../utils/logger";
import { fetchProductBySlugBatched } from "./product-slug-batcher";
import { resolvePublishedProductIdBySlug } from "./resolve-published-product-slug";
import type { ProductWithFullRelations } from "./types";

export { resolvePublishedProductIdBySlug };

/**
 * Published product lookup by URL slug (any locale).
 * `lang` is kept for call-site clarity; translation locale is applied in transform layers.
 */
export function getBaseWhere(slug: string, _lang: string) {
  return {
    translations: {
      some: {
        slug,
      },
    },
    published: true,
    deletedAt: null,
  };
}

/**
 * Build and execute batched product query by slug.
 */
export async function buildProductQuery(
  slug: string,
  lang: string = "en",
): Promise<ProductWithFullRelations | null> {
  const product = await fetchProductBySlugBatched(slug, lang);

  if (!product) {
    await logProductNotFoundDiagnostics(slug, lang);
    return null;
  }

  return product;
}

/**
 * Log diagnostic information when product is not found
 */
async function logProductNotFoundDiagnostics(slug: string, lang: string): Promise<void> {
  try {
    const productAnyLang = await db.product.findFirst({
      where: {
        translations: {
          some: {
            slug,
          },
        },
      },
      include: {
        translations: {
          select: {
            locale: true,
            slug: true,
          },
        },
      },
    });

    if (productAnyLang) {
      const availableLangs = productAnyLang.translations
        .map((t: { locale: string; slug: string }) => t.locale)
        .join(", ");
      logger.warn("Product found with slug but not in requested language", {
        slug,
        requestedLang: lang,
        availableLangs,
        published: productAnyLang.published,
        deletedAt: productAnyLang.deletedAt,
      });
      return;
    }

    const productUnpublished = await db.product.findFirst({
      where: {
        translations: {
          some: {
            slug,
            locale: lang,
          },
        },
      },
      select: {
        id: true,
        published: true,
        deletedAt: true,
      },
    });

    if (productUnpublished) {
      logger.warn("Product found but not available", {
        slug,
        lang,
        published: productUnpublished.published,
        deletedAt: productUnpublished.deletedAt,
      });
      return;
    }

    logger.debug("Product not found in database", { slug, lang });
  } catch (error) {
    logger.error("Error during product diagnostics", {
      error: error instanceof Error ? error.message : String(error),
      slug,
      lang,
    });
  }
}
