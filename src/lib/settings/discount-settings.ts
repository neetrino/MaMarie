import { db } from '@white-shop/db';
import { revalidateTag, unstable_cache } from 'next/cache';

const DISCOUNT_SETTINGS_KEYS = ['globalDiscount', 'categoryDiscounts', 'brandDiscounts'] as const;
const DISCOUNT_SETTINGS_CACHE_TAG = 'settings:discounts';
const DISCOUNT_SETTINGS_REVALIDATE_SECONDS = 60;

export interface DiscountSettings {
  globalDiscount: number;
  categoryDiscounts: Record<string, number>;
  brandDiscounts: Record<string, number>;
}

function readDiscountMap(value: unknown): Record<string, number> {
  return value && typeof value === 'object' ? (value as Record<string, number>) : {};
}

async function loadDiscountSettings(): Promise<DiscountSettings> {
  const rows = await db.settings.findMany({
    where: { key: { in: [...DISCOUNT_SETTINGS_KEYS] } },
    select: { key: true, value: true },
  });
  const byKey = new Map(rows.map((row) => [row.key, row.value]));

  return {
    globalDiscount: Number(byKey.get('globalDiscount')) || 0,
    categoryDiscounts: readDiscountMap(byKey.get('categoryDiscounts')),
    brandDiscounts: readDiscountMap(byKey.get('brandDiscounts')),
  };
}

/** Storefront discount settings — shared by catalog and PDP so both always price identically. */
export const getDiscountSettings = unstable_cache(
  loadDiscountSettings,
  ['storefront-discount-settings-v2'],
  { revalidate: DISCOUNT_SETTINGS_REVALIDATE_SECONDS, tags: [DISCOUNT_SETTINGS_CACHE_TAG] },
);

export function invalidateDiscountSettingsCache(): void {
  revalidateTag(DISCOUNT_SETTINGS_CACHE_TAG, { expire: 0 });
}
