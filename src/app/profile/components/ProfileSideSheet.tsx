'use client';

import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  PROFILE_SIDE_SHEET_BACKDROP_TRANSITION_MS,
  PROFILE_SIDE_SHEET_PANEL_TRANSITION_MS,
  PROFILE_SIDE_SHEET_PANEL_Z_INDEX,
  PROFILE_SIDE_SHEET_RADIUS_PX,
  PROFILE_SIDE_SHEET_WIDTH_PERCENT,
  PROFILE_SIDE_SHEET_Z_INDEX,
} from '../../../constants/profile-desktop-page';
import { lockBodyScroll, unlockBodyScroll } from '../../../lib/body-scroll-lock';
import { useDrawerTransition } from '../../../lib/use-drawer-transition';
import { DrawerCloseTab } from '../../../components/drawer/DrawerCloseTab';

interface ProfileSideSheetPanelProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

function ProfileSideSheetPanel({
  visible,
  title,
  subtitle,
  headerActions,
  closeLabel,
  onClose,
  panelRef,
  children,
}: ProfileSideSheetPanelProps) {
  return (
    <div
      className="fixed inset-0 flex justify-end overscroll-none"
      style={{ zIndex: PROFILE_SIDE_SHEET_Z_INDEX }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/40 backdrop-blur-sm transition-opacity ease-in-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: `${PROFILE_SIDE_SHEET_BACKDROP_TRANSITION_MS}ms` }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative h-dvh max-h-dvh w-[var(--profile-side-sheet-width)] transition-transform ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
          visible ? 'translate-x-0' : 'translate-x-full motion-reduce:translate-x-0'
        }`}
        style={{
          ['--profile-side-sheet-width' as string]: `${PROFILE_SIDE_SHEET_WIDTH_PERCENT}%`,
          transitionDuration: `${PROFILE_SIDE_SHEET_PANEL_TRANSITION_MS}ms`,
        }}
      >
        <DrawerCloseTab edge="start" onClose={onClose} closeLabel={closeLabel} />
        <aside
          className="profile-side-sheet relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl"
          style={{
            zIndex: PROFILE_SIDE_SHEET_PANEL_Z_INDEX,
            borderTopLeftRadius: PROFILE_SIDE_SHEET_RADIUS_PX,
            borderBottomLeftRadius: PROFILE_SIDE_SHEET_RADIUS_PX,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-side-sheet-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="shrink-0 border-b border-gray-100 px-5 py-4">
            <div className="space-y-3">
              <div>
                <h2 id="profile-side-sheet-title" className="text-lg font-bold text-gray-900">
                  {title}
                </h2>
                {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
              </div>
              {headerActions ? <div className="flex flex-wrap gap-2">{headerActions}</div> : null}
            </div>
          </header>

          <div className="profile-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
        </aside>
      </div>
    </div>
  );
}

interface ProfileSideSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}

/** Cart-style side sheet for profile overlays (order details, etc.). */
export function ProfileSideSheet({
  isOpen,
  title,
  subtitle,
  headerActions,
  closeLabel,
  onClose,
  children,
}: ProfileSideSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { rendered, visible } = useDrawerTransition(isOpen, PROFILE_SIDE_SHEET_PANEL_TRANSITION_MS);

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
    <ProfileSideSheetPanel
      visible={visible}
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      closeLabel={closeLabel}
      onClose={onClose}
      panelRef={panelRef}
    >
      {children}
    </ProfileSideSheetPanel>,
    document.body,
  );
}
