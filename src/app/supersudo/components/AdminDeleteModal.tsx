'use client';

import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react';
import { Button } from '@shop/ui';
import {
  ADMIN_DELETE_MODAL_BACKDROP_IN_CLASS,
  ADMIN_DELETE_MODAL_BACKDROP_OUT_CLASS,
  ADMIN_DELETE_MODAL_EXIT_FALLBACK_MS,
  ADMIN_DELETE_MODAL_PANEL_IN_CLASS,
  ADMIN_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
  ADMIN_DELETE_MODAL_PANEL_OUT_CLASS,
  ADMIN_DELETE_MODAL_Z_INDEX,
} from '../../../constants/admin-delete-modal';
import { useAnimatedModalDismiss } from '../../../lib/use-animated-modal-dismiss';
import { useTranslation } from '../../../lib/i18n-client';

interface AdminDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirming?: boolean;
  showCancel?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

interface CachedModalContent {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel: boolean;
}

interface AdminDeleteModalPanelProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  showCancel: boolean;
  confirming: boolean;
  actionsDisabled: boolean;
  panelMotionClass: string;
  onCancel: () => void;
  onConfirm: () => void;
  onAnimationEnd: (event: AnimationEvent<HTMLElement>) => void;
}

function AdminDeleteModalPanel({
  title,
  message,
  confirmLabel,
  cancelLabel,
  showCancel,
  confirming,
  actionsDisabled,
  panelMotionClass,
  onCancel,
  onConfirm,
  onAnimationEnd,
}: AdminDeleteModalPanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-delete-modal-title"
      aria-describedby="admin-delete-modal-message"
      className={`relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl ${panelMotionClass}`}
      onClick={(event) => event.stopPropagation()}
      onAnimationEnd={onAnimationEnd}
    >
      <h3 id="admin-delete-modal-title" className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p id="admin-delete-modal-message" className="text-sm leading-6 text-gray-600">
        {message}
      </p>
      <div className="mt-5 flex items-center justify-end gap-3">
        {showCancel ? (
          <Button variant="outline" onClick={onCancel} disabled={actionsDisabled} className="min-w-24">
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={actionsDisabled}
          className="min-w-24 !bg-red-600 !text-white hover:!bg-red-700 focus:!ring-red-600"
        >
          {confirming ? `${confirmLabel}...` : confirmLabel}
        </Button>
      </div>
    </div>
  );
}

function AdminDeleteModalShell({
  cancelLabel,
  actionsDisabled,
  backdropMotionClass,
  onCancel,
  children,
}: {
  cancelLabel: string;
  actionsDisabled: boolean;
  backdropMotionClass: string;
  onCancel: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: ADMIN_DELETE_MODAL_Z_INDEX }}
      role="presentation"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={cancelLabel}
        className={`absolute inset-0 cursor-default rounded-none bg-black/40 ${backdropMotionClass}`}
        onClick={() => {
          if (!actionsDisabled) {
            onCancel();
          }
        }}
      />
      {children}
    </div>
  );
}

/** Centered delete confirmation — shared across admin (categories, brands, bulk delete, etc.). */
export function AdminDeleteModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirming = false,
  showCancel = true,
  onCancel,
  onConfirm,
}: AdminDeleteModalProps) {
  const { t } = useTranslation();
  const {
    isVisible,
    isExiting,
    handlePanelAnimationEnd,
    backdropMotionClass,
    panelMotionClass,
  } = useAnimatedModalDismiss({
    isOpen,
    panelOutAnimationName: ADMIN_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
    exitFallbackMs: ADMIN_DELETE_MODAL_EXIT_FALLBACK_MS,
    backdropInClass: ADMIN_DELETE_MODAL_BACKDROP_IN_CLASS,
    backdropOutClass: ADMIN_DELETE_MODAL_BACKDROP_OUT_CLASS,
    panelInClass: ADMIN_DELETE_MODAL_PANEL_IN_CLASS,
    panelOutClass: ADMIN_DELETE_MODAL_PANEL_OUT_CLASS,
  });

  const [cached, setCached] = useState<CachedModalContent>({
    title,
    message,
    confirmText,
    cancelText,
    showCancel,
  });

  const actionsDisabled = confirming || isExiting;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setCached({ title, message, confirmText, cancelText, showCancel });
  }, [isOpen, title, message, confirmText, cancelText, showCancel]);

  useEffect(() => {
    if (!isVisible || actionsDisabled) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, actionsDisabled, onCancel]);

  if (!isVisible) {
    return null;
  }

  const confirmLabel = cached.confirmText ?? t('admin.common.delete');
  const cancelLabel = cached.cancelText ?? t('admin.common.cancel');

  return (
    <AdminDeleteModalShell
      cancelLabel={cancelLabel}
      actionsDisabled={actionsDisabled}
      backdropMotionClass={backdropMotionClass}
      onCancel={onCancel}
    >
      <AdminDeleteModalPanel
        title={cached.title}
        message={cached.message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        showCancel={cached.showCancel}
        confirming={confirming}
        actionsDisabled={actionsDisabled}
        panelMotionClass={panelMotionClass}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onAnimationEnd={handlePanelAnimationEnd}
      />
    </AdminDeleteModalShell>
  );
}
