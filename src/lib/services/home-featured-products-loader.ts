import { Prisma } from '@white-shop/db';
import { db, ensureDbReady } from '@white-shop/db';
import { BEST_PRODUCTS_CARD_COUNT } from '../../constants/home-sections';
import type { HomeProductCardData } from '../../components/home/HomeProductCard';
import { mapToHomeProductCard } from '../../components/home/best-products-data';
import { productsFindTransformService } from './products-find-transform.service';
import type { ProductWithRelations } from './products-find-query/types';

type FeaturedBaseProduct = {
  id: string;
  brandId: string | null;
  media: Prisma.JsonValue[];
  discountPercent: number;
  primaryCategoryId: string | null;
};

type FeaturedVariantRow = {
  id: string;
  productId: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  attributes: Prisma.JsonValue | null;
  position: number;
};

function groupVariantsByProduct(
  variants: FeaturedVariantRow[]
): Map<string, FeaturedVariantRow[]> {
  const grouped = new Map<string, FeaturedVariantRow[]>();
  for (const variant of variants) {
    const bucket = grouped.get(variant.productId);
    if (bucket) {
      bucket.push(variant);
    } else {
      grouped.set(variant.productId, [variant]);
    }
  }
  return grouped;
}

function assembleFeaturedProducts(
  baseProducts: FeaturedBaseProduct[],
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
  variants: FeaturedVariantRow[]
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
  const variantsByProduct = groupVariantsByProduct(variants);

  return baseProducts.map((product) => ({
    ...product,
    published: true,
    featured: true,
    translations: translationsByProduct.get(product.id) ?? [],
    brand: product.brandId ? brandsById.get(product.brandId) ?? null : null,
    variants: (variantsByProduct.get(product.id) ?? []).map((variant) => ({
      ...variant,
      options: [],
    })),
    labels: [],
    categories: [],
  })) as unknown as ProductWithRelations[];
}

/**
 * Lightweight featured-products fetch for the homepage.
 * Skips variant-option joins and count queries — cards use variant.attributes JSON fallback.
 */
export async function fetchHomeFeaturedProductCards(
  lang: string
): Promise<HomeProductCardData[]> {
  await ensureDbReady();

  const baseProducts = await db.product.findMany({
    where: { published: true, deletedAt: null, featured: true },
    take: BEST_PRODUCTS_CARD_COUNT,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      brandId: true,
      media: true,
      discountPercent: true,
      primaryCategoryId: true,
    },
  });

  if (baseProducts.length === 0) {
    return [];
  }

  const productIds = baseProducts.map((product) => product.id);
  const brandIds = [
    ...new Set(
      baseProducts
        .map((product) => product.brandId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const [translations, variants, brands] = await Promise.all([
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
        attributes: true,
        position: true,
      },
      orderBy: { position: 'asc' },
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

  const products = assembleFeaturedProducts(
    baseProducts,
    translations,
    brands,
    variants
  );
  const transformed = await productsFindTransformService.transformProducts(products, lang);
  return transformed.map(mapToHomeProductCard);
}
