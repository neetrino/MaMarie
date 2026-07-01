'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
  MOBILE_HOME_PRODUCT_CARD_GAP_PX,
  MOBILE_HOME_PRODUCT_CARD_TOP_BLEED_PX,
  MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
  MOBILE_HOME_SECTION_SEE_ALL_ARROW_SIZE_PX,
  MOBILE_HOME_SECTION_SEE_ALL_BUTTON_PADDING_PX,
  MOBILE_HOME_SECTION_SEE_ALL_BUTTON_RADIUS_PX,
  MOBILE_HOME_SECTION_SEE_ALL_BUTTON_SIZE_PX,
  MOBILE_HOME_SECTION_TITLE_COLOR,
  MOBILE_HOME_SECTION_TITLE_LINE_HEIGHT_PX,
  MOBILE_HOME_SECTION_TITLE_SIZE_PX,
  MOBILE_HOME_SECTION_TITLE_TO_CARDS_GAP_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';
import type { HomeProductCardData } from '../HomeProductCard';
import { HomeProductCard } from '../HomeProductCard';
import { MobileCarouselDots } from './MobileCarouselDots';
import { useHorizontalScrollIndex } from './useHorizontalScrollIndex';

interface MobileHomeProductSectionProps {
  products: HomeProductCardData[];
  seeAllHref?: string;
}

export function MobileHomeProductSection({
  products,
  seeAllHref = '/products',
}: MobileHomeProductSectionProps) {
  const { t } = useTranslation();
  const itemStridePx = MOBILE_HOME_PRODUCT_CARD_WIDTH_PX + MOBILE_HOME_PRODUCT_CARD_GAP_PX;
  const { scrollRef, activeIndex } = useHorizontalScrollIndex({
    itemCount: products.length,
    itemStridePx,
  });

  return (
    <section
      className="relative w-full max-w-full overflow-x-clip overflow-y-visible"
      aria-labelledby="mobile-for-you-heading"
      style={{ paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2, paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2 }}
    >
      <div
        className="relative flex items-start justify-between pr-1"
        style={{ marginBottom: MOBILE_HOME_SECTION_TITLE_TO_CARDS_GAP_PX }}
      >
        <h2
          id="mobile-for-you-heading"
          className="font-black"
          style={{
            color: MOBILE_HOME_SECTION_TITLE_COLOR,
            fontSize: MOBILE_HOME_SECTION_TITLE_SIZE_PX,
            lineHeight: `${MOBILE_HOME_SECTION_TITLE_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('home.mobile.forYou')}
        </h2>

        <Link
          href={seeAllHref}
          className="flex shrink-0 items-center justify-center bg-white transition-opacity hover:opacity-80"
          style={{
            width: MOBILE_HOME_SECTION_SEE_ALL_BUTTON_SIZE_PX,
            height: MOBILE_HOME_SECTION_SEE_ALL_BUTTON_SIZE_PX,
            borderRadius: MOBILE_HOME_SECTION_SEE_ALL_BUTTON_RADIUS_PX,
            padding: MOBILE_HOME_SECTION_SEE_ALL_BUTTON_PADDING_PX,
          }}
          aria-label={t('common.search.seeAll')}
        >
          <Image
            src={MOBILE_HOME_ASSETS.sectionSeeAllArrow}
            alt=""
            width={MOBILE_HOME_SECTION_SEE_ALL_ARROW_SIZE_PX}
            height={MOBILE_HOME_SECTION_SEE_ALL_ARROW_SIZE_PX}
            className="rotate-90"
          />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-visible pb-4"
        style={{
          gap: MOBILE_HOME_PRODUCT_CARD_GAP_PX,
          paddingTop: MOBILE_HOME_PRODUCT_CARD_TOP_BLEED_PX,
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 snap-start">
            <HomeProductCard
              product={product}
              layoutWidthPx={MOBILE_HOME_PRODUCT_CARD_WIDTH_PX}
              compactPanel
              disableHoverEffects
            />
          </div>
        ))}
      </div>

      <MobileCarouselDots count={products.length} activeIndex={activeIndex} className="mt-2" />
    </section>
  );
}
