import type { ReactNode } from 'react';

interface HomeProductCardCartActionsProps {
  cartButton: ReactNode;
  ratingLineHeightPx: number;
  actionsWidthPx: number;
}

/**
 * Cart column with invisible rating-height spacer so hover gap shrink lifts the button
 * (same motion as the original stacked rating + cart layout).
 */
export function HomeProductCardCartActions({
  cartButton,
  ratingLineHeightPx,
  actionsWidthPx,
}: HomeProductCardCartActionsProps) {
  return (
    <div
      className="home-product-card-actions flex shrink-0 flex-col items-end justify-end"
      style={{ width: actionsWidthPx }}
    >
      <div
        className="invisible pointer-events-none shrink-0"
        style={{ height: ratingLineHeightPx, width: 1 }}
        aria-hidden
      />
      {cartButton}
    </div>
  );
}
