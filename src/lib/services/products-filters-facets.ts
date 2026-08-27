import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import { COLOR_MAP } from '@/lib/colorMap';
import type {
  CatalogFilterAggregation,
  CatalogFilterAttributeGroup,
  CatalogFilterBrandOption,
  CatalogFilterColorOption,
  CatalogFilterSizeOption,
} from './products-filters-aggregate';
import {
  COLOR_ATTRIBUTE_KEY,
  SIZE_ATTRIBUTE_KEY,
  pickFacetTranslation,
  readColorHex,
  sortSizeFacetOptions,
} from './products-filters-facet-helpers';

const PRICE_BUCKET = 1000;

type FilterableAttributeRow = {
  key: string;
  position: number;
  filterable: boolean;
  translations: Array<{ locale: string; name: string }>;
};

type UsedValueRow = {
  value: string | null;
  attributeKey: string | null;
  attributeValue: {
    value: string;
    imageUrl: string | null;
    colors: Prisma.JsonValue;
    translations: Array<{ locale: string; label: string }>;
    attribute: FilterableAttributeRow;
  } | null;
};

async function loadBrands(
  productWhere: Prisma.ProductWhereInput,
  lang: string
): Promise<CatalogFilterBrandOption[]> {
  const brands = await db.brand.findMany({
    where: {
      deletedAt: null,
      products: { some: productWhere },
    },
    select: {
      id: true,
      slug: true,
      translations: { select: { locale: true, name: true } },
    },
  });

  return brands
    .map((brand) => ({
      id: brand.id,
      name: pickFacetTranslation(brand.translations, lang, brand.slug),
      count: 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function loadUsedVariantOptions(
  productWhere: Prisma.ProductWhereInput
): Promise<UsedValueRow[]> {
  return db.productVariantOption.findMany({
    where: {
      variant: {
        published: true,
        product: productWhere,
      },
    },
    distinct: ['valueId', 'attributeKey', 'value'],
    select: {
      valueId: true,
      value: true,
      attributeKey: true,
      attributeValue: {
        select: {
          value: true,
          imageUrl: true,
          colors: true,
          translations: { select: { locale: true, label: true } },
          attribute: {
            select: {
              key: true,
              position: true,
              filterable: true,
              translations: { select: { locale: true, name: true } },
            },
          },
        },
      },
    },
  }) as Promise<UsedValueRow[]>;
}

function assembleAttributeFacets(
  rows: UsedValueRow[],
  lang: string
): Pick<CatalogFilterAggregation, 'colors' | 'sizes' | 'attributes'> {
  const colorMap = new Map<string, CatalogFilterColorOption>();
  const sizeMap = new Map<string, number>();
  const groups = new Map<string, CatalogFilterAttributeGroup>();

  for (const row of rows) {
    const attribute = row.attributeValue?.attribute;
    const key = attribute?.key || row.attributeKey || '';
    if (!key) {
      continue;
    }

    const stableValue = (
      row.attributeValue?.value ||
      row.value ||
      pickFacetTranslation(row.attributeValue?.translations ?? [], lang, '')
    ).trim();
    if (!stableValue) {
      continue;
    }

    const displayLabel = pickFacetTranslation(
      row.attributeValue?.translations ?? [],
      lang,
      stableValue,
    );

    if (key === COLOR_ATTRIBUTE_KEY) {
      const mapKey = stableValue.toLowerCase();
      const existing = colorMap.get(mapKey);
      colorMap.set(mapKey, {
        value: mapKey,
        label: displayLabel,
        count: (existing?.count ?? 0) + 1,
        imageUrl: row.attributeValue?.imageUrl ?? existing?.imageUrl ?? null,
        colors: readColorHex(row.attributeValue?.colors ?? null) ?? existing?.colors ?? null,
      });
      continue;
    }

    if (key === SIZE_ATTRIBUTE_KEY) {
      const normalized = stableValue.toUpperCase();
      sizeMap.set(normalized, (sizeMap.get(normalized) ?? 0) + 1);
      continue;
    }

    if (attribute && attribute.filterable === false) {
      continue;
    }

    const group = groups.get(key) ?? {
      key,
      name: pickFacetTranslation(attribute?.translations ?? [], lang, key),
      values: [],
    };
    const existingValue = group.values.find(
      (item) => item.value.toLowerCase() === stableValue.toLowerCase(),
    );
    if (existingValue) {
      existingValue.count += 1;
      existingValue.label = displayLabel;
    } else {
      group.values.push({ value: stableValue, label: displayLabel, count: 1 });
    }
    groups.set(key, group);
  }

  const colorKeys = new Set(colorMap.keys());
  const sizes: CatalogFilterSizeOption[] = sortSizeFacetOptions(
    Array.from(sizeMap.entries())
      .filter(([value]) => !colorKeys.has(value.toLowerCase()) && !(value.toLowerCase() in COLOR_MAP))
      .map(([value, count]) => ({ value, count }))
  );

  return {
    colors: Array.from(colorMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    sizes,
    attributes: Array.from(groups.values())
      .map((group) => ({
        ...group,
        values: group.values.sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

async function loadUsedCategoryIds(
  productWhere: Prisma.ProductWhereInput
): Promise<string[]> {
  const products = await db.product.findMany({
    where: productWhere,
    select: { categoryIds: true, primaryCategoryId: true },
  });

  const directIds = new Set<string>();
  for (const product of products) {
    for (const id of product.categoryIds) {
      if (id) {
        directIds.add(id);
      }
    }
    if (product.primaryCategoryId) {
      directIds.add(product.primaryCategoryId);
    }
  }

  if (directIds.size === 0) {
    return [];
  }

  const categories = await db.category.findMany({
    where: { id: { in: Array.from(directIds) }, deletedAt: null },
    select: { id: true, parentIds: true },
  });

  const withAncestors = new Set<string>(directIds);
  for (const category of categories) {
    for (const parentId of category.parentIds) {
      if (parentId) {
        withAncestors.add(parentId);
      }
    }
  }

  return Array.from(withAncestors);
}

/** Loads catalog facets only from values actually used by matching products. */
export async function loadCatalogFilterFacets(
  productWhere: Prisma.ProductWhereInput,
  lang: string,
  categoryScopeWhere?: Prisma.ProductWhereInput
): Promise<CatalogFilterAggregation> {
  const categoryWhere = categoryScopeWhere ?? productWhere;
  const [brands, optionRows] = await Promise.all([
    loadBrands(productWhere, lang),
    loadUsedVariantOptions(productWhere),
  ]);
  const [priceAgg, categoryIds] = await Promise.all([
    db.productVariant.aggregate({
      where: { published: true, product: productWhere },
      _min: { price: true },
      _max: { price: true },
    }),
    loadUsedCategoryIds(categoryWhere),
  ]);

  const { colors, sizes, attributes } = assembleAttributeFacets(optionRows, lang);
  const minPrice = priceAgg._min.price;
  const maxPrice = priceAgg._max.price;

  return {
    colors,
    sizes,
    brands,
    attributes,
    categoryIds,
    priceMin: minPrice == null ? 0 : Math.floor(minPrice / PRICE_BUCKET) * PRICE_BUCKET,
    priceMax: maxPrice == null || maxPrice === 0
      ? 100000
      : Math.ceil(maxPrice / PRICE_BUCKET) * PRICE_BUCKET,
  };
}
