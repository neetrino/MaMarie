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
} from '../../constants/home-sections';

const HOME_PRODUCT_CARD_SIZE_LABELS = ['86', '92', '98', '104'] as const;

type SizeBadgeVariant = 'active' | 'sold-out' | 'inactive';

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

const SIZE_BADGE_VARIANTS: SizeBadgeVariant[] = ['active', 'sold-out', 'inactive', 'inactive'];

export function HomeProductCardSizeBadges() {
  return (
    <div
      className="home-product-card-sizes pointer-events-none absolute flex items-center opacity-0"
      style={{ gap: HOME_PRODUCT_CARD_SIZE_BADGE_GAP_PX }}
    >
      {HOME_PRODUCT_CARD_SIZE_LABELS.map((label, index) => {
        const variant = SIZE_BADGE_VARIANTS[index] ?? 'inactive';
        const badgeStyle = getSizeBadgeStyle(variant);

        return (
          <span
            key={label}
            className="flex items-center justify-center border-2 font-semibold"
            style={{
              width: HOME_PRODUCT_CARD_SIZE_BADGE_WIDTH_PX,
              height: HOME_PRODUCT_CARD_SIZE_BADGE_HEIGHT_PX,
              borderRadius: HOME_PRODUCT_CARD_SIZE_BADGE_RADIUS_PX,
              fontSize: HOME_PRODUCT_CARD_SIZE_BADGE_FONT_SIZE_PX,
              lineHeight: '18px',
              backgroundColor: badgeStyle.backgroundColor,
              borderColor: badgeStyle.borderColor,
              color: badgeStyle.color,
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
