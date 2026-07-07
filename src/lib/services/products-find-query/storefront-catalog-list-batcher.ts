import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import type { ProductWithRelations } from './types';

type CatalogBaseProduct = {
  id: string;
  brandId: string | null;
  media: Prisma.JsonValue[];
  discountPercent: number;
  primaryCategoryId: string | null;
  createdAt: Date;
};

type CatalogVariantRow = {
  id: string;
  productId: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null;
  position: number;
  attributes: Prisma.JsonValue | null;
};

type CatalogOptionRow = {
  id: string;
  variantId: string;
  attributeId: string | null;
  attributeKey: string | null;
  valueId: string | null;
  value: string | null;
  attributeValue: {
    id: string;
    value: string;
    imageUrl: string | null;
    colors: Prisma.JsonValue;
    attribute: { id: string; key: string };
    translations: Array<{ locale: string; label: string }>;
  } | null;
};

function groupOptionsByVariant(options: CatalogOptionRow[]): Map<string, CatalogOptionRow[]> {
  const grouped = new Map<string, CatalogOptionRow[]>();
  for (const option of options) {
    const existing = grouped.get(option.variantId);
    if (existing) {
      existing.push(option);
    } else {
      grouped.set(option.variantId, [option]);
    }
  }
  return grouped;
}

function attachVariantOptions(
  variants: CatalogVariantRow[],
  optionsByVariant: Map<string, CatalogOptionRow[]>
): ProductWithRelations['variants'] {
  return variants.map((variant) => ({
    ...variant,
    options: optionsByVariant.get(variant.id) ?? [],
  })) as ProductWithRelations['variants'];
}

function assembleCatalogProducts(
  baseProducts: CatalogBaseProduct[],
  translations: Array<{
    productId: string;
    locale: string;
    title: string;
    slug: string;
    subtitle: string | null;
  }>,
  brands: Array<{
    id: string;
    slug: string;
    logoUrl: string | null;
    translations: Array<{ locale: string; name: string }>;
  }>,
  variants: CatalogVariantRow[],
  options: CatalogOptionRow[],
  labels: ProductWithRelations['labels'],
  categoryLinks: Array<{
    id: string;
    categories: Array<{
      id: string;
      translations: Array<{ locale: string; slug: string; title: string }>;
    }>;
  }>
): ProductWithRelations[] {
  const translationsByProduct = new Map<string, typeof translations>();
  for (const row of translations) {
    const bucket = translationsByProduct.get(row.productId);
    if (bucket) {
      bucket.push(row);
    } else {
      translationsByProduct.set(row.productId, [row]);
    }
  }

  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const labelsByProduct = new Map<string, ProductWithRelations['labels']>();
  for (const label of labels) {
    const bucket = labelsByProduct.get(label.productId);
    if (bucket) {
      bucket.push(label);
    } else {
      labelsByProduct.set(label.productId, [label]);
    }
  }

  const variantsByProduct = new Map<string, CatalogVariantRow[]>();
  for (const variant of variants) {
    const bucket = variantsByProduct.get(variant.productId);
    if (bucket) {
      bucket.push(variant);
    } else {
      variantsByProduct.set(variant.productId, [variant]);
    }
  }

  const categoriesByProduct = new Map(
    categoryLinks.map((row) => [row.id, row.categories])
  );
  const optionsByVariant = groupOptionsByVariant(options);

  return baseProducts.map((product) => {
    const productVariants = variantsByProduct.get(product.id) ?? [];
    return {
      ...product,
      published: true,
      featured: false,
      translations: translationsByProduct.get(product.id) ?? [],
      brand: product.brandId ? brandsById.get(product.brandId) ?? null : null,
      variants: attachVariantOptions(productVariants, optionsByVariant),
      labels: labelsByProduct.get(product.id) ?? [],
      categories: categoriesByProduct.get(product.id) ?? [],
    };
  }) as unknown as ProductWithRelations[];
}

/**
 * Batched storefront catalog fetch — avoids deep Prisma nested findMany on Neon.
 */
export async function fetchStorefrontCatalogProducts(
  where: Prisma.ProductWhereInput,
  limit: number,
  skip = 0
): Promise<ProductWithRelations[]> {
  const baseProducts = await db.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      brandId: true,
      media: true,
      discountPercent: true,
      primaryCategoryId: true,
      createdAt: true,
    },
  });

  if (baseProducts.length === 0) {
    return [];
  }

  const productIds = baseProducts.map((product) => product.id);
  const brandIds = [
    ...new Set(baseProducts.map((product) => product.brandId).filter((id): id is string => Boolean(id))),
  ];

  const [translations, variants, labels, categoryLinks, brands] = await Promise.all([
    db.productTranslation.findMany({
      where: { productId: { in: productIds } },
      select: {
        productId: true,
        locale: true,
        title: true,
        slug: true,
        subtitle: true,
      },
    }),
    db.productVariant.findMany({
      where: { productId: { in: productIds }, published: true },
      select: {
        id: true,
        productId: true,
        sku: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        imageUrl: true,
        position: true,
        attributes: true,
      },
      orderBy: { position: 'asc' },
    }),
    db.productLabel.findMany({
      where: { productId: { in: productIds } },
    }),
    db.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        categories: {
          select: {
            id: true,
            translations: true,
          },
        },
      },
    }),
    brandIds.length > 0
      ? db.brand.findMany({
          where: { id: { in: brandIds } },
          select: {
            id: true,
            slug: true,
            logoUrl: true,
            translations: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const variantIds = variants.map((variant) => variant.id);
  const options =
    variantIds.length > 0
      ? await db.productVariantOption.findMany({
          where: { variantId: { in: variantIds } },
          include: {
            attributeValue: {
              include: {
                attribute: true,
                translations: true,
              },
            },
          },
        })
      : [];

  return assembleCatalogProducts(
    baseProducts,
    translations,
    brands,
    variants,
    options as CatalogOptionRow[],
    labels as ProductWithRelations['labels'],
    categoryLinks
  );
}
