import { describe, expect, it } from 'vitest';
import {
  parseCatalogAttrsParam,
  serializeCatalogAttrsParam,
  toggleCatalogAttrValue,
} from './products-catalog-attrs';

describe('catalog attrs query param', () => {
  it('round-trips keys and values in stable order', () => {
    const serialized = serializeCatalogAttrsParam({
      season: ['winter', 'summer'],
      material: ['cotton'],
    });
    expect(serialized).toBe('material:cotton;season:summer|winter');
    expect(parseCatalogAttrsParam(serialized)).toEqual({
      material: ['cotton'],
      season: ['summer', 'winter'],
    });
  });

  it('toggles a value on and off', () => {
    const added = toggleCatalogAttrValue({}, 'material', 'cotton');
    expect(serializeCatalogAttrsParam(added)).toBe('material:cotton');
    expect(serializeCatalogAttrsParam(toggleCatalogAttrValue(added, 'material', 'cotton'))).toBeUndefined();
  });
});
