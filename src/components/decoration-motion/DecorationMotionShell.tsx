import type { CSSProperties, ReactNode } from 'react';
import {
  DECORATION_MOTION_TIMING,
  type DecorationMotion,
} from '../../constants/decoration-motion';
import styles from './DecorationMotion.module.css';

const MOTION_CLASS: Record<DecorationMotion, string> = {
  float: styles.float,
  floatSoft: styles.floatSoft,
  bounce: styles.bounce,
  sway: styles.sway,
  archDrift: styles.archDrift,
  archDriftAlt: styles.archDriftAlt,
};

interface DecorationMotionShellProps {
  motion: DecorationMotion;
  children: ReactNode;
  /** When true, size to content instead of filling the parent (e.g. absolute img). */
  inline?: boolean;
  className?: string;
}

/**
 * Idle float / sway wrapper for clay decorations.
 * Place outside Figma rotate transforms so base orientation stays intact.
 */
export function DecorationMotionShell({
  motion,
  children,
  inline = false,
  className = '',
}: DecorationMotionShellProps) {
  const timing = DECORATION_MOTION_TIMING[motion];
  const style = {
    '--deco-motion-duration': `${timing.durationMs}ms`,
    '--deco-motion-delay': `${timing.delayMs}ms`,
  } as CSSProperties;

  const classNames = [
    styles.root,
    MOTION_CLASS[motion],
    inline ? styles.inline : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} style={style}>
      {children}
    </div>
  );
}
