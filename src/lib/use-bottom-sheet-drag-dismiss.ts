'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

const DEFAULT_DRAG_ACTIVATION_PX = 10;

interface ActiveDrag {
  pointerId: number;
  startClientY: number;
}

interface PendingDrag {
  pointerId: number;
  startClientY: number;
}

interface UseBottomSheetDragDismissOptions {
  enabled: boolean;
  panelRef: RefObject<HTMLDivElement>;
  onDismiss: () => void;
  dismissThresholdPx: number;
}

interface UseBottomSheetDragDismissResult {
  dragOffsetY: number;
  isDragging: boolean;
  scrollAreaRef: RefObject<HTMLDivElement>;
  panelDragStyle: CSSProperties;
  resetDrag: () => void;
  headerPointerHandlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  };
  scrollAreaPointerHandlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  };
  panelPointerHandlers: {
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  };
}

/** Drag a bottom sheet downward to dismiss (header always; content when scrolled to top). */
export function useBottomSheetDragDismiss({
  enabled,
  panelRef,
  onDismiss,
  dismissThresholdPx,
}: UseBottomSheetDragDismissOptions): UseBottomSheetDragDismissResult {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const pendingDragRef = useRef<PendingDrag | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const resetDrag = useCallback(() => {
    activeDragRef.current = null;
    pendingDragRef.current = null;
    setIsDragging(false);
    setDragOffsetY(0);
  }, []);

  const startDrag = useCallback(
    (pointerId: number, startClientY: number) => {
      activeDragRef.current = { pointerId, startClientY };
      pendingDragRef.current = null;
      setIsDragging(true);
      panelRef.current?.setPointerCapture(pointerId);
    },
    [panelRef],
  );

  const handleHeaderPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) {
        return;
      }

      startDrag(event.pointerId, event.clientY);
    },
    [enabled, startDrag],
  );

  const handleScrollAreaPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) {
        return;
      }

      if ((scrollAreaRef.current?.scrollTop ?? 0) > 0) {
        return;
      }

      pendingDragRef.current = {
        pointerId: event.pointerId,
        startClientY: event.clientY,
      };
    },
    [enabled],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const activeDrag = activeDragRef.current;

      if (activeDrag && activeDrag.pointerId === event.pointerId) {
        const deltaY = Math.max(0, event.clientY - activeDrag.startClientY);
        setDragOffsetY(deltaY);

        if (deltaY > 0) {
          event.preventDefault();
        }

        return;
      }

      const pendingDrag = pendingDragRef.current;
      if (!pendingDrag || pendingDrag.pointerId !== event.pointerId) {
        return;
      }

      const deltaY = event.clientY - pendingDrag.startClientY;

      if (deltaY < -DEFAULT_DRAG_ACTIVATION_PX) {
        pendingDragRef.current = null;
        return;
      }

      if (deltaY <= DEFAULT_DRAG_ACTIVATION_PX || (scrollAreaRef.current?.scrollTop ?? 0) > 0) {
        return;
      }

      startDrag(event.pointerId, pendingDrag.startClientY);
      setDragOffsetY(deltaY);
      event.preventDefault();
    },
    [startDrag],
  );

  const finishDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      pendingDragRef.current = null;

      const activeDrag = activeDragRef.current;
      if (!activeDrag || activeDrag.pointerId !== event.pointerId) {
        return;
      }

      if (panelRef.current?.hasPointerCapture(event.pointerId)) {
        panelRef.current.releasePointerCapture(event.pointerId);
      }

      const deltaY = Math.max(0, event.clientY - activeDrag.startClientY);
      activeDragRef.current = null;
      setIsDragging(false);

      if (deltaY >= dismissThresholdPx) {
        onDismiss();
        return;
      }

      setDragOffsetY(0);
    },
    [dismissThresholdPx, onDismiss, panelRef],
  );

  useEffect(() => {
    if (!enabled) {
      resetDrag();
    }
  }, [enabled, resetDrag]);

  const panelDragStyle: CSSProperties =
    dragOffsetY > 0 ? { transform: `translateY(${dragOffsetY}px)` } : {};

  return {
    dragOffsetY,
    isDragging,
    scrollAreaRef,
    panelDragStyle,
    resetDrag,
    headerPointerHandlers: { onPointerDown: handleHeaderPointerDown },
    scrollAreaPointerHandlers: { onPointerDown: handleScrollAreaPointerDown },
    panelPointerHandlers: {
      onPointerMove: handlePointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
    },
  };
}
