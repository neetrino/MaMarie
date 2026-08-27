import { describe, expect, it } from 'vitest';
import { toSlug, transliterateToLatin } from './slug';

describe('toSlug transliteration', () => {
  it('transliterates Armenian to Latin slug', () => {
    expect(toSlug('Մարիա')).toBe('maria');
    expect(toSlug('Հավաքածու')).toBe('havaqatsu');
  });

  it('transliterates Cyrillic to Latin slug', () => {
    expect(toSlug('Коллекция Весна')).toBe('kollektsiya-vesna');
  });

  it('keeps English names as hyphenated slug', () => {
    expect(toSlug('Spring Collection')).toBe('spring-collection');
  });

  it('transliterateToLatin lowercases and maps Armenian digraph ու', () => {
    expect(transliterateToLatin('Ուրիշ')).toBe('urish');
  });
});
