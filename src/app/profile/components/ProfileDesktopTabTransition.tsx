'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  PROFILE_DESKTOP_TAB_ORDER,
  PROFILE_DESKTOP_TAB_TRANSITION_MS,
  PROFILE_DESKTOP_TAB_TRANSITION_OFFSET_PX,
} from '../../../constants/profile-desktop-page';
import type { ProfileTab } from '../types';
import styles from './ProfileDesktopTabTransition.module.css';

type SlideDirection = 'up' | 'down' | 'none';

interface ProfileDesktopTabTransitionProps {
  activeTab: ProfileTab;
  children: ReactNode;
}

function resolveSlideDirection(previousTab: ProfileTab, nextTab: ProfileTab): SlideDirection {
  const previousIndex = PROFILE_DESKTOP_TAB_ORDER.indexOf(previousTab);
  const nextIndex = PROFILE_DESKTOP_TAB_ORDER.indexOf(nextTab);
  if (previousIndex < 0 || nextIndex < 0 || previousIndex === nextIndex) {
    return 'none';
  }
  // Lower sidebar item → content enters from below; upper → from above.
  return nextIndex > previousIndex ? 'up' : 'down';
}

function useDesktopTabSlideDirection(activeTab: ProfileTab): SlideDirection {
  const [slide, setSlide] = useState<{ tab: ProfileTab; direction: SlideDirection }>({
    tab: activeTab,
    direction: 'none',
  });

  if (slide.tab !== activeTab) {
    setSlide({
      tab: activeTab,
      direction: resolveSlideDirection(slide.tab, activeTab),
    });
  }

  return slide.tab === activeTab ? slide.direction : resolveSlideDirection(slide.tab, activeTab);
}

/** Vertical enter animation for desktop profile tab panels. */
export function ProfileDesktopTabTransition({
  activeTab,
  children,
}: ProfileDesktopTabTransitionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const direction = useDesktopTabSlideDirection(activeTab);
  const animationClass =
    direction === 'up' ? styles.slideFromBelow : direction === 'down' ? styles.slideFromAbove : '';

  useEffect(() => {
    const scrollParent = panelRef.current?.closest('.profile-desktop-content');
    if (scrollParent instanceof HTMLElement) {
      scrollParent.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div
      key={activeTab}
      ref={panelRef}
      className={animationClass}
      style={
        {
          '--profile-desktop-tab-transition-ms': `${PROFILE_DESKTOP_TAB_TRANSITION_MS}ms`,
          '--profile-desktop-tab-transition-offset': `${PROFILE_DESKTOP_TAB_TRANSITION_OFFSET_PX}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
