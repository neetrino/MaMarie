import { NextRequest, NextResponse } from "next/server";
import { db } from "@white-shop/db";
import { extractMediaUrl } from "@/lib/utils/extractMediaUrl";
import { logger } from "@/lib/utils/logger";

interface GuestCartItemInput {
  productId: string;
  productSlug?: string;
  variantId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price?: number;
}

interface GuestCartRequestBody {
  items?: GuestCartItemInput[];
  lang?: string;
}

interface GuestCartVariant {
  id: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

interface GuestCartProduct {
  id: string;
  title: string;
  slug: string;
  image: string | null;
}

interface GuestCartLine {
  id: string;
  variant: GuestCartVariant & {
    product: GuestCartProduct;
  };
  quantity: number;
  price: number;
  originalPrice: number | null;
  total: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
}

interface GuestCartResponse {
  cart: {
    id: string;
    items: GuestCartLine[];
    totals: {
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
      currency: string;
    };
    itemsCount: number;
  } | null;
  normalizedItems: GuestCartItemInput[];
}

function pickFirstImage(media: unknown): string | null {
  return extractMediaUrl(media);
}

function sanitizeItems(items: GuestCartItemInput[] | undefined): GuestCartItemInput[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => typeof item?.productId === "string" && typeof item?.variantId === "string")
    .map((item) => ({
      productId: item.productId,
      productSlug: typeof item.productSlug === "string" ? item.productSlug : undefined,
      variantId: item.variantId,
      quantity: Number.isFinite(item.quantity) && item.quantity > 0 ? Math.floor(item.quantity) : 1,
      selectedColor: typeof item.selectedColor === "string" ? item.selectedColor : undefined,
      selectedSize: typeof item.selectedSize === "string" ? item.selectedSize : undefined,
      price: typeof item.price === "number" ? item.price : undefined,
    }));
}

function extractSelectedOption(
  options: Array<{
    attributeKey: string | null;
    value: string | null;
    attributeValue: {
      value: string;
      attribute: {
        key: string;
      };
      translations: Array<{ locale: string; label: string }>;
    } | null;
  }>,
  key: string,
  lang: string,
): string | undefined {
  const selectedOption = options.find((option) => {
    const attributeKey = option.attributeKey?.toLowerCase().trim();
    const nestedAttributeKey = option.attributeValue?.attribute?.key?.toLowerCase().trim();
    return attributeKey === key || nestedAttributeKey === key;
  });
  if (!selectedOption) {
    return undefined;
  }

  const translatedLabel = selectedOption.attributeValue?.translations.find(
    (translation) => translation.locale === lang,
  )?.label;
  return translatedLabel || selectedOption.value || selectedOption.attributeValue?.value || undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GuestCartRequestBody;
    const items = sanitizeItems(body.items);
    const lang = typeof body.lang === "string" && body.lang.trim() ? body.lang : "en";

    if (items.length === 0) {
      const empty: GuestCartResponse = {
        cart: null,
        normalizedItems: [],
      };
      return NextResponse.json(empty);
    }

    const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));
    const products = await db.product.findMany({
      where: {
        id: { in: uniqueProductIds },
        published: true,
        deletedAt: null,
      },
      select: {
        id: true,
        media: true,
        translations: {
          select: {
            locale: true,
            title: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            sku: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            options: {
              select: {
                attributeKey: true,
                value: true,
                attributeValue: {
                  select: {
                    value: true,
                    attribute: {
                      select: {
                        key: true,
                      },
                    },
                    translations: {
                      select: {
                        locale: true,
                        label: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const normalizedItems: GuestCartItemInput[] = [];
    const cartItems: GuestCartLine[] = [];

    items.forEach((item, index) => {
      const product = productMap.get(item.productId);
      if (!product) {
        return;
      }

      const selectedVariant =
        product.variants.find((variant) => variant.id === item.variantId) ?? product.variants[0];

      if (!selectedVariant) {
        return;
      }

      const preferredTranslation =
        product.translations.find((translation) => translation.locale === lang) ?? product.translations[0];

      const productSlug =
        (preferredTranslation?.slug && preferredTranslation.slug.trim()) ||
        (item.productSlug && item.productSlug.trim()) ||
        "";

      normalizedItems.push({
        productId: item.productId,
        productSlug: productSlug || undefined,
        variantId: selectedVariant.id,
        quantity: item.quantity,
        selectedColor: extractSelectedOption(selectedVariant.options, "color", lang) ?? item.selectedColor,
        selectedSize: extractSelectedOption(selectedVariant.options, "size", lang) ?? item.selectedSize,
        price: selectedVariant.price,
      });

      cartItems.push({
        id: `${item.productId}-${selectedVariant.id}-${index}`,
        variant: {
          id: selectedVariant.id,
          sku: selectedVariant.sku,
          price: selectedVariant.price,
          compareAtPrice: selectedVariant.compareAtPrice,
          stock: selectedVariant.stock,
          product: {
            id: product.id,
            title: preferredTranslation?.title || "Product",
            slug: productSlug,
            image: pickFirstImage(product.media),
          },
        },
        quantity: item.quantity,
        price: selectedVariant.price,
        originalPrice: selectedVariant.compareAtPrice,
        total: selectedVariant.price * item.quantity,
        selectedColor: extractSelectedOption(selectedVariant.options, "color", lang) ?? item.selectedColor ?? null,
        selectedSize: extractSelectedOption(selectedVariant.options, "size", lang) ?? item.selectedSize ?? null,
      });
    });

    if (cartItems.length === 0) {
      const empty: GuestCartResponse = {
        cart: null,
        normalizedItems: [],
      };
      return NextResponse.json(empty);
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const response: GuestCartResponse = {
      cart: {
        id: "guest-cart",
        items: cartItems,
        totals: {
          subtotal,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: subtotal,
          currency: "AMD",
        },
        itemsCount,
      },
      normalizedItems,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    logger.error("[CART][GUEST] Failed to build guest cart", { error });
    return NextResponse.json(
      {
        type: "https://api.shop.am/problems/internal-error",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to load guest cart",
      },
      { status: 500 }
    );
  }
}

