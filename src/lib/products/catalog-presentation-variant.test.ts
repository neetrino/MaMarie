import { describe, expect, it } from 'vitest';
import type { ProductWithRelations } from '@/lib/services/products-find-query/types';
import {
  parseCatalogPresentationFilters,
  selectCatalogPresentationVariant,
  variantMatchesPresentationFilters,
} from './catalog-presentation-variant';

const baseFilters = {
  colors: ['orange'],
  sizes: [],
  attrs: {},
  lang: 'en',
};

describe('parseCatalogPresentationFilters', () => {
  it('returns null when no variant-scoped filters are active', () => {
    expect(parseCatalogPresentationFilters({})).toBeNull();
  });

  it('parses color filters', () => {
    expect(parseCatalogPresentationFilters({ colors: 'Orange,Blue' })?.colors).toEqual([
      'orange',
      'blue',
    ]);
  });
});

describe('selectCatalogPresentationVariant', () => {
  const variants = [
    {
      id: 'main-red',
      isMain: true,
      position: 0,
      published: true,
      price: 100,
      options: [
        {
          attributeKey: 'color',
          value: 'red',
        },
      ],
    },
    {
      id: 'orange-variant',
      isMain: false,
      position: 1,
      published: true,
      price: 120,
      options: [
        {
          attributeKey: 'color',
          value: 'orange',
        },
      ],
    },
  ] as ProductWithRelations['variants'];

  it('returns main variant when no filters are active', () => {
    expect(selectCatalogPresentationVariant(variants, null)?.id).toBe('main-red');
  });

  it('returns the matching filtered variant', () => {
    expect(selectCatalogPresentationVariant(variants, baseFilters)?.id).toBe('orange-variant');
  });
});

describe('variantMatchesPresentationFilters', () => {
  it('matches color and size together', () => {
    const variant = {
      id: 'v1',
      published: true,
      price: 50,
      options: [
        { attributeKey: 'color', value: 'orange' },
        { attributeKey: 'size', value: 'M' },
      ],
    } as ProductWithRelations['variants'][number];

    expect(
      variantMatchesPresentationFilters(variant, {
        ...baseFilters,
        sizes: ['M'],
      })
    ).toBe(true);

    expect(
      variantMatchesPresentationFilters(variant, {
        ...baseFilters,
        sizes: ['L'],
      })
    ).toBe(false);
  });
});
