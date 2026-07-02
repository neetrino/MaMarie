'use client';

import {
  MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
  MOBILE_ORDER_MORE_BUTTON_ARROW_SIZE_PX,
  MOBILE_ORDER_MORE_BUTTON_BG,
  MOBILE_ORDER_MORE_BUTTON_LABEL_TO_ARROW_GAP_PX,
  MOBILE_ORDER_MORE_BUTTON_PADDING_LEFT_PX,
  MOBILE_ORDER_MORE_BUTTON_PADDING_RIGHT_PX,
  MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
  MOBILE_ORDER_ASSETS,
} from '../../../../constants/mobile-orders';

interface MobileOrderMoreButtonProps {
  label: string;
  labelFontSizePx: number;
  onClick: () => void;
}

/** Figma `66:454` — compact pink pill CTA with white arrow disc. */
export function MobileOrderMoreButton({ label, labelFontSizePx, onClick }: MobileOrderMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto inline-flex items-center rounded-full text-white transition-opacity hover:opacity-90"
      style={{
        backgroundColor: MOBILE_ORDER_MORE_BUTTON_BG,
        paddingTop: MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
        paddingBottom: MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
        paddingLeft: MOBILE_ORDER_MORE_BUTTON_PADDING_LEFT_PX,
        paddingRight: MOBILE_ORDER_MORE_BUTTON_PADDING_RIGHT_PX,
        gap: MOBILE_ORDER_MORE_BUTTON_LABEL_TO_ARROW_GAP_PX,
        minHeight: MOBILE_ORDER_MORE_BUTTON_ARROW_SIZE_PX + MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX * 2,
      }}
    >
      <span className="font-semibold whitespace-nowrap" style={{ fontSize: labelFontSizePx }}>
        {label}
      </span>
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white"
        style={{
          width: MOBILE_ORDER_MORE_BUTTON_ARROW_SIZE_PX,
          height: MOBILE_ORDER_MORE_BUTTON_ARROW_SIZE_PX,
        }}
        aria-hidden
      >
        <img
          alt=""
          src={MOBILE_ORDER_ASSETS.moreButtonArrow}
          decoding="async"
          draggable={false}
          style={{
            width: MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
            height: MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
          }}
        />
      </span>
    </button>
  );
}
