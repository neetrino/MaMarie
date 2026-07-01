'use client';

import { CartEmptyState } from '../../components/cart/CartEmptyState';

interface EmptyCartProps {
  t: (key: string) => string;
}

export function EmptyCart({ t }: EmptyCartProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('common.cart.title')}</h1>
      <CartEmptyState t={t} />
    </div>
  );
}
