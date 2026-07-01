import {
  HOME_PRODUCT_CARD_SIZE_ACTIVE_BG,
  HOME_PRODUCT_CARD_SIZE_BADGE_FONT_SIZE_PX,
  HOME_PRODUCT_CARD_SIZE_BADGE_GAP_PX,
  HOME_PRODUCT_CARD_SIZE_BADGE_HEIGHT_PX,
  HOME_PRODUCT_CARD_SIZE_BADGE_RADIUS_PX,
  HOME_PRODUCT_CARD_SIZE_BADGE_WIDTH_PX,
  HOME_PRODUCT_CARD_SIZE_INACTIVE_BG,
  HOME_PRODUCT_CARD_SIZE_INACTIVE_TEXT,
  HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BG,
  HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BORDER,
  HOME_PRODUCT_CARD_SIZE_SOLD_OUT_TEXT,
  HOME_PRODUCT_CARD_SIZES_LEFT_PX,
  HOME_PRODUCT_CARD_SIZES_TOP_PX,
} from '../../constants/home-sections';
import { homeProductCardLayoutPx } from '../../lib/home-product-card-layout';
import type { ProductSizeOption } from '../../lib/services/product-variant-attributes';

type SizeBadgeVariant = 'active' | 'sold-out' | 'inactive';

interface HomeProductCardSizeBadgesProps {
  sizes?: ProductSizeOption[];
  layoutWidthPx?: number;
}

function getSizeBadgeStyle(variant: SizeBadgeVariant): {
  backgroundColor: string;
  borderColor: string;
  color: string;
} {
  if (variant === 'active') {
    return {
      backgroundColor: HOME_PRODUCT_CARD_SIZE_ACTIVE_BG,
      borderColor: '#ffffff',
      color: '#ffffff',
    };
  }

  if (variant === 'sold-out') {
    return {
      backgroundColor: HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BG,
      borderColor: HOME_PRODUCT_CARD_SIZE_SOLD_OUT_BORDER,
      color: HOME_PRODUCT_CARD_SIZE_SOLD_OUT_TEXT,
    };
  }

  return {
    backgroundColor: HOME_PRODUCT_CARD_SIZE_INACTIVE_BG,
    borderColor: '#ffffff',
    color: HOME_PRODUCT_CARD_SIZE_INACTIVE_TEXT,
  };
}

function resolveSizeBadgeVariant(size: ProductSizeOption): SizeBadgeVariant {
  return size.inStock ? 'active' : 'sold-out';
}

export function HomeProductCardSizeBadges({
  sizes,
  layoutWidthPx,
}: HomeProductCardSizeBadgesProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);

  return (
    <div
      className="home-product-card-sizes pointer-events-none absolute z-20 flex items-center opacity-0"
      style={{
        left: lp(HOME_PRODUCT_CARD_SIZES_LEFT_PX),
        top: lp(HOME_PRODUCT_CARD_SIZES_TOP_PX),
        gap: lp(HOME_PRODUCT_CARD_SIZE_BADGE_GAP_PX),
      }}
    >
      {sizes.map((size) => {
        const variant = resolveSizeBadgeVariant(size);
        const badgeStyle = getSizeBadgeStyle(variant);

        return (
          <span
            key={size.value}
            className="flex items-center justify-center border-2 font-semibold"
            style={{
              width: lp(HOME_PRODUCT_CARD_SIZE_BADGE_WIDTH_PX),
              height: lp(HOME_PRODUCT_CARD_SIZE_BADGE_HEIGHT_PX),
              borderRadius: lp(HOME_PRODUCT_CARD_SIZE_BADGE_RADIUS_PX),
              fontSize: HOME_PRODUCT_CARD_SIZE_BADGE_FONT_SIZE_PX,
              lineHeight: '18px',
              backgroundColor: badgeStyle.backgroundColor,
              borderColor: badgeStyle.borderColor,
              color: badgeStyle.color,
            }}
          >
            {size.label}
          </span>
        );
      })}
    </div>
  );
}
