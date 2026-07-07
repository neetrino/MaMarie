'use client';

import { Button } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

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
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  const resolvedConfirmText = confirmText ?? t('admin.common.delete');
  const resolvedCancelText = cancelText ?? t('admin.common.cancel');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm leading-6 text-gray-600">{message}</p>

        <div className="mt-5 flex items-center justify-end gap-3">
          {showCancel ? (
            <Button variant="outline" onClick={onCancel} disabled={confirming} className="min-w-24">
              {resolvedCancelText}
            </Button>
          ) : null}
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={confirming}
            className="min-w-24 !bg-red-600 !text-white hover:!bg-red-700 focus:!ring-red-600"
          >
            {confirming ? `${resolvedConfirmText}...` : resolvedConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
