import { Prisma } from "@white-shop/db";
import type { ProductFilters } from "./types";

const INSENSITIVE = "insensitive" as const;

function containsInsensitive(value: string): Prisma.StringFilter {
  return { contains: value, mode: INSENSITIVE };
}

function buildSearchOrConditions(filters: ProductFilters): Prisma.ProductWhereInput[] {
  const searchTerm = filters.search?.trim();
  const skuTerm = filters.sku?.trim();
  const searchOr: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    searchOr.push(
      { translations: { some: { title: containsInsensitive(searchTerm) } } },
      { translations: { some: { slug: containsInsensitive(searchTerm) } } },
      { variants: { some: { sku: containsInsensitive(searchTerm) } } }
    );
  }

  if (skuTerm && skuTerm !== searchTerm) {
    searchOr.push({ variants: { some: { sku: containsInsensitive(skuTerm) } } });
  }

  return searchOr;
}

function buildCategoryOrConditions(filters: ProductFilters): Prisma.ProductWhereInput[] {
  const categoryIds =
    filters.categories && filters.categories.length > 0
      ? filters.categories
      : filters.category
        ? [filters.category]
        : [];

  return categoryIds.flatMap((categoryId) => [
    { primaryCategoryId: categoryId },
    { categoryIds: { has: categoryId } },
  ]);
}

/**
 * Build where clause for product queries
 */
export function buildProductWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
  };
  const andConditions: Prisma.ProductWhereInput[] = [];
  const searchOr = buildSearchOrConditions(filters);
  const categoryOr = buildCategoryOrConditions(filters);

  if (searchOr.length > 0) {
    andConditions.push({ OR: searchOr });
  }
  if (categoryOr.length > 0) {
    andConditions.push({ OR: categoryOr });
  }
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}

/**
 * Build orderBy clause for product queries
 */
export function buildProductOrderByClause(filters: ProductFilters): Prisma.ProductOrderByWithRelationInput {
  if (filters.sort) {
    const [field, direction] = filters.sort.split("-");
    return { [field]: direction || "desc" };
  }
  return { createdAt: "desc" };
}
