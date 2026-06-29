/** Figma shop sidebar — «Հագուստի տեսակ» filter options (`51:741`). */
export interface ProductsCatalogClothingTypeOption {
  slug: string;
  labelKey: string;
}

export const PRODUCTS_CATALOG_CLOTHING_TYPE_OPTIONS: ProductsCatalogClothingTypeOption[] = [
  { slug: 'dress', labelKey: 'products.catalog.filters.clothingTypes.dress' },
  { slug: 'romper', labelKey: 'products.catalog.filters.clothingTypes.romper' },
  { slug: 'set', labelKey: 'products.catalog.filters.clothingTypes.set' },
  {
    slug: 'top-pants',
    labelKey: 'products.catalog.filters.clothingTypes.topPants',
  },
  {
    slug: 'top-half-dress',
    labelKey: 'products.catalog.filters.clothingTypes.topHalfDress',
  },
  {
    slug: 'top-shorts',
    labelKey: 'products.catalog.filters.clothingTypes.topShorts',
  },
  {
    slug: 'sport-set',
    labelKey: 'products.catalog.filters.clothingTypes.sportSet',
  },
];
