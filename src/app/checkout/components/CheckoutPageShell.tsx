import type { CSSProperties, ReactNode } from 'react';
import {
  CHECKOUT_FORM_SECTION_GAP_PX,
  CHECKOUT_GRID_GAP_PX,
  CHECKOUT_PAGE_BG,
  CHECKOUT_PAGE_BG_DESKTOP,
  CHECKOUT_PAGE_HORIZONTAL_PADDING_PX,
  CHECKOUT_PAGE_MAX_WIDTH_PX,
  CHECKOUT_PAGE_PADDING_BOTTOM_PX,
  CHECKOUT_PAGE_PADDING_BOTTOM_DESKTOP_PX,
  CHECKOUT_PAGE_PADDING_TOP_PX,
  CHECKOUT_PAGE_PADDING_TOP_DESKTOP_PX,
  CHECKOUT_PAGE_PADDING_X_DESKTOP_PX,
  CHECKOUT_PAGE_TITLE_TO_CONTENT_GAP_PX,
} from '../../../constants/checkout-page';
import styles from './CheckoutPageShell.module.css';

const checkoutPageShellVars = {
  ['--checkout-page-bg']: CHECKOUT_PAGE_BG,
  ['--checkout-page-bg-desktop']: CHECKOUT_PAGE_BG_DESKTOP,
  ['--checkout-page-padding-x']: `${CHECKOUT_PAGE_HORIZONTAL_PADDING_PX}px`,
  ['--checkout-page-padding-top']: `${CHECKOUT_PAGE_PADDING_TOP_PX}px`,
  ['--checkout-page-padding-bottom']: `${CHECKOUT_PAGE_PADDING_BOTTOM_PX}px`,
  ['--checkout-page-max-width']: `${CHECKOUT_PAGE_MAX_WIDTH_PX}px`,
  ['--checkout-page-padding-x-desktop']: `${CHECKOUT_PAGE_PADDING_X_DESKTOP_PX}px`,
  ['--checkout-page-padding-top-desktop']: `${CHECKOUT_PAGE_PADDING_TOP_DESKTOP_PX}px`,
  ['--checkout-page-padding-bottom-desktop']: `${CHECKOUT_PAGE_PADDING_BOTTOM_DESKTOP_PX}px`,
  ['--checkout-page-title-gap']: `${CHECKOUT_PAGE_TITLE_TO_CONTENT_GAP_PX}px`,
  ['--checkout-grid-gap']: `${CHECKOUT_GRID_GAP_PX}px`,
  ['--checkout-form-section-gap']: `${CHECKOUT_FORM_SECTION_GAP_PX}px`,
} as CSSProperties;

interface CheckoutPageShellProps {
  children: ReactNode;
}

/** Checkout page shell — mobile gray surface, centered desktop column. */
export function CheckoutPageShell({ children }: CheckoutPageShellProps) {
  return (
    <div className={styles.shell} style={checkoutPageShellVars}>
      {children}
    </div>
  );
}

export { styles as checkoutPageShellStyles };
