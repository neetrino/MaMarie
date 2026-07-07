'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PartnerStoreList } from '@/components/stores/PartnerStoreList';
import type { PartnerStoreItem } from '@/lib/partner-stores/types';
import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n-client';
import { getStoredLanguage } from '@/lib/language';
import {
  STORES_LIST_MAX_HEIGHT_PX,
  STORES_MAP_MIN_HEIGHT_MOBILE_PX,
  STORES_MAP_MIN_HEIGHT_PX,
  STORES_PAGE_BG,
  STORES_PAGE_CARD_RADIUS_PX,
  STORES_PAGE_CARD_SHADOW,
  STORES_PAGE_COLUMN_GAP_PX,
  STORES_PAGE_MAX_WIDTH_PX,
} from '@/constants/stores-page';

const PartnerStoresMap = dynamic(
  () =>
    import('@/components/stores/PartnerStoresMap').then((module) => ({
      default: module.PartnerStoresMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-gray-100 text-sm text-brand-muted">
        …
      </div>
    ),
  },
);

export function StoresPageClient() {
  const { t } = useTranslation();
  const [stores, setStores] = useState<PartnerStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const lang = getStoredLanguage();
      const response = await apiClient.get<{ data: PartnerStoreItem[] }>(
        `/api/v1/partner-stores?lang=${lang}`,
      );
      const nextStores = response.data ?? [];
      setStores(nextStores);
      setSelectedStoreId((current) => current ?? nextStores[0]?.id ?? null);
    } catch {
      setStores([]);
      setSelectedStoreId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    const handleLanguageUpdated = () => {
      void fetchStores();
    };

    window.addEventListener('language-updated', handleLanguageUpdated);
    return () => window.removeEventListener('language-updated', handleLanguageUpdated);
  }, [fetchStores]);

  const cardStyle = useMemo(
    () => ({
      borderRadius: STORES_PAGE_CARD_RADIUS_PX,
      boxShadow: STORES_PAGE_CARD_SHADOW,
    }),
    [],
  );

  if (loading) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center px-5 lg:px-8"
        style={{ backgroundColor: STORES_PAGE_BG }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-brand-brown" />
          <p className="text-sm text-brand-muted">{t('stores.loading')}</p>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center px-5 lg:px-8"
        style={{ backgroundColor: STORES_PAGE_BG }}
      >
        <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-brand-pink">{t('stores.title')}</h1>
          <p className="mt-3 text-brand-muted">{t('stores.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-full px-5 pb-8 pt-7 lg:px-8 lg:pb-12 lg:pt-12"
      style={{ backgroundColor: STORES_PAGE_BG, maxWidth: STORES_PAGE_MAX_WIDTH_PX }}
    >
      <div className="mb-6 text-center lg:mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-[0.08em] text-brand-pink lg:text-3xl">
          {t('stores.title')}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-muted lg:mt-3 lg:text-base">
          {t('stores.description')}
        </p>
      </div>

      <div
        className="grid grid-cols-1 items-stretch lg:[grid-template-columns:380px_minmax(0,1fr)]"
        style={{ gap: STORES_PAGE_COLUMN_GAP_PX }}
      >
        <section
          className="bg-white p-4 lg:p-6"
          style={{ ...cardStyle, maxHeight: STORES_LIST_MAX_HEIGHT_PX }}
        >
          <PartnerStoreList
            stores={stores}
            selectedStoreId={selectedStoreId}
            onSelectStore={setSelectedStoreId}
            title={t('stores.partnerStoresTitle')}
            hint={t('stores.selectStoreHint')}
          />
        </section>

        <section
          className="bg-white p-4 lg:p-6"
          style={{
            ...cardStyle,
            minHeight: STORES_MAP_MIN_HEIGHT_MOBILE_PX,
          }}
        >
          <div className="h-full lg:min-h-[var(--stores-map-min-height)]" style={{ ['--stores-map-min-height' as string]: `${STORES_MAP_MIN_HEIGHT_PX}px` }}>
            <PartnerStoresMap
              stores={stores}
              selectedStoreId={selectedStoreId}
              onSelectStore={setSelectedStoreId}
              mapTitle={t('stores.storeMapTitle')}
              getDirectionsLabel={t('stores.getDirections')}
              className="h-full min-h-[320px] lg:min-h-[560px]"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
