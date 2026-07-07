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

class AdminCategoriesService {
  private extractImageUrl(media: unknown): string | null {
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
          translations: {
            where: { locale: "en" },
            take: 1,
          },
        },
        orderBy: {
          position: "asc",
        },
      });

      return {
        data: categories.map((category: { id: string; parentId: string | null; parentIds: string[]; requiresSizes: boolean | null; published: boolean | null; media: unknown[]; translations?: Array<{ title: string; slug: string }> }) => {
          const translations = Array.isArray(category.translations) ? category.translations : [];
          const translation = translations[0] || null;
          return {
            id: category.id,
            title: translation?.title || "",
            slug: translation?.slug || "",
            parentId: category.parentId,
            parentIds: getEffectiveParentIds(category),
            requiresSizes: category.requiresSizes || false,
            published: Boolean(category.published),
            imageUrl: this.extractImageUrl(category.media),
          };
        }),
      };
    });
  }

  /**
   * Create category
   */
  async createCategory(data: {
    title: string;
    locale?: string;
    parentId?: string;
    parentIds?: string[];
    requiresSizes?: boolean;
    subcategoryIds?: string[];
    imageUrl?: string;
    published?: boolean;
  }) {
    const locale = data.locale || "en";
    const parentIds = await this.validateParentIds(
      data.parentIds ?? (data.parentId ? [data.parentId] : []),
    );
    const primaryParentId = syncPrimaryParentId(parentIds);

    // Generate slug from title (ReDoS-safe)
    const slug = toSlug(data.title);

    const category = await db.category.create({
      data: {
        parentId: primaryParentId ?? undefined,
        parentIds,
        requiresSizes: data.requiresSizes || false,
        published: data.published ?? true,
        media: data.imageUrl
          ? [{ type: "image", url: data.imageUrl }]
          : [],
        translations: {
          create: {
            locale,
            title: data.title,
            slug,
            fullPath: slug, // Can be enhanced to build full path
          },
        },
      },
      include: {
        translations: true,
      },
    });

    if (parentIds.length === 0 && data.subcategoryIds && data.subcategoryIds.length > 0) {
      const validSubcategoryIds = Array.from(new Set(data.subcategoryIds)).filter(
        (id) => id !== category.id
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

    const categoryTranslations = Array.isArray(category.translations) ? category.translations : [];
    const translation = categoryTranslations.find((t: { locale: string }) => t.locale === locale) || categoryTranslations[0] || null;

    invalidateAdminCategoriesCache();

    return {
      data: {
        id: category.id,
        title: translation?.title || "",
        slug: translation?.slug || "",
        parentId: category.parentId,
        parentIds: getEffectiveParentIds(category),
        requiresSizes: category.requiresSizes || false,
        imageUrl: this.extractImageUrl(category.media),
        published: Boolean(category.published),
      },
    };
  }

  /**
   * Get category by ID with children
   */
  async getCategoryById(categoryId: string) {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: {
          where: { locale: "en" },
          take: 1,
        },
        children: {
          include: {
            translations: {
              where: { locale: "en" },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    const translations = Array.isArray(category.translations) ? category.translations : [];
    const translation = translations[0] || null;

    return {
      id: category.id,
      title: translation?.title || "",
      slug: translation?.slug || "",
      parentId: category.parentId,
      parentIds: getEffectiveParentIds(category),
      requiresSizes: category.requiresSizes || false,
      published: Boolean(category.published),
      imageUrl: this.extractImageUrl(category.media),
      children: category.children.map((child: { id: string; parentId: string | null; requiresSizes: boolean | null; translations?: Array<{ title: string; slug: string }> }) => {
        const childTranslations = Array.isArray(child.translations) ? child.translations : [];
        const childTranslation = childTranslations[0] || null;
        return {
          id: child.id,
          title: childTranslation?.title || "",
          slug: childTranslation?.slug || "",
          parentId: child.parentId,
          requiresSizes: child.requiresSizes || false,
        };
      }),
    };
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, data: {
    title?: string;
    locale?: string;
    parentId?: string | null;
    parentIds?: string[];
    requiresSizes?: boolean;
    subcategoryIds?: string[];
    imageUrl?: string | null;
    published?: boolean;
  }) {
    const locale = data.locale || "en";
    
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
      // First, remove all existing children relationships
      await db.category.updateMany({
        where: { parentId: categoryId },
        data: { parentId: null, parentIds: [] },
      });

      const effectiveParentIds = resolvedParentIds ?? getEffectiveParentIds(category);
      if (effectiveParentIds.length === 0 && data.subcategoryIds.length > 0) {
        const validSubcategoryIds = data.subcategoryIds.filter(id => id !== categoryId);
        
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
      updateData.media = data.imageUrl
        ? [{ type: "image", url: data.imageUrl }]
        : [];
    }

    // Update translation if title is provided
    if (data.title) {
      const slug = toSlug(data.title);

      const categoryTranslations = Array.isArray(category.translations) ? category.translations : [];
      const existingTranslation = categoryTranslations.find((t: { locale: string }) => t.locale === locale);

      if (existingTranslation) {
        // Update existing translation
        await db.categoryTranslation.update({
          where: { id: existingTranslation.id },
          data: {
            title: data.title,
            slug,
          },
        });
      } else {
        // Create new translation
        await db.categoryTranslation.create({
          data: {
            categoryId: category.id,
            locale,
            title: data.title,
            slug,
            fullPath: slug,
          },
        });
      }
    }

    // Update category base data
    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        translations: true,
      },
    });

    const categoryTranslations = Array.isArray(updatedCategory.translations) ? updatedCategory.translations : [];
    const translation = categoryTranslations.find((t: { locale: string }) => t.locale === locale) || categoryTranslations[0] || null;

    invalidateAdminCategoriesCache();

    return {
      data: {
        id: updatedCategory.id,
        title: translation?.title || "",
        slug: translation?.slug || "",
        parentId: updatedCategory.parentId,
        parentIds: getEffectiveParentIds(updatedCategory),
        requiresSizes: updatedCategory.requiresSizes || false,
        published: Boolean(updatedCategory.published),
        imageUrl: this.extractImageUrl(updatedCategory.media),
      },
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



