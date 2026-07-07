import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';

const EN_LOCALE = 'en';

export type AdminProductListRow = {
  id: string;
  published: boolean;
  featured: boolean;
  discountPercent: number;
  createdAt: Date;
  primaryCategoryId: string | null;
  media: Prisma.JsonValue[];
  translations: Array<{ slug: string; title: string }>;
  variants: Array<{
    price: number;
    stock: number;
    compareAtPrice: number | null;
    imageUrl: string | null;
  }>;
  categories: Array<{ id: string; translations: Array<{ title: string }> }>;
};

type BaseProductRow = {
  id: string;
  published: boolean;
  featured: boolean;
  discountPercent: number;
  createdAt: Date;
  primaryCategoryId: string | null;
  media: Prisma.JsonValue[];
  categoryIds: string[];
};

type CheapestVariantRow = {
  productId: string;
  price: number;
  stock: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
};

/** One cheapest published variant per product (index-friendly DISTINCT ON). */
async function fetchCheapestVariantsByProduct(
  productIds: string[]
): Promise<CheapestVariantRow[]> {
  if (productIds.length === 0) {
    return [];
  }

  return db.$queryRaw<CheapestVariantRow[]>(Prisma.sql`
    SELECT DISTINCT ON ("productId")
      "productId",
      price,
      stock,
      "compareAtPrice",
      "imageUrl"
    FROM product_variants
    WHERE "productId" IN (${Prisma.join(productIds)})
      AND published = true
    ORDER BY "productId", price ASC
  `);
}

function mapVariantsByProduct(
  variants: CheapestVariantRow[]
): Map<string, AdminProductListRow['variants'][number]> {
  return new Map(
    variants.map((variant) => [
      variant.productId,
      {
        price: variant.price,
        stock: variant.stock,
        compareAtPrice: variant.compareAtPrice,
        imageUrl: variant.imageUrl,
      },
    ])
  );
}

function assembleProductListRows(
  baseProducts: BaseProductRow[],
  translations: Array<{ productId: string; slug: string; title: string }>,
  variants: CheapestVariantRow[],
  categories: Array<{ id: string; translations: Array<{ title: string }> }>
): AdminProductListRow[] {
  const translationsByProduct = new Map(
    translations.map((row) => [row.productId, { slug: row.slug, title: row.title }])
  );
  const variantsByProduct = mapVariantsByProduct(variants);
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return baseProducts.map((product) => ({
    id: product.id,
    published: product.published,
    featured: product.featured,
    discountPercent: product.discountPercent,
    createdAt: product.createdAt,
    primaryCategoryId: product.primaryCategoryId,
    media: product.media,
    translations: translationsByProduct.has(product.id)
      ? [translationsByProduct.get(product.id)!]
      : [],
    variants: variantsByProduct.has(product.id) ? [variantsByProduct.get(product.id)!] : [],
    categories: product.categoryIds
      .map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is NonNullable<typeof category> => category !== undefined),
  }));
}

/**
 * Fetches admin product list rows via parallel batched queries.
 * Avoids Prisma nested findMany, which is very slow with multiple relations on Neon.
 */
export async function fetchAdminProductListRows(
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput,
  skip: number,
  take: number
): Promise<AdminProductListRow[]> {
  const baseProducts = await db.product.findMany({
    where,
    skip,
    take,
    orderBy,
    select: {
      id: true,
      published: true,
      featured: true,
      discountPercent: true,
      createdAt: true,
      primaryCategoryId: true,
      media: true,
      categoryIds: true,
    },
  });

  if (baseProducts.length === 0) {
    return [];
  }

  const productIds = baseProducts.map((product) => product.id);
  const categoryIds = [...new Set(baseProducts.flatMap((product) => product.categoryIds))];

  const [translations, variants, categories] = await Promise.all([
    db.productTranslation.findMany({
      where: { productId: { in: productIds }, locale: EN_LOCALE },
      select: { productId: true, slug: true, title: true },
    }),
    fetchCheapestVariantsByProduct(productIds),
    categoryIds.length > 0
      ? db.category.findMany({
          where: { id: { in: categoryIds } },
          select: {
            id: true,
            translations: {
              where: { locale: EN_LOCALE },
              take: 1,
              select: { title: true },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  return assembleProductListRows(baseProducts, translations, variants, categories);
}
