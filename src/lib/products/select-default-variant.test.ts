import { describe, expect, it } from 'vitest';
import {
  selectDefaultVariant,
  sortVariantsForPresentation,
} from './select-default-variant';

describe('selectDefaultVariant', () => {
  it('prefers isMain over cheaper variants', () => {
    const variants = [
      { id: 'a', price: 10, isMain: false, position: 0 },
      { id: 'b', price: 50, isMain: true, position: 1 },
      { id: 'c', price: 20, isMain: false, position: 2 },
    ];

    expect(selectDefaultVariant(variants)?.id).toBe('b');
  });

  it('falls back to first by position when no main is set', () => {
    const variants = [
      { id: 'expensive', price: 100, isMain: false, position: 2 },
      { id: 'cheap', price: 5, isMain: false, position: 1 },
      { id: 'mid', price: 40, isMain: false, position: 0 },
    ];

    expect(selectDefaultVariant(variants)?.id).toBe('mid');
  });

  it('ignores unpublished when a published main exists', () => {
    const variants = [
      { id: 'draft-main', isMain: true, published: false, position: 0 },
      { id: 'live', isMain: false, published: true, position: 1 },
    ];

    expect(selectDefaultVariant(variants)?.id).toBe('live');
  });
});

describe('sortVariantsForPresentation', () => {
  it('orders main first then by position', () => {
    const sorted = sortVariantsForPresentation([
      { id: 'c', isMain: false, position: 2 },
      { id: 'a', isMain: true, position: 5 },
      { id: 'b', isMain: false, position: 1 },
    ]);

    expect(sorted.map((v) => v.id)).toEqual(['a', 'b', 'c']);
  });
});
