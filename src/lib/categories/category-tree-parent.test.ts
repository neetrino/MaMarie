import { describe, expect, it } from 'vitest';
import { getCategoryTreeParentId, isCategoryIdFilterValue } from './category-tree-parent';

describe('getCategoryTreeParentId', () => {
  it('returns undefined for a root treeKey', () => {
    expect(getCategoryTreeParentId('cat_root')).toBeUndefined();
  });

  it('returns the parent id for a nested treeKey', () => {
    expect(getCategoryTreeParentId('girlsId/dressesId')).toBe('girlsId');
  });

  it('returns the immediate parent for deeper paths', () => {
    expect(getCategoryTreeParentId('a/b/c')).toBe('b');
  });
});

describe('isCategoryIdFilterValue', () => {
  it('detects cuid-like ids and rejects slugs', () => {
    expect(isCategoryIdFilterValue('clxyzabcdefghijklmnopqrst')).toBe(true);
    expect(isCategoryIdFilterValue('dresses')).toBe(false);
    expect(isCategoryIdFilterValue('girls-dresses')).toBe(false);
  });
});
