import type { CSSProperties, ReactNode } from 'react';
import {
  HEADER_PADDING_LEFT_PX,
  HEADER_PADDING_RIGHT_PX,
} from '../../constants/brand';
import { HEADER_MOBILE_PADDING_X_PX } from '../../constants/header';
import styles from './HeaderContentFrame.module.css';

const headerContentInsetVars = {
  ['--header-content-inset-left-mobile']: `${HEADER_MOBILE_PADDING_X_PX}px`,
  ['--header-content-inset-right-mobile']: `${HEADER_MOBILE_PADDING_X_PX}px`,
  ['--header-content-inset-left-desktop']: `${HEADER_PADDING_LEFT_PX}px`,
  ['--header-content-inset-right-desktop']: `${HEADER_PADDING_RIGHT_PX}px`,
} as CSSProperties;

interface HeaderContentFrameProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Content width from navbar logo to login icon — desktop + mobile insets from Figma. */
export function HeaderContentFrame({
  children,
  className = '',
  style,
}: HeaderContentFrameProps) {
  return (
    <div
      className={`${styles.frame} ${className}`.trim()}
      style={{ ...headerContentInsetVars, ...style }}
    >
      {children}
    </div>
  );
}
