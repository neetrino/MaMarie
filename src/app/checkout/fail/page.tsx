'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from '../../../lib/i18n-client';

function CheckoutFailContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-serif text-3xl text-stone-900">
        {t('checkout.paymentErrorTitle')}
      </h1>
      <p className="text-stone-600">{t('checkout.paymentErrorBody')}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/checkout"
          className="rounded bg-stone-900 px-6 py-3 text-sm text-white"
        >
          {t('checkout.tryAgain')}
        </Link>
        {orderNumber ? (
          <Link
            href={`/orders/${encodeURIComponent(orderNumber)}`}
            className="rounded border border-stone-300 px-6 py-3 text-sm text-stone-800"
          >
            {t('checkout.viewOrder')}
          </Link>
        ) : null}
      </div>
    </main>
  );
}

/**
 * Payment fail landing (avoids conflict with Next.js `checkout/error.tsx` boundary).
 */
export default function CheckoutFailPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutFailContent />
    </Suspense>
  );
}
