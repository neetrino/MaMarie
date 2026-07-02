'use client';

import {
  MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
  MOBILE_ORDER_MORE_BUTTON_ARROW_SIZE_PX,
  MOBILE_ORDER_MORE_BUTTON_BG,
  MOBILE_ORDER_MORE_BUTTON_FONT_SIZE_PX,
  MOBILE_ORDER_MORE_BUTTON_PADDING_RIGHT_PX,
  MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
  MOBILE_ORDER_ASSETS,
} from '../../../../constants/mobile-orders';

interface MobileOrderMoreButtonProps {
  label: string;
  onClick: () => void;
}

/** Figma `66:454` — pink pill CTA with white arrow disc. */
export function MobileOrderMoreButton({ label, onClick }: MobileOrderMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center rounded-full text-white transition-opacity hover:opacity-90"
      style={{
        backgroundColor: MOBILE_ORDER_MORE_BUTTON_BG,
        paddingTop: MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
        paddingBottom: MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
        paddingRight: MOBILE_ORDER_MORE_BUTTON_PADDING_RIGHT_PX,
        paddingLeft: MOBILE_ORDER_MORE_BUTTON_PADDING_Y_PX,
      }}
    >
      <span
        className="flex-1 text-center font-semibold"
        style={{ fontSize: MOBILE_ORDER_MORE_BUTTON_FONT_SIZE_PX }}
      >
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
          className="rotate-90"
          style={{
            width: MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
            height: MOBILE_ORDER_MORE_BUTTON_ARROW_ICON_SIZE_PX,
          }}
        />
      </span>
    </button>
  );
}
