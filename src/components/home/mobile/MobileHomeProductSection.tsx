'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
  MOBILE_HOME_PRODUCT_CARD_GAP_PX,
  MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
  MOBILE_HOME_SECTION_TITLE_COLOR,
  MOBILE_HOME_SECTION_TITLE_LINE_HEIGHT_PX,
  MOBILE_HOME_SECTION_TITLE_SIZE_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';
import type { HomeProductCardData } from '../HomeProductCard';
import { MobileCarouselDots } from './MobileCarouselDots';
import { MobileHomeProductCard } from './MobileHomeProductCard';
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
      className="relative w-full"
      aria-labelledby="mobile-for-you-heading"
      style={{ paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2, paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2 }}
    >
      <div className="relative mb-6 flex items-start justify-between pr-1">
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] transition-opacity hover:opacity-80"
          aria-label={t('common.search.seeAll')}
        >
          <Image src={MOBILE_HOME_ASSETS.chevronSection} alt="" width={40} height={40} />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto pb-4"
        style={{ gap: MOBILE_HOME_PRODUCT_CARD_GAP_PX }}
      >
        {products.map((product) => (
          <MobileHomeProductCard key={product.id} product={product} />
        ))}
      </div>

      <MobileCarouselDots count={products.length} activeIndex={activeIndex} className="mt-2" />
    </section>
  );
}
