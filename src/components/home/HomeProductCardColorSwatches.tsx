import {
  HOME_PRODUCT_CARD_SWATCH_GAP_PX,
  HOME_PRODUCT_CARD_SWATCH_SIZE_PX,
} from '../../constants/home-sections';
import { homeProductCardLayoutPx } from '../../lib/home-product-card-layout';
import { getColorHex } from '../../lib/colorMap';
import type { ProductColorOption } from '../../lib/services/product-variant-attributes';

interface HomeProductCardColorSwatchesProps {
  colors?: ProductColorOption[];
  maxVisible?: number;
  layoutWidthPx?: number;
}

function resolveSwatchColor(color: ProductColorOption): string {
  if (color.colors && color.colors.length > 0) {
    return color.colors[0];
  }
  return getColorHex(color.value);
}

export function HomeProductCardColorSwatches({
  colors,
  maxVisible = 4,
  layoutWidthPx,
}: HomeProductCardColorSwatchesProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);
  const visibleColors = colors.slice(0, maxVisible);

  return (
    <div
      className="flex items-center"
      style={{ gap: lp(HOME_PRODUCT_CARD_SWATCH_GAP_PX), height: lp(HOME_PRODUCT_CARD_SWATCH_SIZE_PX) }}
    >
      {visibleColors.map((color) => {
        const swatchColor = resolveSwatchColor(color);

        return (
          <span
            key={color.value}
            title={color.value}
            aria-label={`Color: ${color.value}`}
            className="shrink-0 overflow-hidden rounded-full border-2 border-transparent"
            style={{
              width: lp(HOME_PRODUCT_CARD_SWATCH_SIZE_PX),
              height: lp(HOME_PRODUCT_CARD_SWATCH_SIZE_PX),
              backgroundColor: color.imageUrl ? undefined : swatchColor,
            }}
          >
            {color.imageUrl ? (
              <img
                src={color.imageUrl}
                alt={color.value}
                className="h-full w-full object-cover"
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
