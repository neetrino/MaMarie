'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export type ConfirmDeleteOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type ActiveConfirmDelete = {
  options: ConfirmDeleteOptions;
  resolve: (accepted: boolean) => void;
};

type ConfirmDeleteContextValue = {
  /** Opens the shared delete confirmation modal. Resolves `true` if confirmed. */
  confirmDelete: (options: ConfirmDeleteOptions | string) => Promise<boolean>;
};

const ConfirmDeleteContext = createContext<ConfirmDeleteContextValue | null>(null);

function toOptions(options: ConfirmDeleteOptions | string): ConfirmDeleteOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return { ...options };
}

export function ConfirmDeleteProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<ActiveConfirmDelete | null>(null);
  const queueRef = useRef<ActiveConfirmDelete[]>([]);

  const openConfirm = useCallback((rawOptions: ConfirmDeleteOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const request: ActiveConfirmDelete = {
        options: toOptions(rawOptions),
        resolve,
      };
      setActive((current) => {
        if (current) {
          queueRef.current.push(request);
          return current;
        }
        return request;
      });
    });
  }, []);

  const finish = useCallback(
    (accepted: boolean) => {
      if (!active) {
        return;
      }
      active.resolve(accepted);
      const next = queueRef.current.shift() ?? null;
      setActive(next);
    },
    [active],
  );

  const contextValue = useMemo(
    () => ({
      confirmDelete: openConfirm,
    }),
    [openConfirm],
  );

  return (
    <ConfirmDeleteContext.Provider value={contextValue}>
      {children}
      <ConfirmDeleteModal
        isOpen={Boolean(active)}
        title={active?.options.title ?? t('common.dialogs.confirmDeleteTitle')}
        message={active?.options.message ?? ''}
        confirmText={active?.options.confirmText ?? t('common.buttons.delete')}
        cancelText={active?.options.cancelText ?? t('common.buttons.cancel')}
        onCancel={() => finish(false)}
        onConfirm={() => finish(true)}
      />
    </ConfirmDeleteContext.Provider>
  );
}

/** Global delete confirmation — use anywhere under ClientProviders. */
export function useConfirmDelete(): ConfirmDeleteContextValue {
  const context = useContext(ConfirmDeleteContext);
  if (!context) {
    throw new Error('useConfirmDelete must be used within ConfirmDeleteProvider');
  }
  return context;
}
