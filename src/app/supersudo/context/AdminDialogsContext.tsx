'use client';

import { Button } from '@shop/ui';
import { ADMIN_DANGER_BUTTON_CLASS, ADMIN_OUTLINE_BUTTON_CLASS, ADMIN_PRIMARY_BUTTON_CLASS } from '../../../constants/admin-ui-classes';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import { AdminSideSheet } from '../components/AdminSideSheet';

type DialogType = 'confirm' | 'alert';

type ConfirmDialogOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type AlertDialogOptions = {
  title?: string;
  message: string;
  confirmText?: string;
};

type ActiveDialog = {
  type: DialogType;
  options: ConfirmDialogOptions;
  resolve: (accepted: boolean) => void;
};

type AdminDialogsContextValue = {
  confirm: (options: ConfirmDialogOptions | string) => Promise<boolean>;
  alert: (options: AlertDialogOptions | string) => Promise<void>;
};

const AdminDialogsContext = createContext<AdminDialogsContextValue | null>(null);

const toConfirmOptions = (
  options: ConfirmDialogOptions | AlertDialogOptions | string,
): ConfirmDialogOptions => {
  if (typeof options === 'string') {
    return { message: options };
  }

  return { ...options };
};

export function AdminDialogsProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const queueRef = useRef<ActiveDialog[]>([]);

  const openDialog = useCallback(
    (type: DialogType, rawOptions: ConfirmDialogOptions | AlertDialogOptions | string) =>
      new Promise<boolean>((resolve) => {
        const options = toConfirmOptions(rawOptions);
        const request: ActiveDialog = { type, options, resolve };
        setActiveDialog((current) => {
          if (current) {
            queueRef.current.push(request);
            return current;
          }

          return request;
        });
      }),
    [],
  );

  const shiftQueue = useCallback(() => {
    const nextDialog = queueRef.current.shift() ?? null;
    setActiveDialog(nextDialog);
  }, []);

  const finishDialog = useCallback(
    (accepted: boolean) => {
      if (!activeDialog) {
        return;
      }

      activeDialog.resolve(accepted);
      shiftQueue();
    },
    [activeDialog, shiftQueue],
  );

  const confirm = useCallback(
    (options: ConfirmDialogOptions | string) => openDialog('confirm', options),
    [openDialog],
  );

  const alert = useCallback(
    async (options: AlertDialogOptions | string) => {
      await openDialog('alert', options);
    },
    [openDialog],
  );

  const contextValue = useMemo(
    () => ({
      confirm,
      alert,
    }),
    [alert, confirm],
  );

  const dialogFooter = activeDialog ? (
    <div className="flex items-center justify-end gap-3">
      {activeDialog.type === 'confirm' ? (
        <Button
          variant="outline"
          onClick={() => {
            finishDialog(false);
          }}
          className={ADMIN_OUTLINE_BUTTON_CLASS}
        >
          {activeDialog.options.cancelText ?? t('admin.common.cancel')}
        </Button>
      ) : null}
      <Button
        variant="primary"
        onClick={() => {
          finishDialog(true);
        }}
        className={
          activeDialog.options.destructive ? ADMIN_DANGER_BUTTON_CLASS : ADMIN_PRIMARY_BUTTON_CLASS
        }
      >
        {activeDialog.options.confirmText ??
          (activeDialog.type === 'confirm' ? t('admin.common.confirm') : t('admin.common.close'))}
      </Button>
    </div>
  ) : null;

  return (
    <AdminDialogsContext.Provider value={contextValue}>
      {children}

      <AdminSideSheet
        isOpen={Boolean(activeDialog)}
        title={activeDialog?.options.title ?? t('admin.common.confirm')}
        closeLabel={t('admin.common.close')}
        onClose={() => {
          finishDialog(false);
        }}
        footer={dialogFooter}
      >
        {activeDialog ? (
          <p className="text-sm leading-6 text-gray-600">{activeDialog.options.message}</p>
        ) : null}
      </AdminSideSheet>
    </AdminDialogsContext.Provider>
  );
}

export function useAdminDialogs(): AdminDialogsContextValue {
  const context = useContext(AdminDialogsContext);
  if (!context) {
    throw new Error('useAdminDialogs must be used within AdminDialogsProvider');
  }
  return context;
}
