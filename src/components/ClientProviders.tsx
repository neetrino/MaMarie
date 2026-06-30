'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '../lib/auth/AuthContext';
import { LanguageHtmlUpdater } from './LanguageHtmlUpdater';
import { LanguageScrollRestorer } from './LanguageScrollRestorer';
import { CartDrawer } from './cart/CartDrawer';
import { SearchModal } from './search/SearchModal';
import { ToastContainer } from './Toast';

/**
 * ClientProviders component
 * Wraps the app with all client-side providers (Auth, Theme, etc.)
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageHtmlUpdater />
      <LanguageScrollRestorer />
      {children}
      <CartDrawer />
      <SearchModal />
      <ToastContainer />
    </AuthProvider>
  );
}
