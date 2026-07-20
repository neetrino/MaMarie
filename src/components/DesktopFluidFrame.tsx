import type { ReactNode } from 'react';
import styles from './DesktopFluidFrame.module.css';

interface DesktopFluidFrameProps {
  children: ReactNode;
  className?: string;
  stageClassName?: string;
  /** Allow vertical overflow — navbar dropdowns must not be clipped in Safari. */
  allowOverflow?: boolean;
  /** Also scale the 1440px stage on tablet (744–1023), e.g. About on iPad. */
  scaleOnTablet?: boolean;
}

/**
 * Scales fixed-width desktop layout (1440px Figma) to match viewport width
 * while preserving composition — navbar, footer, and page sections stay aligned.
 */
export function DesktopFluidFrame({
  children,
  className = '',
  stageClassName = '',
  allowOverflow = false,
  scaleOnTablet = false,
}: DesktopFluidFrameProps) {
  const frameClassName = [
    styles.frame,
    allowOverflow ? styles.frameAllowOverflow : '',
    scaleOnTablet ? styles.frameScaleOnTablet : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={frameClassName}>
      <div className={`${styles.stage} ${stageClassName}`.trim()}>{children}</div>
    </div>
  );
}
