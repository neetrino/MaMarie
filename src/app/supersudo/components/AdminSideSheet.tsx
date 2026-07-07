'use client';

import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  ADMIN_SIDE_SHEET_BACKDROP_TRANSITION_MS,
  ADMIN_SIDE_SHEET_PANEL_TRANSITION_MS,
  ADMIN_SIDE_SHEET_PANEL_Z_INDEX,
  ADMIN_SIDE_SHEET_WIDTH_PERCENT,
  ADMIN_SIDE_SHEET_Z_INDEX,
} from '../../../constants/admin-side-sheet';
import { lockBodyScroll, unlockBodyScroll } from '../../../lib/body-scroll-lock';
import { DRAWER_TOUCH_SCROLL_ROOT_ATTR, preventTouchMoveUnlessInsideDrawer } from '../../../lib/drawer-touch-scroll-guard';
import { useDrawerTransition } from '../../../lib/use-drawer-transition';
import { DrawerCloseTab } from '../../../components/drawer/DrawerCloseTab';

interface AdminSideSheetPanelProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement>;
  scrollRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

function AdminSideSheetPanel({
  visible,
  title,
  subtitle,
  headerActions,
  footer,
  closeLabel,
  onClose,
  panelRef,
  scrollRef,
  children,
}: AdminSideSheetPanelProps) {
  return (
    <div
      className="fixed inset-0 flex justify-end overscroll-none"
      style={{ zIndex: ADMIN_SIDE_SHEET_Z_INDEX }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/40 backdrop-blur-sm transition-opacity ease-in-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: `${ADMIN_SIDE_SHEET_BACKDROP_TRANSITION_MS}ms` }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative h-dvh max-h-dvh w-[var(--admin-side-sheet-width)] transition-transform ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
          visible ? 'translate-x-0' : 'translate-x-full motion-reduce:translate-x-0'
        }`}
        style={{
          ['--admin-side-sheet-width' as string]: `${ADMIN_SIDE_SHEET_WIDTH_PERCENT}%`,
          transitionDuration: `${ADMIN_SIDE_SHEET_PANEL_TRANSITION_MS}ms`,
        }}
      >
        <DrawerCloseTab edge="start" onClose={onClose} closeLabel={closeLabel} />
        <aside
          className="relative flex h-full w-full flex-col overflow-hidden rounded-l-[15px] border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          style={{ zIndex: ADMIN_SIDE_SHEET_PANEL_Z_INDEX }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-side-sheet-title"
          {...{ [DRAWER_TOUCH_SCROLL_ROOT_ATTR]: '' }}
          onClick={(event) => event.stopPropagation()}
        >
          <header className="shrink-0 border-b border-gray-100 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h2 id="admin-side-sheet-title" className="text-lg font-semibold leading-tight text-gray-900">
                  {title}
                </h2>
                {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
              </div>
              {headerActions ? <div className="shrink-0 sm:self-start">{headerActions}</div> : null}
            </div>
          </header>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
          >
            {children}
          </div>

          {footer ? (
            <footer className="shrink-0 border-t border-gray-100 px-5 py-4">{footer}</footer>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

interface AdminSideSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}

/** Half-screen card side sheet for admin overlays (forms, details, confirmations). */
export function AdminSideSheet({
  isOpen,
  title,
  subtitle,
  headerActions,
  footer,
  closeLabel,
  onClose,
  children,
}: AdminSideSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { rendered, visible } = useDrawerTransition(isOpen, ADMIN_SIDE_SHEET_PANEL_TRANSITION_MS);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      preventTouchMoveUnlessInsideDrawer(event, [panelRef.current, scrollRef.current]);
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
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [rendered, onClose]);

  if (!rendered) {
    return null;
  }

  return createPortal(
    <AdminSideSheetPanel
      visible={visible}
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      footer={footer}
      closeLabel={closeLabel}
      onClose={onClose}
      panelRef={panelRef}
      scrollRef={scrollRef}
    >
      {children}
    </AdminSideSheetPanel>,
    document.body,
  );
}
