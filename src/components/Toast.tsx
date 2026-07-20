'use client';

import { useCallback, useEffect, useState } from 'react';
import { ALERT_EXIT_ANIMATION_MS } from '../constants/profile-desktop-page';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  phase: 'entering' | 'exiting';
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
  onStartExit: (id: string) => void;
}

function ToastItem({ toast, onClose, onStartExit }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onStartExit(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onStartExit]);

  useEffect(() => {
    if (toast.phase !== 'exiting') {
      return;
    }

    const exitTimer = setTimeout(() => {
      onClose(toast.id);
    }, ALERT_EXIT_ANIMATION_MS);

    return () => clearTimeout(exitTimer);
  }, [toast.phase, toast.id, onClose]);

  const bgColors = {
    success: 'border-brand-pink/30 bg-white text-gray-900',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-brand-pink',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const animationClass = toast.phase === 'exiting' ? 'animate-alert-out' : 'animate-alert-in';

  return (
    <div
      className={`
        ${bgColors[toast.type]}
        mb-3 flex w-full max-w-md items-start gap-3 rounded-2xl border p-4 shadow-lg
        ${animationClass}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onStartExit(toast.id)}
        className={`flex-shrink-0 ${iconColors[toast.type]} hover:opacity-70 transition-opacity`}
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<Toast, 'id' | 'phase'>>;
      if (!customEvent.detail) return;

      const newToast: Toast = {
        ...customEvent.detail,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        phase: 'entering',
      };
      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handleStartExit = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id && toast.phase !== 'exiting'
          ? { ...toast, phase: 'exiting' }
          : toast,
      ),
    );
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-md">
          <ToastItem
            toast={toast}
            onClose={handleClose}
            onStartExit={handleStartExit}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Show a toast notification — shared replacement for native `alert()`.
 * Appears from the top and auto-dismisses with slide animation.
 * @param message - The message to display
 * @param type - The type of toast (success, error, warning, info)
 * @param duration - Duration in milliseconds (default: 3000)
 */
export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent('show-toast', {
    detail: { message, type, duration },
  });
  window.dispatchEvent(event);
}
