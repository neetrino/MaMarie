import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';
import { ConditionalMobileBottomNav } from '../components/ConditionalMobileBottomNav';
import { ConditionalHeader } from '../components/ConditionalHeader';
import { ConditionalFooter } from '../components/ConditionalFooter';
import { MainContent } from '../components/MainContent';
import { NAV_LINKS } from '../constants/nav-links';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MAMARIE',
  description: 'MAMARIE — handmade clay art & gifts',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy" className="h-full overflow-x-clip" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans bg-white text-gray-900 antialiased min-h-full`}>
        <Suspense fallback={null}>
          <ClientProviders>
            <ConditionalHeader navLinks={NAV_LINKS} />
            <div className="layout-shell-mobile-bottom-clearance flex min-h-screen flex-col max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:pb-0">
              <MainContent>{children}</MainContent>
              <ConditionalFooter />
            </div>
            <ConditionalMobileBottomNav />
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}

