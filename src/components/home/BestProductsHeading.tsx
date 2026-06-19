'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_CHEVRON_SIZE_PX,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
  BEST_PRODUCTS_LINK_FONT_SIZE_PX,
  BEST_PRODUCTS_LINK_GAP_PX,
  BEST_PRODUCTS_LINK_LINE_HEIGHT_PX,
  BEST_PRODUCTS_SECTION_MAX_WIDTH_PX,
  BEST_PRODUCTS_SECTION_OFFSET_TOP_PX,
  BEST_PRODUCTS_SECTION_PADDING_LEFT_PX,
  BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX,
  BEST_PRODUCTS_TITLE_FONT_SIZE_PX,
  BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX,
} from '../../constants/home-sections';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Section heading — Figma node `1:65` («Լավագույն ապրանքները»).
 */
export function BestProductsHeading() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="best-products-heading"
      className="w-full bg-white"
      style={{ paddingTop: BEST_PRODUCTS_SECTION_OFFSET_TOP_PX }}
    >
      <div
        className="mx-auto flex w-full items-center justify-between"
        style={{
          maxWidth: BEST_PRODUCTS_SECTION_MAX_WIDTH_PX,
          minHeight: BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
          paddingTop: BEST_PRODUCTS_HEADING_PADDING_Y_PX,
          paddingBottom: BEST_PRODUCTS_HEADING_PADDING_Y_PX,
          paddingLeft: BEST_PRODUCTS_SECTION_PADDING_LEFT_PX,
          paddingRight: BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX,
        }}
      >
        <h2
          id="best-products-heading"
          className="shrink-0 font-black"
          style={{
            color: BEST_PRODUCTS_HEADING_COLOR,
            fontSize: BEST_PRODUCTS_TITLE_FONT_SIZE_PX,
            lineHeight: `${BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('home.bestProducts.title')}
        </h2>

        <Link
          href="/products"
          className="inline-flex shrink-0 items-center font-bold transition-opacity hover:opacity-80"
          style={{
            gap: BEST_PRODUCTS_LINK_GAP_PX,
            color: BEST_PRODUCTS_HEADING_COLOR,
            fontSize: BEST_PRODUCTS_LINK_FONT_SIZE_PX,
            lineHeight: `${BEST_PRODUCTS_LINK_LINE_HEIGHT_PX}px`,
          }}
        >
          {t('common.search.seeAll')}
          <Image
            src={BEST_PRODUCTS_ASSETS.chevronRight}
            alt=""
            width={BEST_PRODUCTS_CHEVRON_SIZE_PX}
            height={BEST_PRODUCTS_CHEVRON_SIZE_PX}
            aria-hidden
            className="shrink-0"
          />
        </Link>
      </div>
    </section>
  );
}
