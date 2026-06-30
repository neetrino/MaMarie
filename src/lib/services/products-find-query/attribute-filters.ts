import { Prisma } from "@white-shop/db";

function parseCsv(value?: string): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== "undefined" && item.toLowerCase() !== "null");
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)];
}

function buildOptionMatchValues(values: string[]): string[] {
  return uniqueValues(
    values.flatMap((value) => [value, value.toLowerCase(), value.toUpperCase()])
  );
}

function buildVariantOptionAttributeFilter(
  attributeKey: "color" | "size",
  rawValues: string[]
): Prisma.ProductVariantOptionWhereInput {
  const normalized =
    attributeKey === "color"
      ? uniqueValues(rawValues.map((value) => value.toLowerCase()))
      : uniqueValues(rawValues.map((value) => value.toUpperCase()));
  const matchValues = buildOptionMatchValues(normalized);

  return {
    OR: [
      { attributeKey, value: { in: matchValues } },
      {
        attributeValue: {
          attribute: { key: attributeKey },
          OR: [
            { value: { in: matchValues } },
            {
              translations: {
                some: {
                  label: { in: matchValues, mode: "insensitive" },
                },
              },
            },
          ],
        },
      },
    ],
  };
}

function buildPublishedVariantFilter(
  colors?: string,
  sizes?: string,
  minPrice?: number,
  maxPrice?: number
): Prisma.ProductVariantWhereInput | null {
  const colorList = parseCsv(colors).map((value) => value.toLowerCase());
  const sizeList = parseCsv(sizes).map((value) => value.toUpperCase());
  const hasPrice = minPrice != null || maxPrice != null;

  if (colorList.length === 0 && sizeList.length === 0 && !hasPrice) {
    return null;
  }

  const variantFilter: Prisma.ProductVariantWhereInput = {
    published: true,
  };

  if (hasPrice) {
    variantFilter.price = {
      ...(minPrice != null ? { gte: minPrice } : {}),
      ...(maxPrice != null ? { lte: maxPrice } : {}),
    };
  }

  const optionClauses: Prisma.ProductVariantWhereInput[] = [];
  if (colorList.length > 0) {
    optionClauses.push({
      options: {
        some: buildVariantOptionAttributeFilter("color", colorList),
      },
    });
  }
  if (sizeList.length > 0) {
    optionClauses.push({
      options: {
        some: buildVariantOptionAttributeFilter("size", sizeList),
      },
    });
  }

  if (optionClauses.length > 0) {
    variantFilter.AND = optionClauses;
  }

  return variantFilter;
}

/**
 * Builds Prisma where fragments for catalog filters that can run in SQL.
 */
export function buildCatalogAttributeWhere(filters: {
  colors?: string;
  sizes?: string;
  brand?: string;
  clothingTypes?: string;
  minPrice?: number;
  maxPrice?: number;
}): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  const andClauses: Prisma.ProductWhereInput[] = [];

  const brandList = parseCsv(filters.brand);
  if (brandList.length > 0) {
    andClauses.push({ brandId: { in: brandList } });
  }

  const clothingTypeList = parseCsv(filters.clothingTypes);
  if (clothingTypeList.length > 0) {
    andClauses.push({
      categories: {
        some: {
          translations: {
            some: {
              slug: { in: clothingTypeList },
            },
          },
        },
      },
    });
  }

  const variantFilter = buildPublishedVariantFilter(
    filters.colors,
    filters.sizes,
    filters.minPrice,
    filters.maxPrice
  );
  if (variantFilter) {
    andClauses.push({
      variants: {
        some: variantFilter,
      },
    });
  }

  if (andClauses.length === 1) {
    return andClauses[0];
  }
  if (andClauses.length > 1) {
    where.AND = andClauses;
  }

  return where;
}

export function hasCatalogAttributeFilters(filters: {
  colors?: string;
  sizes?: string;
  brand?: string;
  clothingTypes?: string;
  minPrice?: number;
  maxPrice?: number;
}): boolean {
  return Boolean(
    filters.colors ||
      filters.sizes ||
      filters.brand ||
      filters.clothingTypes ||
      filters.minPrice != null ||
      filters.maxPrice != null
  );
}
