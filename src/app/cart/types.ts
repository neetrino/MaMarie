/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  variant: {
    id: string;
    sku: string;
    stock?: number;
    product: {
      id: string;
      title: string;
      slug: string;
      image?: string | null;
    };
  };
  quantity: number;
  price: number;
  originalPrice?: number | null;
  total: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
}

/**
 * Cart interface
 */
export interface Cart {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  itemsCount: number;
}

/**
 * Guest cart item interface
 */
export interface GuestCartItem {
  productId: string;
  productSlug?: string;
  variantId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price?: number;
  /** Cached from product card for instant cart drawer display. */
  title?: string;
  image?: string | null;
  stock?: number;
  originalPrice?: number | null;
  sku?: string;
}




