export interface AdminReferenceCategory {
  id: string;
  title: string;
  slug?: string;
  parentId?: string | null;
  parentIds?: string[];
  requiresSizes?: boolean;
  published?: boolean;
  translations?: Array<{ locale: string; title: string; slug?: string }>;
}

export interface AdminReferenceBrand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
  published?: boolean;
  translations?: Array<{ locale: string; name: string }>;
}

export interface AdminReferenceAttributeValue {
  id: string;
  value: string;
  label: string;
  colors?: string[];
  imageUrl?: string | null;
  translations?: Array<{ locale: string; label: string }>;
}

export interface AdminReferenceAttribute {
  id: string;
  key: string;
  name: string;
  type: string;
  filterable: boolean;
  translations?: Array<{ locale: string; name: string }>;
  values: AdminReferenceAttributeValue[];
}

export interface AdminReferenceSettings {
  defaultCurrency?: string;
  globalDiscount?: number;
  categoryDiscounts?: Record<string, number>;
  brandDiscounts?: Record<string, number>;
  currencyRates?: Record<string, number>;
  /** When false, storefront hides the partner stores page and nav entry. */
  storesPageEnabled?: boolean;
}
