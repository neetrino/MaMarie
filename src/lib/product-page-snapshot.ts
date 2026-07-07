import { getStoredCurrency, type CurrencyCode } from './currency';
import { getStoredLanguage, type LanguageCode } from './language';
import type { ProductLabel } from '../components/ProductLabels';

const PRODUCT_PAGE_SNAPSHOT_KEY = 'mamarie:pdp-entry-snapshot';
const SNAPSHOT_MAX_AGE_MS = 2 * 60 * 1000;

export interface ProductPageSnapshotColor {
  value: string;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export interface ProductPageSnapshotSize {
  value: string;
  label?: string;
  inStock?: boolean;
}

export interface ProductPageSnapshot {
  slug: string;
  imageUrl: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  brandName?: string | null;
  brandLogoUrl?: string | null;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  currency: CurrencyCode;
  language: LanguageCode;
  colors?: ProductPageSnapshotColor[];
  sizes?: ProductPageSnapshotSize[];
  labels?: ProductLabel[];
  averageRating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  createdAt: number;
}

export interface ProductCardSnapshotSource {
  slug: string;
  title: string;
  image: string | null;
  subtitle?: string | null;
  description?: string | null;
  brandName?: string | null;
  brandLogoUrl?: string | null;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  currency?: CurrencyCode;
  language?: LanguageCode;
  colors?: ProductPageSnapshotColor[];
  sizes?: ProductPageSnapshotSize[];
  labels?: ProductLabel[];
  averageRating?: number;
  reviewsCount?: number;
  inStock?: boolean;
}

function isFreshSnapshot(snapshot: ProductPageSnapshot): boolean {
  return Date.now() - snapshot.createdAt <= SNAPSHOT_MAX_AGE_MS;
}

function isValidSnapshot(snapshot: ProductPageSnapshot): boolean {
  return Boolean(snapshot.slug && snapshot.imageUrl && snapshot.title && Number.isFinite(snapshot.price));
}

export function writeProductPageSnapshotFromCard(source: ProductCardSnapshotSource): void {
  if (typeof window === 'undefined' || !source.image) {
    return;
  }

  const snapshot: ProductPageSnapshot = {
    slug: source.slug,
    imageUrl: source.image,
    title: source.title,
    subtitle: source.subtitle ?? null,
    description: source.description ?? null,
    brandName: source.brandName ?? null,
    brandLogoUrl: source.brandLogoUrl ?? null,
    price: source.price,
    originalPrice: source.originalPrice ?? null,
    compareAtPrice: source.compareAtPrice ?? null,
    discountPercent: source.discountPercent ?? null,
    currency: source.currency ?? getStoredCurrency(),
    language: source.language ?? getStoredLanguage(),
    colors: source.colors ?? [],
    sizes: source.sizes ?? [],
    labels: source.labels ?? [],
    averageRating: source.averageRating ?? 0,
    reviewsCount: source.reviewsCount ?? 0,
    inStock: source.inStock ?? true,
    createdAt: Date.now(),
  };

  window.sessionStorage.setItem(PRODUCT_PAGE_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function readProductPageSnapshot(slug?: string): ProductPageSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(PRODUCT_PAGE_SNAPSHOT_KEY);
  if (!raw) {
    return null;
  }

  try {
    const snapshot = JSON.parse(raw) as ProductPageSnapshot;
    if (!isValidSnapshot(snapshot) || !isFreshSnapshot(snapshot)) {
      window.sessionStorage.removeItem(PRODUCT_PAGE_SNAPSHOT_KEY);
      return null;
    }
    return slug && snapshot.slug !== slug ? null : snapshot;
  } catch {
    window.sessionStorage.removeItem(PRODUCT_PAGE_SNAPSHOT_KEY);
    return null;
  }
}
