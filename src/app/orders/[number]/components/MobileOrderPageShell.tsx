import type { CSSProperties, ReactNode } from 'react';
import {
  MOBILE_ORDER_PAGE_BG,
  MOBILE_ORDER_PAGE_HORIZONTAL_PADDING_PX,
  MOBILE_ORDER_PAGE_PADDING_BOTTOM_PX,
  MOBILE_ORDER_PAGE_PADDING_TOP_PX,
} from '../../../../constants/mobile-orders';
import styles from './MobileOrderPageShell.module.css';

const mobileOrderPageShellVars = {
  ['--mobile-order-page-bg']: MOBILE_ORDER_PAGE_BG,
  ['--mobile-order-page-padding-x']: `${MOBILE_ORDER_PAGE_HORIZONTAL_PADDING_PX}px`,
  ['--mobile-order-page-padding-top']: `${MOBILE_ORDER_PAGE_PADDING_TOP_PX}px`,
  ['--mobile-order-page-padding-bottom']: `${MOBILE_ORDER_PAGE_PADDING_BOTTOM_PX}px`,
} as CSSProperties;

interface MobileOrderPageShellProps {
  children: ReactNode;
}

/** Figma `66:432` — mobile order page track aligned with navbar insets. */
export function MobileOrderPageShell({ children }: MobileOrderPageShellProps) {
  return (
    <div className={`mobile-order-page ${styles.shell}`} style={mobileOrderPageShellVars}>
      {children}
    </div>
  );
}
