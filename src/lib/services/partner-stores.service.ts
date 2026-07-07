import { db } from "@white-shop/db";

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
  position: number;
  translations?: PartnerStoreTranslationRow[];
}

function mapPublishedPartnerStore(store: PartnerStoreRow, locale: string) {
  const translations = Array.isArray(store.translations) ? store.translations : [];
  const translation =
    translations.find((item) => item.locale === locale) ?? translations[0] ?? null;

  return {
    id: store.id,
    slug: store.slug,
    name: translation?.name ?? "",
    address: translation?.address ?? "",
    logoUrl: store.logoUrl,
    latitude: store.latitude,
    longitude: store.longitude,
    position: store.position,
  };
}

class PartnerStoresService {
  async getPublishedPartnerStores(locale: string) {
    const stores = await db.partnerStore.findMany({
      where: {
        deletedAt: null,
        published: true,
      },
      include: {
        translations: {
          where: { locale: { in: [locale, "en", "hy"] } },
        },
      },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    return {
      data: stores.map((store) => mapPublishedPartnerStore(store, locale)),
    };
  }
}

export const partnerStoresService = new PartnerStoresService();
