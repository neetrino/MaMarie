import type { CSSProperties, ReactNode } from 'react';
import {
  DESKTOP_ORDER_PAGE_BG,
  DESKTOP_ORDER_PAGE_MAX_WIDTH_PX,
  DESKTOP_ORDER_PAGE_PADDING_X_PX,
  MOBILE_ORDER_PAGE_BG,
  MOBILE_ORDER_PAGE_HORIZONTAL_PADDING_PX,
} from '../../../../constants/mobile-orders';
import styles from './OrderPageShell.module.css';

const orderPageShellVars = {
  ['--order-page-bg']: MOBILE_ORDER_PAGE_BG,
  ['--order-page-bg-desktop']: DESKTOP_ORDER_PAGE_BG,
  ['--order-page-padding-x']: `${MOBILE_ORDER_PAGE_HORIZONTAL_PADDING_PX}px`,
  ['--order-page-max-width']: `${DESKTOP_ORDER_PAGE_MAX_WIDTH_PX}px`,
  ['--order-page-padding-x-desktop']: `${DESKTOP_ORDER_PAGE_PADDING_X_PX}px`,
} as CSSProperties;

interface OrderPageShellProps {
  children: ReactNode;
}

/** Figma `66:432` order page — mobile navbar track + centered desktop column. */
export function OrderPageShell({ children }: OrderPageShellProps) {
  return (
    <div className={`order-page ${styles.shell}`} style={orderPageShellVars}>
      {children}
    </div>
  );
}
