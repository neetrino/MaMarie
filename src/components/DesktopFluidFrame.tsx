import type { ReactNode } from 'react';
import styles from './DesktopFluidFrame.module.css';

interface DesktopFluidFrameProps {
  children: ReactNode;
  className?: string;
  stageClassName?: string;
}

/**
 * Scales fixed-width desktop layout (1440px Figma) to match viewport width
 * while preserving composition — navbar, hero, and sections stay aligned.
 */
export function DesktopFluidFrame({
  children,
  className = '',
  stageClassName = '',
}: DesktopFluidFrameProps) {
  return (
    <div className={`${styles.frame} ${className}`.trim()}>
      <div className={`${styles.stage} ${stageClassName}`.trim()}>{children}</div>
    </div>
  );
}
