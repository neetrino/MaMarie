import React, { Suspense } from 'react';
import type { Metadata } from 'next';
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
            <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
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

