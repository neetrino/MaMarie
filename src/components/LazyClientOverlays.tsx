'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { CART_DRAWER_OPEN_EVENT } from '../constants/cart-drawer';
import { SEARCH_MODAL_OPEN_EVENT } from '../constants/search-modal';

interface OverlayInitialOpenProps {
  initialOpen?: boolean;
}

function scheduleIdleTask(task: () => void, timeoutMs: number): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const idleId = window.requestIdleCallback(task, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(task, timeoutMs);
  return () => window.clearTimeout(timeoutId);
}

function useLazyOverlay<T extends OverlayInitialOpenProps>(
  loadModule: () => Promise<{ [key: string]: unknown }>,
  exportName: string,
  openEvent: string,
  idlePreloadTimeoutMs: number,
) {
  const [Overlay, setOverlay] = useState<ComponentType<T> | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [initialOpen, setInitialOpen] = useState(false);
  const modulePromiseRef = useRef<ReturnType<typeof loadModule> | null>(null);

  const ensureModule = () => {
    modulePromiseRef.current ??= loadModule();
    return modulePromiseRef.current;
  };

  useEffect(() => {
    return scheduleIdleTask(() => {
      void ensureModule();
    }, idlePreloadTimeoutMs);
  }, [idlePreloadTimeoutMs]);

  useEffect(() => {
    const handleOpen = () => {
      setInitialOpen(true);
      setShouldRender(true);
      void ensureModule().then((mod) => {
        setOverlay(() => mod[exportName] as ComponentType<T>);
      });
    };

    window.addEventListener(openEvent, handleOpen);
    return () => window.removeEventListener(openEvent, handleOpen);
  }, [openEvent, exportName]);

  return { Overlay, shouldRender, initialOpen };
}

/** Loads cart drawer chunk on first open; preloads during idle time. */
export function LazyCartDrawer() {
  const { Overlay, shouldRender, initialOpen } = useLazyOverlay(
    () => import('./cart/CartDrawer'),
    'CartDrawer',
    CART_DRAWER_OPEN_EVENT,
    5000,
  );

  if (!shouldRender || !Overlay) {
    return null;
  }

  return <Overlay initialOpen={initialOpen} />;
}

/** Loads search modal chunk on first open; preloads during idle time. */
export function LazySearchModal() {
  const { Overlay, shouldRender, initialOpen } = useLazyOverlay(
    () => import('./search/SearchModal'),
    'SearchModal',
    SEARCH_MODAL_OPEN_EVENT,
    6000,
  );

  if (!shouldRender || !Overlay) {
    return null;
  }

  return <Overlay initialOpen={initialOpen} />;
}
