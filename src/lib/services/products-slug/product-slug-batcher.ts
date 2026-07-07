import { db } from "@white-shop/db";
import { logger } from "../../utils/logger";
import { pdpTranslationLocaleFilter } from "./pdp-translation-locales";
import { measurePdpStep } from "./pdp-timing";
import { resolvePublishedProductIdBySlug } from "./resolve-published-product-slug";
import { hydrateVariantImageUrls } from "./variant-image-refs";
import type { ProductWithFullRelations } from "./types";

type PdpVariantCore = {
  id: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  published: boolean;
  imageUrl?: string | null;
};

function isProductAttributesError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  return code === "P2021" || message.includes("product_attributes") || message.includes("does not exist");
}

function isAttributeValuesColorsError(error: unknown): boolean {
  const errorObj = error as { code?: string; message?: string };
  const message = error instanceof Error ? error.message : String(error);
  return (
    errorObj?.code === "P2022" ||
    message.includes("attribute_values.colors") ||
    message.includes("does not exist")
  );
}

async function fetchProductTranslations(productId: string, lang: string) {
  const localeFilter = pdpTranslationLocaleFilter(lang);
  const rows = await db.productTranslation.findMany({
    where: { productId, locale: localeFilter },
  });

  if (rows.length > 0) {
    return rows;
  }

  return db.productTranslation.findMany({ where: { productId } });
}

async function fetchProductAttributes(productId: string, lang: string): Promise<unknown[]> {
  const localeFilter = pdpTranslationLocaleFilter(lang);

  try {
    return await db.productAttribute.findMany({
      where: { productId },
      include: {
        attribute: {
          include: {
            translations: { where: { locale: localeFilter } },
            values: {
              select: {
                id: true,
                value: true,
                colors: true,
                translations: { where: { locale: localeFilter } },
              },
            },
          },
        },
      },
    });
  } catch (error: unknown) {
    if (isProductAttributesError(error)) {
      logger.warn("product_attributes unavailable for PDP batch", { productId });
      return [];
    }
    throw error;
  }
}

async function fetchOptionsByVariantId(
  variantIds: string[],
  lang: string,
): Promise<Map<string, ProductWithFullRelations["variants"][number]["options"]>> {
  const grouped = new Map<string, ProductWithFullRelations["variants"][number]["options"]>();
  if (variantIds.length === 0) {
    return grouped;
  }

  const localeFilter = pdpTranslationLocaleFilter(lang);

  const attach = (
    options: Array<{ variantId: string } & Record<string, unknown>>,
  ) => {
    for (const option of options) {
      const bucket = grouped.get(option.variantId) ?? [];
      bucket.push(option as ProductWithFullRelations["variants"][number]["options"][number]);
      grouped.set(option.variantId, bucket);
    }
  };

  try {
    const options = await db.productVariantOption.findMany({
      where: { variantId: { in: variantIds } },
      include: {
        attributeValue: {
          include: {
            attribute: true,
            translations: { where: { locale: localeFilter } },
          },
        },
      },
    });
    attach(options);
    return grouped;
  } catch (error: unknown) {
    if (!isAttributeValuesColorsError(error)) {
      throw error;
    }
    logger.warn("attribute_values.colors unavailable, loading variant options without joins");
    const options = await db.productVariantOption.findMany({
      where: { variantId: { in: variantIds } },
    });
    attach(options);
    return grouped;
  }
}

function attachVariantOptions(
  variants: PdpVariantCore[],
  optionsByVariant: Map<string, ProductWithFullRelations["variants"][number]["options"]>,
): ProductWithFullRelations["variants"] {
  return variants.map((variant) => ({
    ...variant,
    options: optionsByVariant.get(variant.id) ?? [],
  })) as ProductWithFullRelations["variants"];
}

/**
 * Batched PDP fetch — indexed slug lookup, flat parallel queries, options ∥ image hydration.
 */
export async function fetchProductBySlugBatched(
  slug: string,
  lang: string = "en",
): Promise<ProductWithFullRelations | null> {
  const productId = await measurePdpStep(slug, "resolve-slug", () =>
    resolvePublishedProductIdBySlug(slug),
  );

  if (!productId) {
    return null;
  }

  const base = await measurePdpStep(slug, "base-product", () =>
    db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        brandId: true,
        media: true,
        discountPercent: true,
        primaryCategoryId: true,
        categoryIds: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    }),
  );

  if (!base || !base.published || base.deletedAt !== null) {
    return null;
  }

  const categoryIds = base.categoryIds.length > 0 ? base.categoryIds : [];
  const localeFilter = pdpTranslationLocaleFilter(lang);

  const [translations, variants, labels, categories, brand, productAttributes] =
    await measurePdpStep(slug, "relations-wave", () =>
      Promise.all([
        fetchProductTranslations(productId, lang),
        db.productVariant.findMany({
          where: { productId, published: true },
          select: {
            id: true,
            sku: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            published: true,
          },
          orderBy: { price: "asc" },
        }),
        db.productLabel.findMany({ where: { productId } }),
        categoryIds.length > 0
          ? db.category.findMany({
              where: { id: { in: categoryIds } },
              select: {
                id: true,
                translations: {
                  where: { locale: localeFilter },
                  select: { locale: true, slug: true, title: true },
                },
              },
            })
          : Promise.resolve([]),
        base.brandId
          ? db.brand.findUnique({
              where: { id: base.brandId },
              include: {
                translations: { where: { locale: localeFilter } },
              },
            })
          : Promise.resolve(null),
        fetchProductAttributes(productId, lang),
      ]),
    );

  const variantIds = variants.map((variant) => variant.id);

  const [optionsByVariant] = await measurePdpStep(slug, "variants-options-hydration", () =>
    Promise.all([
      fetchOptionsByVariantId(variantIds, lang),
      variantIds.length > 0 ? hydrateVariantImageUrls(variants) : Promise.resolve(),
    ]),
  );

  const variantsWithOptions = attachVariantOptions(variants, optionsByVariant);

  const { deletedAt: _deletedAt, ...baseFields } = base;

  return {
    ...baseFields,
    translations,
    brand,
    categories,
    variants: variantsWithOptions,
    labels,
    productAttributes,
  } as unknown as ProductWithFullRelations;
}
