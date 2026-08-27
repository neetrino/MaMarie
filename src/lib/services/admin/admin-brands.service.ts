import { db } from "@white-shop/db";
import { toSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/utils/logger";
import {
  invalidateAdminBrandsCache,
  withAdminBrandsCache,
} from "@/lib/cache/admin-reference-cache";
import {
  brandLocaleNameMapFromRows,
  pickPrimaryBrandName,
  resolveBrandSlugSource,
  toBrandTranslationRows,
  type BrandLocaleNameMap,
} from "@/lib/admin/brand-locale-helpers";
import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  isProductContentLocale,
} from "@/constants/product-content-locales";
import { resolveDisplayName } from "@/lib/admin/attribute-locale-helpers";

type BrandTranslationRow = { id: string; locale: string; name: string };

interface BrandWriteInput {
  name?: string;
  locale?: string;
  translations?: Array<{ locale: string; name: string }>;
  slug?: string;
  logoUrl?: string | null;
  published?: boolean;
}

function namesMapFromInput(data: BrandWriteInput): BrandLocaleNameMap {
  if (data.translations && data.translations.length > 0) {
    return brandLocaleNameMapFromRows(
      data.translations.map((row) => ({ locale: row.locale, text: row.name })),
    );
  }

  const map = brandLocaleNameMapFromRows([]);
  const locale =
    data.locale && isProductContentLocale(data.locale)
      ? data.locale
      : PRIMARY_PRODUCT_CONTENT_LOCALE;
  if (data.name?.trim()) {
    map[locale] = data.name.trim();
  }
  return map;
}

async function allocateUniqueBrandSlug(
  baseSlug: string,
  excludeBrandId?: string,
): Promise<string> {
  const safeBase = baseSlug || "brand";
  let slug = safeBase;
  let counter = 1;

  while (counter <= 1000) {
    const existing = await db.brand.findUnique({ where: { slug } });
    if (!existing || (excludeBrandId && existing.id === excludeBrandId)) {
      return slug;
    }
    slug = `${safeBase}-${counter}`;
    counter += 1;
  }

  throw {
    status: 500,
    type: "https://api.shop.am/problems/internal-error",
    title: "Unable to generate unique slug",
    detail: "Could not generate a unique slug for the brand after many attempts",
  };
}

function formatBrandResponse(brand: {
  id: string;
  slug: string;
  logoUrl: string | null;
  published: boolean | null;
  translations?: BrandTranslationRow[];
}) {
  const translations = Array.isArray(brand.translations) ? brand.translations : [];
  return {
    id: brand.id,
    name: resolveDisplayName(translations, brand.slug),
    slug: brand.slug,
    logoUrl: brand.logoUrl,
    published: Boolean(brand.published),
    translations: translations.map((row) => ({
      locale: row.locale,
      name: row.name,
    })),
  };
}

class AdminBrandsService {
  async getBrands() {
    return withAdminBrandsCache(async () => {
      const brands = await db.brand.findMany({
        where: { deletedAt: null },
        include: { translations: true },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: brands.map((brand) => formatBrandResponse(brand)),
      };
    });
  }

  async createBrand(data: BrandWriteInput) {
    const namesMap = namesMapFromInput(data);
    const primaryName = pickPrimaryBrandName(namesMap);
    if (!primaryName) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Collection name required",
        detail: "At least one locale name is required",
      };
    }

    const requestedSlug = data.slug?.trim()
      ? toSlug(data.slug)
      : toSlug(resolveBrandSlugSource(namesMap));
    const slug = await allocateUniqueBrandSlug(requestedSlug || "brand");
    const translationRows = toBrandTranslationRows(namesMap);

    const brand = await db.brand.create({
      data: {
        slug,
        logoUrl: data.logoUrl || undefined,
        published: data.published ?? true,
        translations: {
          create: translationRows,
        },
      },
      include: { translations: true },
    });

    invalidateAdminBrandsCache();
    return { data: formatBrandResponse(brand) };
  }

  async updateBrand(brandId: string, data: BrandWriteInput) {
    logger.debug("🔄 [ADMIN SERVICE] updateBrand called:", brandId, data);

    const brand = await db.brand.findUnique({
      where: { id: brandId },
      include: { translations: true },
    });

    if (!brand) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Collection not found",
        detail: `Collection with id '${brandId}' does not exist`,
      };
    }

    const updateData: {
      logoUrl?: string | null;
      published?: boolean;
      slug?: string;
    } = {};

    if (data.logoUrl !== undefined) {
      updateData.logoUrl = data.logoUrl || null;
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    const hasTranslationsPayload =
      (data.translations && data.translations.length > 0) || data.name !== undefined;

    if (hasTranslationsPayload) {
      const namesMap = namesMapFromInput(data);
      const primaryName = pickPrimaryBrandName(namesMap);
      if (!primaryName) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/bad-request",
          title: "Collection name required",
          detail: "At least one locale name is required",
        };
      }

      const existingByLocale = new Map(
        (Array.isArray(brand.translations) ? brand.translations : []).map((row) => [
          row.locale,
          row,
        ]),
      );

      for (const row of toBrandTranslationRows(namesMap)) {
        const existing = existingByLocale.get(row.locale);
        if (existing) {
          await db.brandTranslation.update({
            where: { id: existing.id },
            data: { name: row.name },
          });
        } else {
          await db.brandTranslation.create({
            data: {
              brandId: brand.id,
              locale: row.locale,
              name: row.name,
            },
          });
        }
      }
    }

    if (data.slug !== undefined) {
      const nextSlug = toSlug(data.slug.trim());
      if (!nextSlug) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/bad-request",
          title: "Invalid slug",
          detail: "Slug must contain Latin letters or digits",
        };
      }
      updateData.slug = await allocateUniqueBrandSlug(nextSlug, brandId);
    }

    if (Object.keys(updateData).length > 0) {
      await db.brand.update({
        where: { id: brandId },
        data: updateData,
      });
    }

    const updatedBrand = await db.brand.findUnique({
      where: { id: brandId },
      include: { translations: true },
    });

    invalidateAdminBrandsCache();
    return { data: formatBrandResponse(updatedBrand!) };
  }

  async deleteBrand(brandId: string) {
    logger.debug("🗑️ [ADMIN SERVICE] deleteBrand called:", brandId);

    const brand = await db.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Collection not found",
        detail: `Collection with id '${brandId}' does not exist`,
      };
    }

    const productsCount = await db.product.count({
      where: {
        brandId: brandId,
        deletedAt: null,
      },
    });

    if (productsCount > 0) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Cannot delete brand",
        detail: `This brand has ${productsCount} associated product${productsCount > 1 ? "s" : ""}. Please remove or change brand for these products first.`,
        productsCount,
      };
    }

    await db.brand.update({
      where: { id: brandId },
      data: {
        deletedAt: new Date(),
        published: false,
      },
    });

    logger.debug("✅ [ADMIN SERVICE] Brand deleted:", brandId);
    invalidateAdminBrandsCache();
    return { success: true };
  }
}

export const adminBrandsService = new AdminBrandsService();
