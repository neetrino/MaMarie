import { findOrCreateAttributeValue } from "../../../utils/variant-generator";
import type { Prisma } from "@white-shop/db";

export interface AttributeValueLookup {
  attributeKey: string;
  value: string;
}

/**
 * Variant option for processing
 */
export interface VariantOptionInput {
  attributeKey: string;
  value: string;
  valueId?: string;
}

/**
 * Processed variant option
 */
export interface ProcessedVariantOption {
  valueId?: string;
  attributeKey?: string;
  value?: string;
}

function attributeKeyValueCacheKey(attributeKey: string, value: string): string {
  return `${attributeKey}:${value}`;
}

async function resolveOrCreateValueId(
  attributeKey: string,
  value: string,
  locale: string,
  tx: Prisma.TransactionClient,
  attributeKeyValueCache: Map<string, string>,
): Promise<string | null> {
  const cacheKey = attributeKeyValueCacheKey(attributeKey, value);
  const cached = attributeKeyValueCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const foundValueId = await findOrCreateAttributeValue(attributeKey, value, locale, tx);
  if (foundValueId) {
    attributeKeyValueCache.set(cacheKey, foundValueId);
  }

  return foundValueId;
}

/**
 * Batch-load all attribute values referenced by variant options in a single query.
 */
export async function buildAttributeValueLookupCache(
  variants: Array<{ options?: VariantOptionInput[] }> | undefined,
  tx: Prisma.TransactionClient,
): Promise<Map<string, AttributeValueLookup>> {
  const allValueIds = new Set<string>();

  for (const variant of variants ?? []) {
    for (const opt of variant.options ?? []) {
      if (opt.valueId) {
        allValueIds.add(opt.valueId);
      }
    }
  }

  if (allValueIds.size === 0) {
    return new Map();
  }

  const rows = await tx.attributeValue.findMany({
    where: { id: { in: Array.from(allValueIds) } },
    include: { attribute: true },
  });

  return new Map(
    rows.map((row) => [
      row.id,
      { attributeKey: row.attribute.key, value: row.value },
    ]),
  );
}

function resolveOptionFields(
  opt: VariantOptionInput,
  attributeValueCache: Map<string, AttributeValueLookup>,
): { attributeKey: string | null; value: string | null } {
  if (opt.attributeKey && opt.value) {
    return { attributeKey: opt.attributeKey, value: opt.value };
  }

  if (!opt.valueId) {
    return { attributeKey: null, value: null };
  }

  const cached = attributeValueCache.get(opt.valueId);
  if (cached) {
    return { attributeKey: cached.attributeKey, value: cached.value };
  }

  return { attributeKey: null, value: null };
}

/**
 * Process variant options and build attributes map
 */
export async function processVariantOptions(
  variant: {
    options?: VariantOptionInput[];
    color?: string;
    size?: string;
  },
  locale: string,
  tx: Prisma.TransactionClient,
  attributeValueCache: Map<string, AttributeValueLookup>,
  attributeKeyValueCache: Map<string, string>,
): Promise<{
  options: ProcessedVariantOption[];
  attributesMap: Record<string, Array<{ valueId: string; value: string; attributeKey: string }>>;
}> {
  const options: ProcessedVariantOption[] = [];
  const attributesMap: Record<string, Array<{ valueId: string; value: string; attributeKey: string }>> = {};

  if (variant.options && Array.isArray(variant.options) && variant.options.length > 0) {
    for (const opt of variant.options) {
      let valueId: string | null = null;
      let attributeKey: string | null = null;
      let value: string | null = null;

      if (opt.valueId) {
        valueId = opt.valueId;
        const resolved = resolveOptionFields(opt, attributeValueCache);
        attributeKey = resolved.attributeKey;
        value = resolved.value;
        options.push({ valueId: opt.valueId });
      } else if (opt.attributeKey && opt.value) {
        const foundValueId = await resolveOrCreateValueId(
          opt.attributeKey,
          opt.value,
          locale,
          tx,
          attributeKeyValueCache,
        );
        if (foundValueId) {
          valueId = foundValueId;
          attributeKey = opt.attributeKey;
          value = opt.value;
          options.push({ valueId: foundValueId });
        } else {
          attributeKey = opt.attributeKey;
          value = opt.value;
          options.push({ attributeKey: opt.attributeKey, value: opt.value });
        }
      }

      if (attributeKey && valueId && value) {
        if (!attributesMap[attributeKey]) {
          attributesMap[attributeKey] = [];
        }
        if (!attributesMap[attributeKey].some((item) => item.valueId === valueId)) {
          attributesMap[attributeKey].push({
            valueId,
            value,
            attributeKey,
          });
        }
      }
    }
  } else {
    if (variant.color) {
      const colorValueId = await resolveOrCreateValueId(
        "color",
        variant.color,
        locale,
        tx,
        attributeKeyValueCache,
      );
      if (colorValueId) {
        options.push({ valueId: colorValueId });
        if (!attributesMap.color) {
          attributesMap.color = [];
        }
        attributesMap.color.push({
          valueId: colorValueId,
          value: variant.color,
          attributeKey: "color",
        });
      } else {
        options.push({ attributeKey: "color", value: variant.color });
      }
    }

    if (variant.size) {
      const sizeValueId = await resolveOrCreateValueId(
        "size",
        variant.size,
        locale,
        tx,
        attributeKeyValueCache,
      );
      if (sizeValueId) {
        options.push({ valueId: sizeValueId });
        if (!attributesMap.size) {
          attributesMap.size = [];
        }
        attributesMap.size.push({
          valueId: sizeValueId,
          value: variant.size,
          attributeKey: "size",
        });
      } else {
        options.push({ attributeKey: "size", value: variant.size });
      }
    }
  }

  return { options, attributesMap };
}

/**
 * Parse variant price, stock, and compareAtPrice
 */
export function parseVariantPrices(variant: {
  price: string | number;
  compareAtPrice?: string | number;
  stock: string | number;
}): {
  price: number;
  stock: number;
  compareAtPrice?: number;
} {
  const price = typeof variant.price === "number" ? variant.price : parseFloat(String(variant.price));
  const stock = typeof variant.stock === "number" ? variant.stock : parseInt(String(variant.stock), 10);
  const compareAtPrice =
    variant.compareAtPrice !== undefined && variant.compareAtPrice !== null && variant.compareAtPrice !== ""
      ? typeof variant.compareAtPrice === "number"
        ? variant.compareAtPrice
        : parseFloat(String(variant.compareAtPrice))
      : undefined;

  if (isNaN(price) || price < 0) {
    throw new Error(`Invalid price value: ${variant.price}`);
  }

  return { price, stock, compareAtPrice };
}
