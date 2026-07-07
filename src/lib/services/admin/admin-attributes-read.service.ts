import { db } from "@white-shop/db";
import { logger } from "@/lib/utils/logger";
import {
  withAdminAttributesCache,
} from "@/lib/cache/admin-reference-cache";

type AttributeValueRow = {
  id: string;
  value: string;
  colors?: unknown;
  imageUrl?: string | null;
  translations?: Array<{ label: string }>;
};

function parseColorsArray(colorsData: unknown): string[] {
  if (!colorsData) {
    return [];
  }

  if (Array.isArray(colorsData)) {
    return colorsData.filter((color): color is string => typeof color === "string");
  }

  if (typeof colorsData === "string") {
    try {
      const parsed: unknown = JSON.parse(colorsData);
      return Array.isArray(parsed)
        ? parsed.filter((color): color is string => typeof color === "string")
        : [];
    } catch (error: unknown) {
      logger.warn("[ADMIN ATTRIBUTES READ SERVICE] Failed to parse colors JSON", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  if (typeof colorsData === "object") {
    return Array.isArray(colorsData)
      ? colorsData.filter((color): color is string => typeof color === "string")
      : [];
  }

  return [];
}

function mapAttributeValue(value: AttributeValueRow) {
  const valueTranslations = Array.isArray(value.translations) ? value.translations : [];
  const valueTranslation = valueTranslations[0] ?? null;

  return {
    id: value.id,
    value: value.value,
    label: valueTranslation?.label || value.value,
    colors: parseColorsArray(value.colors),
    imageUrl: value.imageUrl || null,
  };
}

class AdminAttributesReadService {
  /** Get attributes (columns managed via Prisma migrations). */
  async getAttributes() {
    return withAdminAttributesCache(async () => this.fetchAttributes());
  }

  private async fetchAttributes() {
    const attributes = await db.attribute.findMany({
      include: {
        translations: {
          where: { locale: "en" },
          take: 1,
        },
        values: {
          include: {
            translations: {
              where: { locale: "en" },
              take: 1,
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return {
      data: attributes.map((attribute) => {
        const translations = Array.isArray(attribute.translations) ? attribute.translations : [];
        const translation = translations[0] ?? null;
        const values = Array.isArray(attribute.values) ? attribute.values : [];

        return {
          id: attribute.id,
          key: attribute.key,
          name: translation?.name || attribute.key,
          type: attribute.type,
          filterable: attribute.filterable,
          values: values.map((value) => mapAttributeValue(value)),
        };
      }),
    };
  }
}

export const adminAttributesReadService = new AdminAttributesReadService();
