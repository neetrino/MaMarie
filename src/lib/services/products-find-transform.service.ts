import { db } from "@white-shop/db";
import { processImageUrl } from "../utils/image-utils";
import { translations } from "../translations";
import { collectProductColors, collectProductSizes } from "./product-variant-attributes";
import { reviewsService } from "./reviews.service";
import { ProductWithRelations } from "./products-find-query.service";

const DISCOUNT_SETTINGS_CACHE_TTL_MS = 60_000;

interface DiscountSettingsSnapshot {
  globalDiscount: number;
  categoryDiscounts: Record<string, number>;
  brandDiscounts: Record<string, number>;
}

let discountSettingsCache: { expiresAt: number; value: DiscountSettingsSnapshot } | null = null;

async function getDiscountSettingsSnapshot(): Promise<DiscountSettingsSnapshot> {
  const now = Date.now();
  if (discountSettingsCache && discountSettingsCache.expiresAt > now) {
    return discountSettingsCache.value;
  }

  const discountSettings = await db.settings.findMany({
    where: {
      key: {
        in: ["globalDiscount", "categoryDiscounts", "brandDiscounts"],
      },
    },
  });

  const globalDiscount =
    Number(
      discountSettings.find((s: { key: string; value: unknown }) => s.key === "globalDiscount")?.value
    ) || 0;

  const categoryDiscountsSetting = discountSettings.find(
    (s: { key: string; value: unknown }) => s.key === "categoryDiscounts"
  );
  const categoryDiscounts = categoryDiscountsSetting
    ? (categoryDiscountsSetting.value as Record<string, number>) || {}
    : {};

  const brandDiscountsSetting = discountSettings.find(
    (s: { key: string; value: unknown }) => s.key === "brandDiscounts"
  );
  const brandDiscounts = brandDiscountsSetting
    ? (brandDiscountsSetting.value as Record<string, number>) || {}
    : {};

  const value: DiscountSettingsSnapshot = {
    globalDiscount,
    categoryDiscounts,
    brandDiscounts,
  };

  discountSettingsCache = {
    expiresAt: now + DISCOUNT_SETTINGS_CACHE_TTL_MS,
    value,
  };

  return value;
}

const getOutOfStockLabel = (lang: string = "en"): string => {
  const langKey = lang as keyof typeof translations;
  const translation = translations[langKey] || translations.en;
  return translation.stock.outOfStock;
};

