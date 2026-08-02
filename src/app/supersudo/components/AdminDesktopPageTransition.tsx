'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ADMIN_DESKTOP_PAGE_TRANSITION_MS,
  ADMIN_DESKTOP_PAGE_TRANSITION_OFFSET_PX,
} from '../../../constants/admin-desktop-page';
import { resolveAdminMenuIndex } from '../admin-nav-utils';
import styles from './AdminDesktopPageTransition.module.css';

type SlideDirection = 'up' | 'down' | 'none';

interface AdminMenuPathItem {
  id: string;
  path: string;
}

interface AdminDesktopPageTransitionProps {
  pathname: string;
  tabs: readonly AdminMenuPathItem[];
  children: ReactNode;
}

function resolveSlideDirection(previousIndex: number, nextIndex: number): SlideDirection {
  if (previousIndex < 0 || nextIndex < 0 || previousIndex === nextIndex) {
    return 'none';
  }
  return nextIndex > previousIndex ? 'up' : 'down';
}

function useAdminPageSlideDirection(pathname: string, tabs: readonly AdminMenuPathItem[]): {
  direction: SlideDirection;
  transitionKey: string;
} {
  const menuIndex = resolveAdminMenuIndex(pathname, tabs);
  const transitionKey = menuIndex >= 0 ? tabs[menuIndex].id : pathname;
  const [slide, setSlide] = useState<{
    key: string;
    index: number;
    direction: SlideDirection;
  }>({
    key: transitionKey,
    index: menuIndex,
    direction: 'none',
  });

  if (slide.key !== transitionKey) {
    setSlide({
      key: transitionKey,
      index: menuIndex,
      direction: resolveSlideDirection(slide.index, menuIndex),
    });
  }

  const direction =
    slide.key === transitionKey
      ? slide.direction
      : resolveSlideDirection(slide.index, menuIndex);

  return { direction, transitionKey };
}

/** Vertical enter animation for desktop admin page content. */
export function AdminDesktopPageTransition({
  pathname,
  tabs,
  children,
}: AdminDesktopPageTransitionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { direction, transitionKey } = useAdminPageSlideDirection(pathname, tabs);
  const animationClass =
    direction === 'up' ? styles.slideFromBelow : direction === 'down' ? styles.slideFromAbove : '';

  useEffect(() => {
    const scrollParent = panelRef.current?.closest('.admin-main-column');
    if (scrollParent instanceof HTMLElement) {
      scrollParent.scrollTop = 0;
    }
  }, [transitionKey]);

  return (
    <div
      key={transitionKey}
      ref={panelRef}
      className={animationClass}
      style={
        {
          '--admin-desktop-page-transition-ms': `${ADMIN_DESKTOP_PAGE_TRANSITION_MS}ms`,
          '--admin-desktop-page-transition-offset': `${ADMIN_DESKTOP_PAGE_TRANSITION_OFFSET_PX}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
