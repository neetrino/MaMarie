'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from '../../../lib/i18n-client';

const REDIRECT_DELAY_MS = 800;

function isSafeAmeriaPayUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      parsed.hostname.endsWith('ameriabank.am') &&
      parsed.pathname.includes('/Payments/Pay')
    );
  } catch {
    return false;
  }
}

function CheckoutPayRedirectContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rawUrl = searchParams.get('url');
    if (!rawUrl) {
      setError(t('checkout.paymentRedirectMissingUrl'));
      return;
    }

    let decoded: string;
    try {
      decoded = decodeURIComponent(rawUrl);
    } catch {
      setError(t('checkout.paymentRedirectInvalidUrl'));
      return;
    }

    if (!isSafeAmeriaPayUrl(decoded)) {
      setError(t('checkout.paymentRedirectInvalidUrl'));
      return;
    }

    const timer = window.setTimeout(() => {
      window.location.assign(decoded);
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [searchParams, t]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-serif text-3xl text-stone-900">
        {error ? t('checkout.paymentErrorTitle') : t('checkout.paymentRedirectTitle')}
      </h1>
      <p className="text-stone-600">
        {error ?? t('checkout.paymentRedirectBody')}
      </p>
    </main>
  );
}

/**
 * Intermediate page before bank Pay/3DS — shows status, then redirects to Ameriabank.
 */
export default function CheckoutPayRedirectPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPayRedirectContent />
    </Suspense>
  );
}
