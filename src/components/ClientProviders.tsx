'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider } from '../lib/auth/AuthContext';
import { LanguageHtmlUpdater } from './LanguageHtmlUpdater';
import { MobileRouteScrollReset } from './MobileRouteScrollReset';
import { LanguageScrollRestorer } from './LanguageScrollRestorer';
import { LazyCartDrawer, LazySearchModal } from './LazyClientOverlays';
import { ToastContainer } from './Toast';

/**
 * ClientProviders component
 * Wraps the app with all client-side providers (Auth, Theme, etc.)
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const originalConsoleError = console.error;
    const reactDevtoolsAsyncCleanupMessage =
      'We are cleaning up async info that was not on the parent Suspense boundary.';
    const reactDevtoolsExtensionId = 'chrome-extension://fmkadmapgofadopljbjfkapdkoienihi';

    console.error = (...args: unknown[]) => {
      const combined = args
        .map((value) => (typeof value === 'string' ? value : String(value)))
        .join(' ');

      const isDevtoolsNoise =
        combined.includes(reactDevtoolsAsyncCleanupMessage) &&
        combined.includes(reactDevtoolsExtensionId);

      if (isDevtoolsNoise) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <AuthProvider>
      <LanguageHtmlUpdater />
      <MobileRouteScrollReset />
      <LanguageScrollRestorer />
      {children}
      <LazyCartDrawer />
      <LazySearchModal />
      <ToastContainer />
    </AuthProvider>
  );
}
