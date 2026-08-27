export interface Brand {
  id: string;
  name: string;
  slug: string;
  translations?: Array<{ locale: string; name: string }>;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  parentIds?: string[];
  requiresSizes?: boolean;
  translations?: Array<{ locale: string; title: string; slug?: string }>;
}

export interface Attribute {
  id: string;
  key: string;
  name: string;
  type: string;
  filterable?: boolean;
  translations?: Array<{ locale: string; name: string }>;
  values: Array<{
    id: string;
    value: string;
    label: string;
    colors?: string[];
    imageUrl?: string | null;
    translations?: Array<{ locale: string; label: string }>;
  }>;
}

// Color data with images, stock, price, and sizes for each color
export interface ColorData {
  colorValue: string;
  colorLabel: string;
  images: string[]; // Массив изображений для этого цвета (file upload)
  stock: string; // Base stock for color (if no sizes)
  price?: string; // Цена для этого конкретного цвета (опционально)
  compareAtPrice?: string; // Старая цена для этого конкретного цвета (скидка)
  sizes: string[]; // Размеры для этого цвета
  sizeStocks: Record<string, string>; // Stock для каждого размера этого цвета: { "S": "10", "M": "5" }
  sizePrices?: Record<string, string>; // Price для каждого размера этого цвета: { "S": "100", "M": "120" }
  sizeCompareAtPrices?: Record<string, string>; // CompareAtPrice для каждого размера: { "S": "150", "M": "180" }
  sizeLabels?: Record<string, string>; // Original labels for manually added sizes: { "s": "S" }
  isFeatured?: boolean; // Является ли этот цвет основным для товара
}

// Unified variant structure - один variant с несколькими цветами
// Note: sizes are now managed at color level, not variant level
export interface Variant {
  id: string;
  price: string; // Общая цена для всех цветов (fallback, если color-ի price չկа)
  compareAtPrice: string;
  sku: string;
  sizes?: string[]; 
  sizeStocks?: Record<string, string>;
  sizeLabels?: Record<string, string>;
  colors: ColorData[]; // Массив цветов, каждый со своими изображениями, stock, price, и sizes
}

export interface ProductLabel {
  id?: string;
  type: 'text' | 'percentage';
  value: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string | null;
}

export interface ProductTranslationRow {
  locale: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  descriptionHtml?: string | null;
}

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  descriptionHtml?: string;
  translations?: ProductTranslationRow[];
  brandId?: string | null;
  primaryCategoryId?: string | null;
  categoryIds?: string[];
  attributeIds?: string[]; // All attribute IDs that this product has
  published: boolean;
  featured?: boolean;
  media?: string[];
  labels?: ProductLabel[];
  variants?: Array<{
    id?: string;
    price: string;
    compareAtPrice?: string;
    stock: string;
    sku?: string;
    color?: string;
    size?: string;
    imageUrl?: string;
    published?: boolean;
  }>;
}

export interface GeneratedVariant {
  id: string; // Unique ID for this variant
  selectedValueIds: string[]; // Array of selected value IDs from all attributes
  price: string;
  compareAtPrice: string;
  stock: string;
  sku: string;
  /** Ordered gallery images for this variant (persisted as comma-separated imageUrl). */
  images: string[];
  isMain?: boolean;
}

/** Primary preview image for a generated variant. */
export function getGeneratedVariantPrimaryImage(variant: GeneratedVariant): string | null {
  return variant.images[0] ?? null;
}

/** Join variant images for API payload (existing CSV imageUrl storage). */
export function joinGeneratedVariantImages(variant: GeneratedVariant): string | undefined {
  return variant.images.length > 0 ? variant.images.join(',') : undefined;
}


