import { describe, expect, it } from 'vitest';
import { normalizeProductSlug, parseProductSlugParam } from './parse-product-slug-param';

describe('parseProductSlugParam', () => {
  it('returns plain slug unchanged', () => {
    expect(parseProductSlugParam('spring-vase')).toEqual({
      slug: 'spring-vase',
      variantId: null,
    });
  });

  it('splits slug and variant from a literal colon', () => {
    expect(parseProductSlugParam('sqwswqsqws:cmtbfp0oj000synqr14ts6mlh')).toEqual({
      slug: 'sqwswqsqws',
      variantId: 'cmtbfp0oj000synqr14ts6mlh',
    });
  });

  it('splits slug and variant from a URL-encoded colon', () => {
    expect(parseProductSlugParam('sqwswqsqws%3Acmtbfp0oj000synqr14ts6mlh')).toEqual({
      slug: 'sqwswqsqws',
      variantId: 'cmtbfp0oj000synqr14ts6mlh',
    });
  });

  it('normalizeProductSlug strips variant suffix', () => {
    expect(normalizeProductSlug('sqwswqsqws%3Acmtbfp0oj000synqr14ts6mlh')).toBe('sqwswqsqws');
  });
});
