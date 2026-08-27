'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  PROFILE_DESKTOP_TAB_ICON_THEME,
  PROFILE_DESKTOP_TAB_NAV_TRANSITION_MS,
  PROFILE_MOBILE_ICON_THEMES,
} from '../../../constants/profile-desktop-page';
import type { ProfileTab, ProfileTabConfig } from '../types';
import styles from './ProfileDesktopTabNav.module.css';

interface ProfileDesktopTabNavProps {
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

interface IndicatorBox {
  top: number;
  height: number;
}

/** Desktop sidebar tabs with a sliding active highlight. */
export function ProfileDesktopTabNav({
  tabs,
  activeTab,
  onTabChange,
}: ProfileDesktopTabNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Map<ProfileTab, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);
  const [slideEnabled, setSlideEnabled] = useState(false);

  const activeTheme = PROFILE_MOBILE_ICON_THEMES[PROFILE_DESKTOP_TAB_ICON_THEME[activeTab]];

  const updateIndicator = useCallback(() => {
    const button = buttonRefs.current.get(activeTab);
    if (!button) {
      setIndicator(null);
      return;
    }
    setIndicator({
      top: button.offsetTop,
      height: button.offsetHeight,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabs]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSlideEnabled(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      updateIndicator();
    });
    observer.observe(nav);
    for (const button of buttonRefs.current.values()) {
      observer.observe(button);
    }
    return () => {
      observer.disconnect();
    };
  }, [updateIndicator, tabs]);

  return (
    <nav
      ref={navRef}
      className="relative flex flex-col gap-1"
      role="tablist"
      aria-label="Profile sections"
      style={
        {
          '--profile-desktop-tab-nav-ms': `${PROFILE_DESKTOP_TAB_NAV_TRANSITION_MS}ms`,
        } as CSSProperties
      }
    >
      {indicator ? (
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 right-0 z-0 rounded-[15px] border-l-4 ${
            slideEnabled ? styles.indicator : styles.indicatorInstant
          }`}
          style={{
            top: indicator.top,
            height: indicator.height,
            backgroundColor: activeTheme.background,
            borderLeftColor: activeTheme.foreground,
          }}
        />
      ) : null}

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const theme = PROFILE_MOBILE_ICON_THEMES[PROFILE_DESKTOP_TAB_ICON_THEME[tab.id]];
        const isMultilineLabel = tab.label.includes('\n');

        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(tab.id, node);
              } else {
                buttonRefs.current.delete(tab.id);
              }
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex w-full items-center gap-3 rounded-[15px] border-l-4 border-transparent px-3 py-2.5 text-left ${
              isActive ? '' : 'hover:bg-white/70'
            }`}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
              style={{
                backgroundColor: theme.background,
                color: theme.foreground,
              }}
            >
              {tab.icon}
            </span>
            <span
              className={`${styles.tabLabel} min-w-0 flex-1 text-sm ${
                isActive ? 'font-semibold' : 'font-medium text-gray-800'
              } ${isMultilineLabel ? 'whitespace-pre-line leading-snug' : ''}`}
              style={isActive ? { color: theme.foreground } : undefined}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
