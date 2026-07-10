'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

export type AnchoredPortalAnchor = 'left' | 'right' | 'right-fit';

interface AnchoredPortalPositionOptions {
  gapPx: number;
  anchor?: AnchoredPortalAnchor;
  matchTriggerWidth?: boolean;
  minWidthPx?: number;
  zIndex: number;
}

function buildAnchoredPortalStyle(
  rect: DOMRect,
  {
    gapPx,
    anchor = 'left',
    matchTriggerWidth = false,
    minWidthPx,
    zIndex,
  }: AnchoredPortalPositionOptions
): CSSProperties {
  const width = matchTriggerWidth
    ? rect.width
    : minWidthPx != null
      ? Math.max(rect.width, minWidthPx)
      : undefined;

  const style: CSSProperties = {
    position: 'fixed',
    top: rect.bottom + gapPx,
    zIndex,
  };

  switch (anchor) {
    case 'right-fit':
      style.left = rect.right;
      break;
    case 'right':
      style.left = rect.right - (width ?? rect.width);
      if (width != null) {
        style.width = width;
      }
      break;
    default:
      style.left = rect.left;
      if (width != null) {
        style.width = width;
      }
      break;
  }

  return style;
}

/** Keeps a portaled dropdown aligned with its trigger while scrolling or resizing. */
export function useAnchoredPortalPosition(
  enabled: boolean,
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  options: AnchoredPortalPositionOptions
): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties | undefined>();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    setPosition(buildAnchoredPortalStyle(trigger.getBoundingClientRect(), optionsRef.current));
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!enabled || !isOpen) {
      setPosition(undefined);
      return;
    }

    updatePosition();
  }, [enabled, isOpen, updatePosition]);

  useEffect(() => {
    if (!enabled || !isOpen) {
      return;
    }

    const frameId = requestAnimationFrame(updatePosition);
    const viewport = window.visualViewport;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    viewport?.addEventListener('resize', updatePosition);
    viewport?.addEventListener('scroll', updatePosition);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      viewport?.removeEventListener('resize', updatePosition);
      viewport?.removeEventListener('scroll', updatePosition);
    };
  }, [enabled, isOpen, updatePosition]);

  return enabled && isOpen ? position : undefined;
}
