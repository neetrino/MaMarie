import { describe, expect, it } from 'vitest';
import { resolveAttributeValueLabelForLocale } from './reference-locale-display';

describe('resolveAttributeValueLabelForLocale', () => {
  it('shows English label on EN tab without falling back to Armenian', () => {
    const label = resolveAttributeValueLabelForLocale(
      {
        label: 'Մանուշակ',
        value: 'violet',
        translations: [{ locale: 'hy', label: 'Մանուշակ' }],
      },
      'en',
    );

    expect(label).toBe('Violet');
  });

  it('uses Armenian translation on HY tab', () => {
    const label = resolveAttributeValueLabelForLocale(
      {
        label: 'Մանուշակ',
        value: 'violet',
        translations: [
          { locale: 'hy', label: 'Մանուշակ' },
          { locale: 'en', label: 'Violet' },
        ],
      },
      'hy',
    );

    expect(label).toBe('Մանուշակ');
  });
});
