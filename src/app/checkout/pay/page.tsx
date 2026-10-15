'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import { isSafeAmeriaPayUrl } from '../utils/ameria-pay-url';

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

    window.location.replace(decoded);
  }, [searchParams, t]);

  if (!error) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-serif text-3xl text-stone-900">{t('checkout.paymentErrorTitle')}</h1>
      <p className="text-stone-600">{error}</p>
    </main>
  );
}

/**
 * Legacy pay handoff. Checkout now opens the bank URL directly.
 * This route only remains so an old link still jumps straight to 3-D Secure.
 */
export default function CheckoutPayRedirectPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPayRedirectContent />
    </Suspense>
  );
}