class ProductsFindTransformService {
  /**
   * Transform products to response format
   */
  async transformProducts(
    products: ProductWithRelations[],
    lang: string = "en"
  ): Promise<any[]> {
    const [{ globalDiscount, categoryDiscounts, brandDiscounts }, reviewStatsByProductId] =
      await Promise.all([
        getDiscountSettingsSnapshot(),
        reviewsService.getProductReviewStatsBatch(products.map((product) => product.id)),
      ]);

    // Format response
    const data = products.map((product: ProductWithRelations) => {
      // Безопасное получение translation с проверкой на существование массива
      const translations = Array.isArray(product.translations) ? product.translations : [];
      const translation = translations.find((t: { locale: string }) => t.locale === lang) || translations[0] || null;
      
      // Безопасное получение brand translation
      const brandTranslations = product.brand && Array.isArray(product.brand.translations)
        ? product.brand.translations
        : [];
      const brandTranslation = brandTranslations.length > 0
        ? brandTranslations.find((t: { locale: string }) => t.locale === lang) || brandTranslations[0]
        : null;
      
      // Безопасное получение variant
      const variants = Array.isArray(product.variants) ? product.variants : [];
      const variant = variants.length > 0
        ? variants.sort((a: { price: number }, b: { price: number }) => a.price - b.price)[0]
        : null;

      const availableColors = collectProductColors(product, lang);
      const availableSizes = collectProductSizes(product, lang);
      const reviewStats = reviewStatsByProductId.get(product.id) ?? {
        averageRating: 0,
        reviewsCount: 0,
      };

      const originalPrice = variant?.price || 0;
      let finalPrice = originalPrice;
      const productDiscount = product.discountPercent || 0;
      
      // Calculate applied discount with priority: productDiscount > categoryDiscount > brandDiscount > globalDiscount
      let appliedDiscount = 0;
      if (productDiscount > 0) {
        appliedDiscount = productDiscount;
      } else {
        // Check category discounts
        const primaryCategoryId = product.primaryCategoryId;
        if (primaryCategoryId && categoryDiscounts[primaryCategoryId]) {
          appliedDiscount = categoryDiscounts[primaryCategoryId];
        } else {
          // Check brand discounts
          const brandId = product.brandId;
          if (brandId && brandDiscounts[brandId]) {
            appliedDiscount = brandDiscounts[brandId];
          } else if (globalDiscount > 0) {
            appliedDiscount = globalDiscount;
          }
        }
      }

      if (appliedDiscount > 0 && originalPrice > 0) {
        finalPrice = originalPrice * (1 - appliedDiscount / 100);
      }

      // Get categories with translations
      const categories = Array.isArray(product.categories) ? product.categories.map((cat: { id: string; translations?: Array<{ locale: string; slug: string; title: string }> }) => {
        const catTranslations = Array.isArray(cat.translations) ? cat.translations : [];
        const catTranslation = catTranslations.find((t: { locale: string }) => t.locale === lang) || catTranslations[0] || null;
        return {
          id: cat.id,
          slug: catTranslation?.slug || "",
          title: catTranslation?.title || "",
        };
      }) : [];

      return {
        id: product.id,
        slug: translation?.slug || "",
        title: translation?.title || "",
        defaultVariantId: variant?.id ?? null,
        brand: product.brand
          ? {
              id: product.brand.id,
              name: brandTranslation?.name || "",
              logoUrl: product.brand.logoUrl || null,
            }
          : null,
        categories,
        price: finalPrice,
        originalPrice: appliedDiscount > 0 ? originalPrice : variant?.compareAtPrice || null,
        compareAtPrice: variant?.compareAtPrice || null,
        discountPercent: appliedDiscount > 0 ? appliedDiscount : null,
        image: (() => {
          // Use unified image utilities to get first valid main image
          if (!Array.isArray(product.media) || product.media.length === 0) {
            return null;
          }
          
          // Process first image - cast JsonValue to ImageUrlInput
          const firstImage = processImageUrl(product.media[0] as string | null | undefined | { url?: string; src?: string; value?: string });
          return firstImage || null;
        })(),
        inStock: (variant?.stock || 0) > 0,
        labels: (() => {
          // Map existing labels
          const existingLabels = Array.isArray(product.labels) ? product.labels.map((label: { id: string; type: string; value: string; position: string; color: string | null }) => ({
            id: label.id,
            type: label.type,
            value: label.value,
            position: label.position,
            color: label.color,
          })) : [];
          
          // Check if product is out of stock
          const isOutOfStock = (variant?.stock || 0) <= 0;
          
          // If out of stock, add "Out of Stock" label
          if (isOutOfStock) {
            // Check if "Out of Stock" label already exists
            const outOfStockText = getOutOfStockLabel(lang);
            const hasOutOfStockLabel = existingLabels.some(
              (label) => label.value.toLowerCase() === outOfStockText.toLowerCase() ||
                         label.value.toLowerCase().includes('out of stock') ||
                         label.value.toLowerCase().includes('արտադրված') ||
                         label.value.toLowerCase().includes('нет в наличии') ||
                         label.value.toLowerCase().includes('არ არის მარაგში')
            );
            
            if (!hasOutOfStockLabel) {
              // Check if top-left position is available, otherwise use top-right
              const topLeftOccupied = existingLabels.some((l) => l.position === 'top-left');
              const position = topLeftOccupied ? 'top-right' : 'top-left';
              
              existingLabels.push({
                id: `out-of-stock-${product.id}`,
                type: 'text',
                value: outOfStockText,
                position: position as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
                color: '#6B7280', // Gray color for out of stock
              });
              
            }
          }
          
          return existingLabels;
        })(),
        colors: availableColors,
        sizes: availableSizes,
        averageRating: reviewStats.averageRating,
        reviewsCount: reviewStats.reviewsCount,
      };
    });

    return data;
  }
}

export const productsFindTransformService = new ProductsFindTransformService();
                                                    
