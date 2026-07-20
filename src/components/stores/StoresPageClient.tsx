'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PartnerStoreList } from '@/components/stores/PartnerStoreList';
import { HomeSectionHeadingRow } from '@/components/home/HomeSectionHeading';
import type { PartnerStoreItem } from '@/lib/partner-stores/types';
import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n-client';
import { getStoredLanguage } from '@/lib/language';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_HEADING_COLOR,
} from '@/constants/home-sections';
import {
  STORES_LIST_PANEL_WIDTH_PX,
  STORES_MAP_MIN_HEIGHT_MOBILE_PX,
  STORES_PAGE_BG,
  STORES_PAGE_CARD_RADIUS_PX,
  STORES_PAGE_CARD_SHADOW,
  STORES_PAGE_COLUMN_GAP_PX,
  STORES_PAGE_HEADING_BOTTOM_GAP_LG_PX,
  STORES_PAGE_HEADING_BOTTOM_GAP_PX,
  STORES_PAGE_HEADING_MIN_HEIGHT_PX,
  STORES_PAGE_HEADING_PADDING_Y_PX,
  STORES_PAGE_HORIZONTAL_PADDING_LEFT_PX,
  STORES_PAGE_HORIZONTAL_PADDING_RIGHT_PX,
  STORES_PAGE_MAX_WIDTH_PX,
  STORES_PAGE_MOBILE_PADDING_PX,
  STORES_PAGE_MOBILE_TITLE_FONT_SIZE_PX,
  STORES_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX,
  STORES_PAGE_TITLE_FONT_SIZE_PX,
  STORES_PAGE_TITLE_LINE_HEIGHT_PX,
  STORES_PANEL_HEIGHT_PX,
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
  const [focusStoreId, setFocusStoreId] = useState<string | null>(null);

  const handleSelectStoreFromList = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    setFocusStoreId(storeId);
  }, []);

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

  const panelStyle = useMemo(
    () => ({
      borderRadius: STORES_PAGE_CARD_RADIUS_PX,
      boxShadow: STORES_PAGE_CARD_SHADOW,
      ['--stores-panel-height' as string]: `${STORES_PANEL_HEIGHT_PX}px`,
    }),
    [],
  );

  const pageInsetStyle = {
    backgroundColor: STORES_PAGE_BG,
    maxWidth: STORES_PAGE_MAX_WIDTH_PX,
    ['--stores-page-padding-left' as string]: `${STORES_PAGE_HORIZONTAL_PADDING_LEFT_PX}px`,
    ['--stores-page-padding-right' as string]: `${STORES_PAGE_HORIZONTAL_PADDING_RIGHT_PX}px`,
    ['--stores-page-padding-x-mobile' as string]: `${STORES_PAGE_MOBILE_PADDING_PX}px`,
  };

  const pageInsetClassName =
    'max-lg:px-[var(--stores-page-padding-x-mobile)] lg:pl-[var(--stores-page-padding-left)] lg:pr-[var(--stores-page-padding-right)]';

  if (loading) {
    return (
      <div
        className={`mx-auto flex min-h-[50vh] w-full max-w-full items-center justify-center ${pageInsetClassName}`}
        style={pageInsetStyle}
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
        className={`mx-auto flex min-h-[50vh] w-full max-w-full items-center justify-center ${pageInsetClassName}`}
        style={pageInsetStyle}
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
      className={`mx-auto w-full max-w-full pb-8 pt-7 lg:pb-12 lg:pt-12 ${pageInsetClassName}`}
      style={pageInsetStyle}
    >
      <header
        className="mb-[var(--stores-heading-gap)] lg:mb-[var(--stores-heading-gap-lg)]"
        style={{
          ['--stores-heading-gap' as string]: `${STORES_PAGE_HEADING_BOTTOM_GAP_PX}px`,
          ['--stores-heading-gap-lg' as string]: `${STORES_PAGE_HEADING_BOTTOM_GAP_LG_PX}px`,
        }}
      >
        <HomeSectionHeadingRow
          id="stores-page-heading"
          title={t('stores.title')}
          seeAllHref="/stores"
          seeAllLabel=""
          color={BEST_PRODUCTS_HEADING_COLOR}
          chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
          titleFontSizePx={STORES_PAGE_TITLE_FONT_SIZE_PX}
          titleLineHeightPx={STORES_PAGE_TITLE_LINE_HEIGHT_PX}
          minHeightPx={STORES_PAGE_HEADING_MIN_HEIGHT_PX}
          headingPaddingYPx={STORES_PAGE_HEADING_PADDING_Y_PX}
          mobileTitleFontSizePx={STORES_PAGE_MOBILE_TITLE_FONT_SIZE_PX}
          mobileTitleLineHeightPx={STORES_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX}
          showSeeAllLink={false}
        />
      </header>

      <div
        className="grid grid-cols-1 items-stretch lg:[grid-template-columns:var(--stores-list-width)_minmax(0,1fr)]"
        style={{
          gap: STORES_PAGE_COLUMN_GAP_PX,
          ['--stores-list-width' as string]: `${STORES_LIST_PANEL_WIDTH_PX}px`,
        }}
      >
        <section
          className="flex min-h-0 flex-col bg-white p-4 lg:h-[var(--stores-panel-height)] lg:p-6"
          style={panelStyle}
        >
          <PartnerStoreList
            stores={stores}
            selectedStoreId={selectedStoreId}
            onSelectStore={handleSelectStoreFromList}
            title={t('stores.partnerStoresTitle')}
            hint={t('stores.selectStoreHint')}
          />
        </section>

        <section
          className="relative z-0 flex min-h-0 flex-col bg-white p-4 lg:h-[var(--stores-panel-height)] lg:p-6"
          style={{ ...panelStyle, minHeight: STORES_MAP_MIN_HEIGHT_MOBILE_PX }}
        >
          <div className="min-h-[320px] flex-1">
            <PartnerStoresMap
              stores={stores}
              focusStoreId={focusStoreId}
              onFocusStoreHandled={() => setFocusStoreId(null)}
              onSelectStore={setSelectedStoreId}
              mapTitle={t('stores.storeMapTitle')}
              getDirectionsLabel={t('stores.getDirections')}
              className="h-full min-h-[320px]"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
