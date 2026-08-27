'use client';

import {
  CLAY_PRIMARY_BUTTON_CLASS,
  getClayPrimaryButtonCompactStyle,
} from '../../../constants/clay-primary-button';
import { HERO_GENDER_BUTTON_BOYS_BG_COLOR } from '../../../constants/hero';
import { t } from '../../../lib/i18n';
import type {
  ProductPageSnapshotColor,
  ProductPageSnapshotSize,
} from '../../../lib/product-page-snapshot';
import type { LanguageCode } from '../../../lib/language';
import { getColorHex } from '../../../lib/colorMap';
import { processImageUrl } from '../../../lib/utils/image-utils';
import { PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX } from './constants';
import { resolveAttributeValueDisplayLabel } from './utils/attribute-display-label';

interface ProductPageSnapshotAttributesProps {
  colors?: ProductPageSnapshotColor[];
  sizes?: ProductPageSnapshotSize[];
  language: LanguageCode;
}

function SnapshotColorOptions({
  colors,
  language,
}: {
  colors: ProductPageSnapshotColor[];
  language: LanguageCode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase text-blue-600">{t(language, 'product.color')}</label>
      <div className="flex flex-wrap gap-1.5 items-center">
        {colors.map((color) => {
          const processedImageUrl = color.imageUrl ? processImageUrl(color.imageUrl) : null;
          const colorHex = color.colors?.[0] ?? getColorHex(color.value);
          const colorLabel = resolveAttributeValueDisplayLabel(
            language,
            'color',
            color.value,
            color.label,
          );

          return (
            <div key={color.value} className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                disabled
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-300 transition-all disabled:cursor-default"
                style={processedImageUrl ? undefined : { backgroundColor: colorHex }}
                title={colorLabel}
              >
                {processedImageUrl ? (
                  <img
                    src={processedImageUrl}
                    alt={colorLabel}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </button>
              <span className="max-w-[2.5rem] text-center text-xs leading-tight text-gray-700 line-clamp-2">
                {colorLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SnapshotSizeOptions({
  sizes,
  language,
}: {
  sizes: ProductPageSnapshotSize[];
  language: LanguageCode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase text-blue-600">{t(language, 'product.size')}</label>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
        {sizes.map((size) => {
          const isUnavailable = size.inStock === false;
          const label = resolveAttributeValueDisplayLabel(
            language,
            'size',
            size.value,
            size.label,
          );

          return (
            <button
              key={size.value}
              type="button"
              disabled
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-all disabled:cursor-default ${
                isUnavailable ? 'border-gray-200 opacity-60' : 'border-gray-300'
              }`}
              title={label}
            >
              {label}
            </button>
          );
        })}
        </div>
        <span
          className={`${CLAY_PRIMARY_BUTTON_CLASS} ml-auto shrink-0 self-center pointer-events-none opacity-60`}
          style={{
            ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_BOYS_BG_COLOR),
            height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
          }}
        >
          {t(language, 'product.sizeGuide.open')}
        </span>
      </div>
    </div>
  );
}

export function ProductPageSnapshotAttributes({
  colors,
  sizes,
  language,
}: ProductPageSnapshotAttributesProps) {
  const colorOptions = colors ?? [];
  const sizeOptions = sizes ?? [];
  const hasColors = colorOptions.length > 0;
  const hasSizes = sizeOptions.length > 0;

  if (!hasColors && !hasSizes) {
    return null;
  }

  return (
    <div className="space-y-4">
      {hasColors ? <SnapshotColorOptions colors={colorOptions} language={language} /> : null}
      {hasSizes ? <SnapshotSizeOptions sizes={sizeOptions} language={language} /> : null}
    </div>
  );
}
