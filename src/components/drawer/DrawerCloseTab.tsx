import {
  CART_DRAWER_CLOSE_BUTTON_TOP_PX,
  CART_DRAWER_CLOSE_ICON_OFFSET_X_PX,
  CART_DRAWER_CLOSE_ICON_SIZE_PX,
  CART_DRAWER_CLOSE_ICON_STROKE_WIDTH,
  CART_DRAWER_CLOSE_TAB_HEIGHT_PX,
  CART_DRAWER_CLOSE_TAB_HOVER_SCALE,
  CART_DRAWER_CLOSE_TAB_TRANSITION_MS,
  CART_DRAWER_CLOSE_TAB_WIDTH_PX,
  CART_DRAWER_CLOSE_TAB_Z_INDEX,
} from '../../constants/cart-drawer';
import styles from './DrawerCloseTab.module.css';

export type DrawerCloseTabEdge = 'start' | 'end';

interface DrawerCloseTabProps {
  edge: DrawerCloseTabEdge;
  onClose: () => void;
  closeLabel: string;
}

/** Pink side-tab close control — tucks under drawer edge (`start` = left tab, `end` = right tab). */
export function DrawerCloseTab({ edge, onClose, closeLabel }: DrawerCloseTabProps) {
  const isStartEdge = edge === 'start';
  const tabRadiusPx = CART_DRAWER_CLOSE_TAB_HEIGHT_PX / 2;
  const tabHalfWidthPx = CART_DRAWER_CLOSE_TAB_WIDTH_PX / 2;
  const iconNudgePx = isStartEdge
    ? CART_DRAWER_CLOSE_ICON_OFFSET_X_PX
    : -CART_DRAWER_CLOSE_ICON_OFFSET_X_PX;

  return (
    <button
      type="button"
      onClick={onClose}
      className={`${isStartEdge ? styles.closeTabStart : styles.closeTabEnd} absolute flex items-center justify-center bg-brand-pink text-white`}
      style={{
        top: CART_DRAWER_CLOSE_BUTTON_TOP_PX,
        ...(isStartEdge ? { left: 0 } : { right: 0 }),
        zIndex: CART_DRAWER_CLOSE_TAB_Z_INDEX,
        width: CART_DRAWER_CLOSE_TAB_WIDTH_PX,
        height: CART_DRAWER_CLOSE_TAB_HEIGHT_PX,
        borderRadius: tabRadiusPx,
        paddingRight: isStartEdge ? tabHalfWidthPx : undefined,
        paddingLeft: isStartEdge ? undefined : tabHalfWidthPx,
        ['--drawer-close-tab-hover-scale' as string]: CART_DRAWER_CLOSE_TAB_HOVER_SCALE,
        ['--drawer-close-tab-transition-ms' as string]: `${CART_DRAWER_CLOSE_TAB_TRANSITION_MS}ms`,
      }}
      aria-label={closeLabel}
    >
      <svg
        width={CART_DRAWER_CLOSE_ICON_SIZE_PX}
        height={CART_DRAWER_CLOSE_ICON_SIZE_PX}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={CART_DRAWER_CLOSE_ICON_STROKE_WIDTH}
        aria-hidden
        style={{ transform: `translateX(${iconNudgePx}px)` }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
