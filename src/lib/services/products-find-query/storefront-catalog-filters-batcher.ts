import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import type { ProductWithRelations } from './types';

type FilterBaseProduct = {
  id: string;
  brandId: string | null;
};

type FilterVariantRow = {
  id: string;
  productId: string;
  sku: string | null;
  price: number;
  stock: number;
  attributes: Prisma.JsonValue | null;
};

type FilterOptionRow = {
  id: string;
  variantId: string;
  attributeKey: string | null;
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

function groupOptionsByVariant(options: FilterOptionRow[]): Map<string, FilterOptionRow[]> {
  const grouped = new Map<string, FilterOptionRow[]>();
  for (const option of options) {
    const bucket = grouped.get(option.variantId);
    if (bucket) {
      bucket.push(option);
    } else {
      grouped.set(option.variantId, [option]);
    }
  }
  return grouped;
}

function assembleFilterProducts(
  baseProducts: FilterBaseProduct[],
  brands: Array<{
    id: string;
    translations: Array<{ locale: string; name: string }>;
  }>,
  variants: FilterVariantRow[],
  options: FilterOptionRow[]
): ProductWithRelations[] {
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const variantsByProduct = new Map<string, FilterVariantRow[]>();
  for (const variant of variants) {
    const bucket = variantsByProduct.get(variant.productId);
    if (bucket) {
      bucket.push(variant);
    } else {
      variantsByProduct.set(variant.productId, [variant]);
    }
  }

  const optionsByVariant = groupOptionsByVariant(options);

  return baseProducts.map((product) => ({
    id: product.id,
    brandId: product.brandId,
    brand: product.brandId ? brandsById.get(product.brandId) ?? null : null,
    variants: (variantsByProduct.get(product.id) ?? []).map((variant) => ({
      ...variant,
      options: optionsByVariant.get(variant.id) ?? [],
    })),
    translations: [],
    labels: [],
    categories: [],
    media: [],
    discountPercent: 0,
    published: true,
    featured: false,
    createdAt: new Date(0),
    primaryCategoryId: null,
  })) as unknown as ProductWithRelations[];
}

/**
 * Lightweight catalog fetch for sidebar filter aggregation — skips media, labels, categories.
 */
export async function fetchStorefrontCatalogFilterProducts(
  where: Prisma.ProductWhereInput,
  limit: number
): Promise<ProductWithRelations[]> {
  const baseProducts = await db.product.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      brandId: true,
    },
  });

  if (baseProducts.length === 0) {
    return [];
  }

  const productIds = baseProducts.map((product) => product.id);
  const brandIds = [
    ...new Set(
      baseProducts.map((product) => product.brandId).filter((id): id is string => Boolean(id))
    ),
  ];

  const [variants, brands] = await Promise.all([
    db.productVariant.findMany({
      where: { productId: { in: productIds }, published: true },
      select: {
        id: true,
        productId: true,
        sku: true,
        price: true,
        stock: true,
        attributes: true,
      },
    }),
    brandIds.length > 0
      ? db.brand.findMany({
          where: { id: { in: brandIds } },
          select: {
            id: true,
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

  return assembleFilterProducts(
    baseProducts,
    brands,
    variants,
    options as FilterOptionRow[]
  );
}
