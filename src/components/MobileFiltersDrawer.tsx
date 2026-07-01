'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  CART_DRAWER_MOBILE_WIDTH_PERCENT,
  CART_DRAWER_PANEL_TRANSITION_MS,
  CART_DRAWER_PANEL_Z_INDEX,
} from '../constants/cart-drawer';
import { PRODUCTS_CATALOG_MOBILE_FILTERS_Z_INDEX } from '../constants/products-catalog';
import { lockBodyScroll, unlockBodyScroll } from '../lib/body-scroll-lock';
import { useTranslation } from '../lib/i18n-client';
import { useDrawerTransition } from '../lib/use-drawer-transition';
import { DrawerCloseTab } from './drawer/DrawerCloseTab';

interface MobileFiltersDrawerProps {
  title?: string;
  children: ReactNode;
  openEventName?: string;
  zIndex?: number;
}

interface MobileFiltersDrawerPanelProps {
  visible: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement>;
  title: string;
  closeLabel: string;
  zIndex: number;
  children: ReactNode;
}

function MobileFiltersDrawerPanel({
  visible,
  onClose,
  panelRef,
  title,
  closeLabel,
  zIndex,
  children,
}: MobileFiltersDrawerPanelProps) {
  return (
    <div
      className="fixed inset-0 flex justify-start overscroll-none lg:hidden"
      style={{ zIndex }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-in-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative h-dvh max-h-dvh w-[var(--mobile-filters-drawer-width)] transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
          visible ? 'translate-x-0' : '-translate-x-full motion-reduce:translate-x-0'
        }`}
        style={{
          ['--mobile-filters-drawer-width' as string]: `${CART_DRAWER_MOBILE_WIDTH_PERCENT}%`,
        }}
      >
        <DrawerCloseTab edge="end" onClose={onClose} closeLabel={closeLabel} />
        <aside
          className="relative flex h-full w-full flex-col overflow-hidden rounded-r-3xl bg-white shadow-2xl"
          style={{ zIndex: CART_DRAWER_PANEL_Z_INDEX }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filters-drawer-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-center border-b border-gray-100 px-6 py-5">
            <h2 id="mobile-filters-drawer-title" className="text-xl font-bold leading-tight text-gray-900">
              {title}
            </h2>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">{children}</div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Mobile filters sidebar — slides in from the left with cart-style close tab and scroll lock.
 */
export function MobileFiltersDrawer({
  title,
  children,
  openEventName,
  zIndex = PRODUCTS_CATALOG_MOBILE_FILTERS_Z_INDEX,
}: MobileFiltersDrawerProps) {
  const { t } = useTranslation();
  const defaultTitle = title || t('products.mobileFilters.title');
  const closeLabel = t('products.mobileFilters.close');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { rendered, visible } = useDrawerTransition(open, CART_DRAWER_PANEL_TRANSITION_MS);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!openEventName) {
      return;
    }

    const handleExternalToggle = () => {
      setOpen((prev) => !prev);
    };

    window.addEventListener(openEventName, handleExternalToggle);
    return () => {
      window.removeEventListener(openEventName, handleExternalToggle);
    };
  }, [openEventName]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      event.preventDefault();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      unlockBodyScroll();
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [rendered, handleClose]);

  if (!mounted || !rendered) {
    return null;
  }

  return createPortal(
    <MobileFiltersDrawerPanel
      visible={visible}
      onClose={handleClose}
      panelRef={panelRef}
      title={defaultTitle}
      closeLabel={closeLabel}
      zIndex={zIndex}
    >
      {children}
    </MobileFiltersDrawerPanel>,
    document.body,
  );
}
