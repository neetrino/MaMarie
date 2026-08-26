import { describe, expect, it } from 'vitest';
import { computeProductGalleryUrls } from './product-gallery-urls';
import { productMediaImageApiPath, variantImageApiPath } from '../../utils/storefront-image-url';

const DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('computeProductGalleryUrls', () => {
  it('uses product media API for inline product photos', () => {
    expect(computeProductGalleryUrls('prod_1', [DATA_URL], [])).toEqual([
      productMediaImageApiPath('prod_1', 0),
    ]);
  });

  it('uses variant image API when media is empty', () => {
    expect(
      computeProductGalleryUrls('prod_1', [], [
        { id: 'var_1', imageUrl: DATA_URL, position: 0 },
      ]),
    ).toEqual([variantImageApiPath('var_1')]);
  });
});
