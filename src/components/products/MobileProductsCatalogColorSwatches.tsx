import {
  MOBILE_PRODUCTS_CATALOG_CARD_SWATCHES_MARGIN_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_GAP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_MAX_VISIBLE,
  MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SELECTED_BORDER_COLOR,
  MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SIZE_PX,
} from '../../constants/mobile-products-catalog';
import { mobileProductsCatalogCardLayoutPx } from '../../lib/mobile-products-catalog-card-layout';
import { getColorHex } from '../../lib/colorMap';
import type { ProductColorOption } from '../../lib/services/product-variant-attributes';

interface MobileProductsCatalogColorSwatchesProps {
  colors?: ProductColorOption[];
  layoutWidthPx: number;
  maxVisible?: number;
}

function resolveSwatchColor(color: ProductColorOption): string {
  if (color.colors && color.colors.length > 0) {
    return color.colors[0];
  }
  return getColorHex(color.value);
}

/** Figma `167:642` — color variant row on the mobile catalog card. */
export function MobileProductsCatalogColorSwatches({
  colors,
  layoutWidthPx,
  maxVisible = MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_MAX_VISIBLE,
}: MobileProductsCatalogColorSwatchesProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  const lp = (value: number) => mobileProductsCatalogCardLayoutPx(value, layoutWidthPx);
  const visibleColors = colors.slice(0, maxVisible);

  return (
    <div
      className="flex items-center"
      style={{
        marginTop: lp(MOBILE_PRODUCTS_CATALOG_CARD_SWATCHES_MARGIN_TOP_PX),
        gap: lp(MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_GAP_PX),
        height: lp(MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SIZE_PX),
      }}
    >
      {visibleColors.map((color, index) => {
        const swatchColor = resolveSwatchColor(color);
        const isSelected = index === 0;

        return (
          <span
            key={color.value}
            title={color.value}
            aria-label={`Color: ${color.value}`}
            className="shrink-0 overflow-hidden rounded-full border-2"
            style={{
              width: lp(MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SIZE_PX),
              height: lp(MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SIZE_PX),
              backgroundColor: color.imageUrl ? undefined : swatchColor,
              borderColor: isSelected
                ? MOBILE_PRODUCTS_CATALOG_CARD_SWATCH_SELECTED_BORDER_COLOR
                : 'transparent',
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
