'use client';

import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react';
import { Button } from '@shop/ui';
import {
  CONFIRM_DELETE_MODAL_BACKDROP_IN_CLASS,
  CONFIRM_DELETE_MODAL_BACKDROP_OUT_CLASS,
  CONFIRM_DELETE_MODAL_EXIT_FALLBACK_MS,
  CONFIRM_DELETE_MODAL_PANEL_IN_CLASS,
  CONFIRM_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
  CONFIRM_DELETE_MODAL_PANEL_OUT_CLASS,
  CONFIRM_DELETE_MODAL_Z_INDEX,
} from '../../constants/confirm-delete-modal';
import { useAnimatedModalDismiss } from '../../lib/use-animated-modal-dismiss';
import { useTranslation } from '../../lib/i18n-client';

export interface ConfirmDeleteModalProps {
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

interface ConfirmDeleteModalPanelProps {
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

function ConfirmDeleteModalPanel({
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
}: ConfirmDeleteModalPanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-modal-title"
      aria-describedby="confirm-delete-modal-message"
      className={`relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl ${panelMotionClass}`}
      onClick={(event) => event.stopPropagation()}
      onAnimationEnd={onAnimationEnd}
    >
      <h3 id="confirm-delete-modal-title" className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p id="confirm-delete-modal-message" className="text-sm leading-6 text-gray-600">
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

function ConfirmDeleteModalShell({
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
      style={{ zIndex: CONFIRM_DELETE_MODAL_Z_INDEX }}
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

/** Centered delete confirmation — storefront + admin. */
export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirming = false,
  showCancel = true,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation();
  const {
    isVisible,
    isExiting,
    handlePanelAnimationEnd,
    backdropMotionClass,
    panelMotionClass,
  } = useAnimatedModalDismiss({
    isOpen,
    panelOutAnimationName: CONFIRM_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
    exitFallbackMs: CONFIRM_DELETE_MODAL_EXIT_FALLBACK_MS,
    backdropInClass: CONFIRM_DELETE_MODAL_BACKDROP_IN_CLASS,
    backdropOutClass: CONFIRM_DELETE_MODAL_BACKDROP_OUT_CLASS,
    panelInClass: CONFIRM_DELETE_MODAL_PANEL_IN_CLASS,
    panelOutClass: CONFIRM_DELETE_MODAL_PANEL_OUT_CLASS,
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

  const confirmLabel = cached.confirmText ?? t('common.buttons.delete');
  const cancelLabel = cached.cancelText ?? t('common.buttons.cancel');

  return (
    <ConfirmDeleteModalShell
      cancelLabel={cancelLabel}
      actionsDisabled={actionsDisabled}
      backdropMotionClass={backdropMotionClass}
      onCancel={onCancel}
    >
      <ConfirmDeleteModalPanel
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
    </ConfirmDeleteModalShell>
  );
}
