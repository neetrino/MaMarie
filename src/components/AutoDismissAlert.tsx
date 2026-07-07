'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ALERT_AUTO_DISMISS_MS,
  ALERT_EXIT_ANIMATION_MS,
  TOP_ALERT_ERROR_CLASS,
  TOP_ALERT_SUCCESS_CLASS,
  TOP_ALERT_Z_INDEX,
  TOP_ALERT_CONTAINER_TOP_PADDING_PX,
} from '../constants/profile-desktop-page';

export type AutoDismissAlertVariant = 'success' | 'error';

const VARIANT_CLASS: Record<AutoDismissAlertVariant, string> = {
  success: TOP_ALERT_SUCCESS_CLASS,
  error: TOP_ALERT_ERROR_CLASS,
};

interface AlertDisplayState {
  message: string;
  phase: 'entering' | 'exiting';
}

interface AutoDismissAlertProps {
  message: string | null;
  variant: AutoDismissAlertVariant;
  onDismiss: () => void;
  autoDismiss?: boolean;
  autoDismissMs?: number;
}

export function AutoDismissAlert({
  message,
  variant,
  onDismiss,
  autoDismiss = false,
  autoDismissMs = ALERT_AUTO_DISMISS_MS,
}: AutoDismissAlertProps) {
  const [mounted, setMounted] = useState(false);
  const [displayState, setDisplayState] = useState<AlertDisplayState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!message) {
      setDisplayState((prev) => {
        if (prev && prev.phase !== 'exiting') {
          return { ...prev, phase: 'exiting' };
        }
        return prev;
      });
      return;
    }

    setDisplayState({ message, phase: 'entering' });

    if (!autoDismiss) {
      return;
    }

    const dismissTimer = setTimeout(() => {
      setDisplayState((prev) => (prev ? { ...prev, phase: 'exiting' } : null));
    }, autoDismissMs);

    return () => clearTimeout(dismissTimer);
  }, [message, autoDismiss, autoDismissMs]);

  useEffect(() => {
    if (displayState?.phase !== 'exiting') {
      return;
    }

    const exitTimer = setTimeout(() => {
      setDisplayState(null);
      onDismiss();
    }, ALERT_EXIT_ANIMATION_MS);

    return () => clearTimeout(exitTimer);
  }, [displayState?.phase, onDismiss]);

  if (!mounted || !displayState) {
    return null;
  }

  const animationClass =
    displayState.phase === 'exiting' ? 'animate-top-banner-out' : 'animate-top-banner-in';

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 flex justify-center px-4"
      style={{ zIndex: TOP_ALERT_Z_INDEX, paddingTop: TOP_ALERT_CONTAINER_TOP_PADDING_PX }}
    >
      <div
        className={`pointer-events-auto ${VARIANT_CLASS[variant]} ${animationClass}`}
        role="alert"
      >
        {displayState.message}
      </div>
    </div>,
    document.body,
  );
}
