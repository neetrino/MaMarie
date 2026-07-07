export interface AdminReferenceCategory {
  id: string;
  title: string;
  slug?: string;
  parentId?: string | null;
  requiresSizes?: boolean;
  published?: boolean;
}

export interface AdminReferenceBrand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
  published?: boolean;
}

export interface AdminReferenceAttributeValue {
  id: string;
  value: string;
  label: string;
  colors?: string[];
  imageUrl?: string | null;
}

export interface AdminReferenceAttribute {
  id: string;
  key: string;
  name: string;
  type: string;
  filterable: boolean;
  values: AdminReferenceAttributeValue[];
}

export interface AdminReferenceSettings {
  defaultCurrency?: string;
  globalDiscount?: number;
  categoryDiscounts?: Record<string, number>;
  brandDiscounts?: Record<string, number>;
  currencyRates?: Record<string, number>;
}
