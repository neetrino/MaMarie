import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import type {
  CatalogFilterAggregation,
  CatalogFilterColorOption,
  CatalogFilterSizeOption,
} from './products-filters-aggregate';

export const COLOR_ATTRIBUTE_KEY = 'color';
export const SIZE_ATTRIBUTE_KEY = 'size';
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export function pickFacetTranslation(
  rows: Array<{ locale: string; name?: string; label?: string }>,
  lang: string,
  fallback: string
): string {
  const match = rows.find((row) => row.locale === lang) ?? rows[0];
  return match?.name || match?.label || fallback;
}

export function readColorHex(colors: Prisma.JsonValue): string[] | null {
  if (!Array.isArray(colors) || !colors.every((item): item is string => typeof item === 'string')) {
    return null;
  }
  return colors;
}

export function sortSizeFacetOptions(sizes: CatalogFilterSizeOption[]): CatalogFilterSizeOption[] {
  return [...sizes].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.value as (typeof SIZE_ORDER)[number]);
    const bIndex = SIZE_ORDER.indexOf(b.value as (typeof SIZE_ORDER)[number]);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) {
      return -1;
    }
    if (bIndex !== -1) {
      return 1;
    }
    const aNum = Number(a.value);
    const bNum = Number(b.value);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.value.localeCompare(b.value);
  });
}

export async function loadFilterableAttributes() {
  return db.attribute.findMany({
    where: { filterable: true },
    orderBy: { position: 'asc' },
    select: {
      key: true,
      translations: { select: { locale: true, name: true } },
      values: {
        orderBy: { position: 'asc' },
        select: {
          value: true,
          imageUrl: true,
          colors: true,
          translations: { select: { locale: true, label: true } },
        },
      },
    },
  });
}

function upsertDefinedColor(
  colorMap: Map<string, CatalogFilterColorOption>,
  label: string,
  imageUrl: string | null,
  colors: Prisma.JsonValue
): void {
  const mapKey = label.toLowerCase();
  if (colorMap.has(mapKey)) {
    return;
  }
  colorMap.set(mapKey, {
    value: mapKey,
    label,
    count: 0,
    imageUrl,
    colors: readColorHex(colors),
  });
}

/** Adds admin-defined filterable values that are missing from used variant options. */
export function mergeDefinedAttributeValues(
  facets: Pick<CatalogFilterAggregation, 'colors' | 'sizes' | 'attributes'>,
  attributes: Awaited<ReturnType<typeof loadFilterableAttributes>>,
  lang: string
): Pick<CatalogFilterAggregation, 'colors' | 'sizes' | 'attributes'> {
  const colorMap = new Map(facets.colors.map((item) => [item.value.toLowerCase(), item]));
  const sizeMap = new Map(facets.sizes.map((item) => [item.value, item.count]));
  const groups = new Map(facets.attributes.map((group) => [group.key, group]));

  for (const attribute of attributes) {
    for (const value of attribute.values) {
      const label = pickFacetTranslation(value.translations, lang, '') || value.value.trim();
      if (!label) {
        continue;
      }
      if (attribute.key === COLOR_ATTRIBUTE_KEY) {
        upsertDefinedColor(colorMap, label, value.imageUrl, value.colors);
        continue;
      }
      if (attribute.key === SIZE_ATTRIBUTE_KEY) {
        if (!sizeMap.has(label)) {
          sizeMap.set(label, 0);
        }
        continue;
      }
      const group = groups.get(attribute.key) ?? {
        key: attribute.key,
        name: pickFacetTranslation(attribute.translations, lang, attribute.key),
        values: [],
      };
      if (!group.values.some((item) => item.value.toLowerCase() === label.toLowerCase())) {
        group.values.push({ value: label, label, count: 0 });
      }
      groups.set(attribute.key, group);
    }
  }

  return {
    colors: Array.from(colorMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    sizes: sortSizeFacetOptions(
      Array.from(sizeMap.entries()).map(([value, count]) => ({ value, count }))
    ),
    attributes: Array.from(groups.values())
      .map((group) => ({
        ...group,
        values: group.values.sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
