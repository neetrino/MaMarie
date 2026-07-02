import type { CSSProperties, ReactNode } from 'react';
import {
  CONTACT_PAGE_DESKTOP_HORIZONTAL_PADDING_PX,
  CONTACT_PAGE_MOBILE_HORIZONTAL_PADDING_PX,
  CONTACT_PAGE_VERTICAL_PADDING_PX,
} from '../../constants/contact-page';
import styles from './ContactPageShell.module.css';

const contactPageShellVars = {
  ['--contact-page-padding-x-mobile']: `${CONTACT_PAGE_MOBILE_HORIZONTAL_PADDING_PX}px`,
  ['--contact-page-padding-x-desktop']: `${CONTACT_PAGE_DESKTOP_HORIZONTAL_PADDING_PX}px`,
  ['--contact-page-padding-y']: `${CONTACT_PAGE_VERTICAL_PADDING_PX}px`,
} as CSSProperties;

interface ContactPageShellProps {
  children: ReactNode;
}

/** Contact page outer shell — mobile content track aligned with navbar insets. */
export function ContactPageShell({ children }: ContactPageShellProps) {
  return (
    <div className={styles.shell} style={contactPageShellVars}>
      {children}
    </div>
  );
}
