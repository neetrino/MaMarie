import type { CSSProperties, ReactNode } from 'react';
import {
  ABOUT_US_CARD_ENTER_DISTANCE_PX,
  ABOUT_US_CARD_ENTER_DURATION_MS,
} from '../../constants/about-us-enter';
import enterStyles from './AboutUsEnter.module.css';

type AboutUsEnterSide = 'left' | 'right';

function aboutUsEnterStyle(delayMs: number): CSSProperties {
  return {
    '--about-us-enter-duration': `${ABOUT_US_CARD_ENTER_DURATION_MS}ms`,
    '--about-us-enter-delay': `${delayMs}ms`,
    '--about-us-enter-distance': `${ABOUT_US_CARD_ENTER_DISTANCE_PX}px`,
  } as CSSProperties;
}

interface AboutUsEnterShellProps {
  side: AboutUsEnterSide;
  delayMs: number;
  shouldEnter: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Slides a card in from the left or right once the About Us block is in view. */
export function AboutUsEnterShell({
  side,
  delayMs,
  shouldEnter,
  className = '',
  style,
  children,
}: AboutUsEnterShellProps) {
  const motionClass = shouldEnter
    ? side === 'left'
      ? enterStyles.fromLeft
      : enterStyles.fromRight
    : side === 'left'
      ? enterStyles.pendingFromLeft
      : enterStyles.pendingFromRight;

  return (
    <div
      className={`${motionClass} ${className}`.trim()}
      style={{ ...aboutUsEnterStyle(delayMs), ...style }}
    >
      {children}
    </div>
  );
}
