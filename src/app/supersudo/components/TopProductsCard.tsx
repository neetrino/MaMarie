'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import {
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../../constants/admin-desktop-page';
import { formatCurrency } from '../utils/dashboardUtils';
import { AdminClaySectionCard } from './AdminClaySectionCard';

interface TopProduct {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  image?: string | null;
}

interface TopProductsCardProps {
  topProducts: TopProduct[];
  topProductsLoading: boolean;
}

export function TopProductsCard({ topProducts, topProductsLoading }: TopProductsCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AdminClaySectionCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('admin.dashboard.topSellingProducts')}</h2>
        <button
          type="button"
          onClick={() => router.push('/supersudo/products')}
          className="text-sm font-semibold text-brand-pink transition-opacity hover:opacity-80"
        >
          {t('admin.dashboard.viewAll')}
        </button>
      </div>
      <div className="space-y-3">
        {topProductsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 rounded-[15px] bg-gray-100" />
              </div>
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-600">
            <p>{t('admin.dashboard.noSalesData')}</p>
          </div>
        ) : (
          topProducts.map((product, index) => (
            <button
              key={product.variantId}
              type="button"
              className={`flex w-full items-center gap-4 p-3 text-left ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}
              onClick={() => router.push(`/supersudo/products/${product.productId}`)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fdeef2] text-sm font-bold text-brand-pink">
                {index + 1}
              </div>
              {product.image ? (
                <div className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-12 w-12 rounded-[12px] object-cover"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{product.title}</p>
                <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {t('admin.dashboard.sold').replace('{count}', product.totalQuantity.toString())} •{' '}
                  {t('admin.dashboard.orders').replace('{count}', product.orderCount.toString())}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.totalRevenue, 'USD')}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </AdminClaySectionCard>
  );
}
