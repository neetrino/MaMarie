'use client';

import { getAttributeLabel, t } from '../../../lib/i18n';
import type {
  ProductPageSnapshotColor,
  ProductPageSnapshotSize,
} from '../../../lib/product-page-snapshot';
import type { LanguageCode } from '../../../lib/language';
import { getColorHex } from '../../../lib/colorMap';
import { processImageUrl } from '../../../lib/utils/image-utils';

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

          return (
            <div key={color.value} className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                disabled
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-300 transition-all disabled:cursor-default"
                style={processedImageUrl ? undefined : { backgroundColor: colorHex }}
                title={getAttributeLabel(language, 'color', color.value)}
              >
                {processedImageUrl ? (
                  <img
                    src={processedImageUrl}
                    alt={getAttributeLabel(language, 'color', color.value)}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </button>
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
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((size) => {
          const isUnavailable = size.inStock === false;
          const label = size.label ?? getAttributeLabel(language, 'size', size.value);

          return (
            <button
              key={size.value}
              type="button"
              disabled
              className={`min-w-[50px] rounded-lg border-2 px-3 py-2 transition-all disabled:cursor-default ${
                isUnavailable ? 'border-gray-200 opacity-60' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col text-center">
                <span className="text-sm font-medium">{label}</span>
                {isUnavailable ? (
                  <span className="text-xs text-gray-400">({t(language, 'product.outOfStock')})</span>
                ) : null}
              </div>
            </button>
          );
        })}
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
