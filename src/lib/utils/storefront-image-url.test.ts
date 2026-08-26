import { describe, expect, it } from 'vitest';
import {
  mapProductMediaToStorefrontUrls,
  productMediaImageApiPath,
  toProductMediaStorefrontUrl,
  toVariantStorefrontImageUrl,
  variantImageApiPath,
} from './storefront-image-url';

const DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('toProductMediaStorefrontUrl', () => {
  it('rewrites inline data images to the product media API', () => {
    expect(toProductMediaStorefrontUrl('prod_1', 0, DATA_URL)).toBe(
      productMediaImageApiPath('prod_1', 0),
    );
  });

  it('keeps http URLs as-is', () => {
    expect(toProductMediaStorefrontUrl('prod_1', 0, 'https://cdn.example/a.jpg')).toBe(
      'https://cdn.example/a.jpg',
    );
  });
});

describe('mapProductMediaToStorefrontUrls', () => {
  it('maps each media index', () => {
    expect(mapProductMediaToStorefrontUrls('prod_1', [DATA_URL, 'https://cdn.example/b.jpg'])).toEqual([
      productMediaImageApiPath('prod_1', 0),
      'https://cdn.example/b.jpg',
    ]);
  });
});

describe('toVariantStorefrontImageUrl', () => {
  it('rewrites inline data images to the variant image API', () => {
    expect(toVariantStorefrontImageUrl('var_1', DATA_URL)).toBe(variantImageApiPath('var_1'));
  });
});
