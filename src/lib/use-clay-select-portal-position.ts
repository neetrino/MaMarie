'use client';

import { useCallback, useEffect, useState, type CSSProperties, type RefObject } from 'react';
import {
  CLAY_SELECT_DROPDOWN_GAP_PX,
  CLAY_SELECT_PORTAL_Z_INDEX,
} from '../constants/clay-select';

/** Keeps a portaled ClaySelect menu aligned with its trigger while scrolling. */
export function useClaySelectPortalPosition(
  enabled: boolean,
  isOpen: boolean,
  triggerRef: RefObject<HTMLButtonElement | null>
): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties | undefined>();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + CLAY_SELECT_DROPDOWN_GAP_PX,
      left: rect.left,
      width: rect.width,
      zIndex: CLAY_SELECT_PORTAL_Z_INDEX,
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!enabled || !isOpen) {
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [enabled, isOpen, updatePosition]);

  return enabled ? position : undefined;
}
