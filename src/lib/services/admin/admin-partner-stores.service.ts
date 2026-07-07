import { db } from "@white-shop/db";
import { toSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/utils/logger";
import {
  invalidateAdminPartnerStoresCache,
  withAdminPartnerStoresCache,
} from "@/lib/cache/admin-reference-cache";
import { invalidatePartnerStoresStorefrontCache } from "@/lib/cache/storefront-cache";
import { geocodePartnerStoreAddress } from "@/lib/partner-stores/geocode-address";

interface PartnerStoreTranslationRow {
  locale: string;
  name: string;
  address: string;
}

interface PartnerStoreRow {
  id: string;
  slug: string;
  logoUrl: string | null;
  latitude: number;
  longitude: number;
  published: boolean | null;
  position: number;
  translations?: PartnerStoreTranslationRow[];
}

function mapPartnerStore(store: PartnerStoreRow, locale: string) {
  const translations = Array.isArray(store.translations) ? store.translations : [];
  const translation =
    translations.find((item) => item.locale === locale) ?? translations[0] ?? null;

  return {
    id: store.id,
    name: translation?.name ?? "",
    address: translation?.address ?? "",
    slug: store.slug,
    logoUrl: store.logoUrl,
    latitude: store.latitude,
    longitude: store.longitude,
    published: Boolean(store.published),
    position: store.position,
  };
}

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = toSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await db.partnerStore.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
    if (counter > 1000) {
      throw {
        status: 500,
        type: "https://api.shop.am/problems/internal-error",
        title: "Unable to generate unique slug",
        detail: "Could not generate a unique slug for the partner store",
      };
    }
  }

  return slug;
}

class AdminPartnerStoresService {
  async getPartnerStores(locale = "en") {
    return withAdminPartnerStoresCache(async () => {
      const stores = await db.partnerStore.findMany({
        where: { deletedAt: null },
        include: { translations: true },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      });

      return {
        data: stores.map((store) => mapPartnerStore(store, locale)),
      };
    });
  }

  async createPartnerStore(data: {
    name: string;
    address: string;
    locale?: string;
    logoUrl?: string;
    published?: boolean;
  }) {
    const locale = data.locale ?? "en";
    const slug = await generateUniqueSlug(data.name);
    const coordinates = await geocodePartnerStoreAddress(data.address);

    const store = await db.partnerStore.create({
      data: {
        slug,
        logoUrl: data.logoUrl || undefined,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        published: data.published ?? false,
        translations: {
          create: {
            locale,
            name: data.name,
            address: data.address,
          },
        },
      },
      include: { translations: true },
    });

    invalidateAdminPartnerStoresCache();
    await invalidatePartnerStoresStorefrontCache();

    return { data: mapPartnerStore(store, locale) };
  }

  async updatePartnerStore(
    storeId: string,
    data: {
      name?: string;
      address?: string;
      locale?: string;
      logoUrl?: string | null;
      published?: boolean;
    },
  ) {
    logger.debug("🔄 [ADMIN SERVICE] updatePartnerStore:", storeId, data);

    const store = await db.partnerStore.findUnique({
      where: { id: storeId },
      include: { translations: true },
    });

    if (!store || store.deletedAt) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Store not found",
        detail: `Partner store with id '${storeId}' does not exist`,
      };
    }

    const locale = data.locale ?? "en";
    const updateData: {
      logoUrl?: string | null;
      latitude?: number;
      longitude?: number;
      published?: boolean;
    } = {};

    if (data.logoUrl !== undefined) {
      updateData.logoUrl = data.logoUrl || null;
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }
    if (data.address !== undefined) {
      const coordinates = await geocodePartnerStoreAddress(data.address);
      updateData.latitude = coordinates.latitude;
      updateData.longitude = coordinates.longitude;
    }

    if (Object.keys(updateData).length > 0) {
      await db.partnerStore.update({ where: { id: storeId }, data: updateData });
    }

    if (data.name !== undefined || data.address !== undefined) {
      const translations = Array.isArray(store.translations) ? store.translations : [];
      const existing = translations.find((item) => item.locale === locale);

      if (existing) {
        await db.partnerStoreTranslation.update({
          where: { id: existing.id },
          data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.address !== undefined ? { address: data.address } : {}),
          },
        });
      } else if (data.name !== undefined && data.address !== undefined) {
        await db.partnerStoreTranslation.create({
          data: {
            storeId,
            locale,
            name: data.name,
            address: data.address,
          },
        });
      }
    }

    const updatedStore = await db.partnerStore.findUnique({
      where: { id: storeId },
      include: { translations: true },
    });

    invalidateAdminPartnerStoresCache();
    await invalidatePartnerStoresStorefrontCache();

    return { data: mapPartnerStore(updatedStore!, locale) };
  }

  async deletePartnerStore(storeId: string) {
    logger.debug("🗑️ [ADMIN SERVICE] deletePartnerStore:", storeId);

    const store = await db.partnerStore.findUnique({ where: { id: storeId } });
    if (!store || store.deletedAt) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Store not found",
        detail: `Partner store with id '${storeId}' does not exist`,
      };
    }

    await db.partnerStore.update({
      where: { id: storeId },
      data: { deletedAt: new Date(), published: false },
    });

    invalidateAdminPartnerStoresCache();
    await invalidatePartnerStoresStorefrontCache();

    return { success: true };
  }
}

export const adminPartnerStoresService = new AdminPartnerStoresService();
