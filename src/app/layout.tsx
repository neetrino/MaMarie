import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';
import { ConditionalHeader } from '../components/ConditionalHeader';
import { ConditionalFooter } from '../components/ConditionalFooter';
import { MainContent } from '../components/MainContent';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { NAV_LINKS } from '../constants/nav-links';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'MAMARIE',
  description: 'MAMARIE — handmade clay art & gifts',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy" className="h-full overflow-x-clip">
      <body className={`${montserrat.variable} font-sans bg-white text-gray-900 antialiased min-h-full`}>
        <Suspense fallback={null}>
          <ClientProviders>
            <div className="flex min-h-screen flex-col pb-16 max-lg:min-w-0 max-lg:max-w-full max-lg:overflow-x-hidden lg:pb-0">
              <ConditionalHeader navLinks={NAV_LINKS} />
              <MainContent>{children}</MainContent>
              <ConditionalFooter />
              <MobileBottomNav />
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}

