import type { CSSProperties, ReactNode } from 'react';
import styles from './SoftAppear.module.css';

interface SoftAppearShellProps {
  active: boolean;
  durationMs: number;
  delayMs?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Slow soft fade + rise — titles / inscription arches. */
export function SoftAppearShell({
  active,
  durationMs,
  delayMs = 0,
  children,
  className = '',
  style,
}: SoftAppearShellProps) {
  return (
    <div
      className={`${active ? styles.appear : styles.pending} ${className}`.trim()}
      style={{
        '--soft-appear-duration': `${durationMs}ms`,
        '--soft-appear-delay': `${delayMs}ms`,
        ...style,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
