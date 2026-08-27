import { db } from "@white-shop/db";
import {
  invalidateAdminCategoriesCache,
  withAdminCategoriesCache,
} from "@/lib/cache/admin-reference-cache";
import {
  getEffectiveParentIds,
  isRootCategory,
  normalizeParentIds,
  syncPrimaryParentId,
} from "@/lib/categories/category-parent-ids";
import { toSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/utils/logger";
import {
  categoryLocaleTitleMapFromRows,
  emptyCategoryLocaleTitleMap,
  pickPrimaryCategoryTitle,
  resolveCategorySlugSource,
  resolveDisplayTitle,
  toCategoryTranslationRows,
  type CategoryLocaleTitleMap,
} from "@/lib/admin/category-locale-helpers";
import {
  isProductContentLocale,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
} from "@/constants/product-content-locales";

type CategoryTranslationRow = { id: string; locale: string; title: string; slug: string };

interface CategoryWriteInput {
  title?: string;
  locale?: string;
  translations?: Array<{ locale: string; title: string }>;
  slug?: string;
  parentId?: string | null;
  parentIds?: string[];
  requiresSizes?: boolean;
  subcategoryIds?: string[];
  imageUrl?: string | null;
  published?: boolean;
}

function titlesMapFromInput(data: CategoryWriteInput): CategoryLocaleTitleMap {
  if (data.translations && data.translations.length > 0) {
    return categoryLocaleTitleMapFromRows(
      data.translations.map((row) => ({ locale: row.locale, text: row.title })),
    );
  }

  const map = emptyCategoryLocaleTitleMap();
  const locale =
    data.locale && isProductContentLocale(data.locale)
      ? data.locale
      : PRIMARY_PRODUCT_CONTENT_LOCALE;
  if (data.title?.trim()) {
    map[locale] = data.title.trim();
  }
  return map;
}

async function allocateUniqueCategorySlug(
  baseSlug: string,
  excludeCategoryId?: string,
): Promise<string> {
  const safeBase = baseSlug || "category";
  let slug = safeBase;
  let counter = 1;

  while (counter <= 1000) {
    const existing = await db.categoryTranslation.findFirst({
      where: {
        slug,
        ...(excludeCategoryId ? { categoryId: { not: excludeCategoryId } } : {}),
        category: { deletedAt: null },
      },
    });
    if (!existing) {
      return slug;
    }
    slug = `${safeBase}-${counter}`;
    counter += 1;
  }

  throw {
    status: 500,
    type: "https://api.shop.am/problems/internal-error",
    title: "Unable to generate unique slug",
    detail: "Could not generate a unique slug for the category after many attempts",
  };
}

function extractCategoryImageUrl(media: unknown): string | null {
  if (!Array.isArray(media)) {
    return null;
  }

  const firstItem = media[0];
  if (!firstItem || typeof firstItem !== "object") {
    return null;
  }

  const url = (firstItem as { url?: unknown }).url;
  return typeof url === "string" ? url : null;
}

function formatCategoryResponse(category: {
  id: string;
  parentId: string | null;
  parentIds: string[];
  requiresSizes: boolean | null;
  published: boolean | null;
  media: unknown;
  translations?: CategoryTranslationRow[];
}) {
  const translations = Array.isArray(category.translations) ? category.translations : [];
  const primarySlug =
    translations.find((row) => row.locale === PRIMARY_PRODUCT_CONTENT_LOCALE)?.slug ||
    translations[0]?.slug ||
    "";

  return {
    id: category.id,
    title: resolveDisplayTitle(translations, primarySlug),
    slug: primarySlug,
    parentId: category.parentId,
    parentIds: getEffectiveParentIds(category),
    requiresSizes: category.requiresSizes || false,
    published: Boolean(category.published),
    imageUrl: extractCategoryImageUrl(category.media),
    translations: translations.map((row) => ({
      locale: row.locale,
      title: row.title,
      slug: row.slug,
    })),
  };
}

class AdminCategoriesService {
  private extractImageUrl(media: unknown): string | null {
    return extractCategoryImageUrl(media);
  }

  private async detachCategoryFromProducts(categoryId: string): Promise<void> {
    const linkedProducts = await db.product.findMany({
      where: {
        OR: [
          { primaryCategoryId: categoryId },
          { categoryIds: { has: categoryId } },
        ],
      },
      select: {
        id: true,
        categoryIds: true,
      },
    });

    if (linkedProducts.length === 0) {
      return;
    }

    await db.$transaction(async (tx) => {
      await tx.product.updateMany({
        where: { primaryCategoryId: categoryId },
        data: { primaryCategoryId: null },
      });

      for (const product of linkedProducts) {
        if (!product.categoryIds.includes(categoryId)) {
          continue;
        }

        const nextCategoryIds = product.categoryIds.filter((id) => id !== categoryId);
        await tx.product.update({
          where: { id: product.id },
          data: { categoryIds: nextCategoryIds },
        });
      }

      await tx.category.update({
        where: { id: categoryId },
        data: {
          products: {
            set: [],
          },
        },
      });
    });
  }

  private async validateParentIds(parentIds: string[], categoryId?: string): Promise<string[]> {
    const normalized = normalizeParentIds(parentIds);

    if (normalized.length === 0) {
      return [];
    }

    if (categoryId && normalized.includes(categoryId)) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Invalid parent",
        detail: "Category cannot be its own parent",
      };
    }

    const parents = await db.category.findMany({
      where: {
        id: { in: normalized },
        deletedAt: null,
      },
      select: {
        id: true,
        parentId: true,
        parentIds: true,
      },
    });

    if (parents.length !== normalized.length) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Parent category not found",
        detail: "One or more selected parent categories do not exist",
      };
    }

    const invalidParent = parents.find((parent) => !isRootCategory(parent));
    if (invalidParent) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Invalid parent",
        detail: "Only root categories can be selected as parents",
      };
    }

    return normalized;
  }

  /**
   * Get categories for admin
   */
  async getCategories() {
    return withAdminCategoriesCache(async () => {
      const categories = await db.category.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          translations: true,
        },
        orderBy: {
          position: "asc",
        },
      });

      return {
        data: categories.map((category) => formatCategoryResponse(category)),
      };
    });
  }

  /**
   * Create category
   */
  async createCategory(data: CategoryWriteInput) {
    const titlesMap = titlesMapFromInput(data);
    const primaryTitle = pickPrimaryCategoryTitle(titlesMap);
    if (!primaryTitle) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Category title required",
        detail: "At least one locale title is required",
      };
    }

    const parentIds = await this.validateParentIds(
      data.parentIds ?? (data.parentId ? [data.parentId] : []),
    );
    const primaryParentId = syncPrimaryParentId(parentIds);

    const requestedSlug = data.slug?.trim()
      ? toSlug(data.slug)
      : toSlug(resolveCategorySlugSource(titlesMap));
    const slug = await allocateUniqueCategorySlug(requestedSlug || "category");
    const translationRows = toCategoryTranslationRows(titlesMap, slug);

    const category = await db.category.create({
      data: {
        parentId: primaryParentId ?? undefined,
        parentIds,
        requiresSizes: data.requiresSizes || false,
        published: data.published ?? true,
        media: data.imageUrl ? [{ type: "image", url: data.imageUrl }] : [],
        translations: {
          create: translationRows.map((row) => ({
            locale: row.locale,
            title: row.title,
            slug: row.slug,
            fullPath: row.slug,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    if (parentIds.length === 0 && data.subcategoryIds && data.subcategoryIds.length > 0) {
      const validSubcategoryIds = Array.from(new Set(data.subcategoryIds)).filter(
        (id) => id !== category.id,
      );

      if (validSubcategoryIds.length > 0) {
        await db.category.updateMany({
          where: {
            id: { in: validSubcategoryIds },
          },
          data: {
            parentId: category.id,
            parentIds: [],
          },
        });
      }
    }

    invalidateAdminCategoriesCache();

    return {
      data: formatCategoryResponse(category),
    };
  }

  /**
   * Get category by ID with children
   */
  async getCategoryById(categoryId: string) {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: true,
        children: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    const formatted = formatCategoryResponse(category);

    return {
      ...formatted,
      children: category.children.map((child) => formatCategoryResponse(child)),
    };
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, data: CategoryWriteInput) {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: true,
      },
    });

    if (!category) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Category not found",
        detail: `Category with id '${categoryId}' does not exist`,
      };
    }

    let resolvedParentIds: string[] | undefined;
    if (data.parentIds !== undefined) {
      resolvedParentIds = await this.validateParentIds(data.parentIds, categoryId);
    } else if (data.parentId !== undefined) {
      resolvedParentIds = data.parentId
        ? await this.validateParentIds([data.parentId], categoryId)
        : [];
    }

    if (resolvedParentIds) {
      for (const parentId of resolvedParentIds) {
        const isDescendant = await this.isCategoryDescendant(categoryId, parentId);
        if (isDescendant) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/bad-request",
            title: "Circular reference",
            detail: "Cannot set parent to a category that is a descendant of this category",
          };
        }
      }
    }

    // Update subcategories if provided
    if (data.subcategoryIds !== undefined) {
      await db.category.updateMany({
        where: { parentId: categoryId },
        data: { parentId: null, parentIds: [] },
      });

      const effectiveParentIds = resolvedParentIds ?? getEffectiveParentIds(category);
      if (effectiveParentIds.length === 0 && data.subcategoryIds.length > 0) {
        const validSubcategoryIds = data.subcategoryIds.filter((id) => id !== categoryId);

        for (const subId of validSubcategoryIds) {
          const isDescendant = await this.isCategoryDescendant(categoryId, subId);
          if (isDescendant) {
            throw {
              status: 400,
              type: "https://api.shop.am/problems/bad-request",
              title: "Circular reference",
              detail: "Cannot set a descendant category as subcategory",
            };
          }
        }

        if (validSubcategoryIds.length > 0) {
          await db.category.updateMany({
            where: {
              id: { in: validSubcategoryIds },
            },
            data: {
              parentId: categoryId,
              parentIds: [],
            },
          });
        }
      }
    }

    const updateData: {
      parentId?: string | null;
      parentIds?: string[];
      requiresSizes?: boolean;
      published?: boolean;
      media?: Array<{ type: string; url: string }>;
    } = {};

    if (resolvedParentIds !== undefined) {
      updateData.parentIds = resolvedParentIds;
      updateData.parentId = syncPrimaryParentId(resolvedParentIds);
    }

    if (data.requiresSizes !== undefined) {
      updateData.requiresSizes = data.requiresSizes;
    }

    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    if (data.imageUrl !== undefined) {
      updateData.media = data.imageUrl ? [{ type: "image", url: data.imageUrl }] : [];
    }

    const hasTranslationsPayload =
      (data.translations && data.translations.length > 0) || data.title !== undefined;

    let nextSlug: string | undefined;
    if (data.slug !== undefined) {
      const normalized = toSlug(data.slug.trim());
      if (!normalized) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/bad-request",
          title: "Invalid slug",
          detail: "Slug must contain Latin letters or digits",
        };
      }
      nextSlug = await allocateUniqueCategorySlug(normalized, categoryId);
    }

    if (hasTranslationsPayload) {
      const titlesMap = titlesMapFromInput(data);
      const primaryTitle = pickPrimaryCategoryTitle(titlesMap);
      if (!primaryTitle) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/bad-request",
          title: "Category title required",
          detail: "At least one locale title is required",
        };
      }

      const resolvedSlug =
        nextSlug ??
        (data.slug?.trim()
          ? toSlug(data.slug)
          : toSlug(resolveCategorySlugSource(titlesMap)));
      const sharedSlug = await allocateUniqueCategorySlug(resolvedSlug || "category", categoryId);

      const existingByLocale = new Map(
        (Array.isArray(category.translations) ? category.translations : []).map((row) => [
          row.locale,
          row,
        ]),
      );

      for (const row of toCategoryTranslationRows(titlesMap, sharedSlug)) {
        const existing = existingByLocale.get(row.locale);
        if (existing) {
          await db.categoryTranslation.update({
            where: { id: existing.id },
            data: {
              title: row.title,
              slug: row.slug,
              fullPath: row.slug,
            },
          });
        } else {
          await db.categoryTranslation.create({
            data: {
              categoryId: category.id,
              locale: row.locale,
              title: row.title,
              slug: row.slug,
              fullPath: row.slug,
            },
          });
        }
      }
    } else if (nextSlug) {
      await db.categoryTranslation.updateMany({
        where: { categoryId: category.id },
        data: {
          slug: nextSlug,
          fullPath: nextSlug,
        },
      });
    }

    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        translations: true,
      },
    });

    invalidateAdminCategoriesCache();

    return {
      data: formatCategoryResponse(updatedCategory),
    };
  }

  /**
   * Helper function to check if a category is a descendant of another category
   */
  private async isCategoryDescendant(ancestorId: string, descendantId: string, visited: Set<string> = new Set()): Promise<boolean> {
    if (visited.has(descendantId)) {
      // Circular reference detected
      return false;
    }
    visited.add(descendantId);

    const category = await db.category.findUnique({
      where: { id: descendantId },
      include: {
        parent: true,
      },
    });

    if (!category || !category.parent) {
      return false;
    }

    if (category.parent.id === ancestorId) {
      return true;
    }

    return this.isCategoryDescendant(ancestorId, category.parent.id, visited);
  }

  /**
   * Delete category (soft delete)
   */
  async deleteCategory(categoryId: string) {
    logger.debug('🗑️ [ADMIN SERVICE] deleteCategory called:', categoryId);
    
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!category) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Category not found",
        detail: `Category with id '${categoryId}' does not exist`,
      };
    }

    // Check if category has children
    const childrenCount = category.children ? category.children.length : 0;
    if (childrenCount > 0) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Cannot delete category",
        detail: `This category has ${childrenCount} child categor${childrenCount > 1 ? 'ies' : 'y'}. Please delete or move child categories first.`,
        childrenCount,
      };
    }

    await this.detachCategoryFromProducts(categoryId);

    await db.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
        published: false,
      },
    });

    logger.debug('✅ [ADMIN SERVICE] Category deleted:', categoryId);
    invalidateAdminCategoriesCache();
    return { success: true };
  }
}

export const adminCategoriesService = new AdminCategoriesService();



