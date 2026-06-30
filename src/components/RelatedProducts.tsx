'use client';

import { useState, useEffect } from 'react';
import {
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  RELATED_PRODUCTS_CARD_GAP_PX,
  RELATED_PRODUCTS_GRID_OFFSET_TOP_PX,
} from '../constants/products-catalog';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
  BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX,
} from '../constants/home-sections';
import { getStoredLanguage, type LanguageCode } from '../lib/language';
import { t } from '../lib/i18n';
import { HomeSectionHeadingRow } from './home/HomeSectionHeading';
import { useRelatedProducts } from './hooks/useRelatedProducts';
import { RelatedProductCard } from './RelatedProducts/RelatedProductCard';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
  /** PDP: use dedicated related endpoint + cache (server resolves category). */
  productSlug?: string;
}

/**
 * Related products row — shop cards in a horizontal scroll (full card visible, swipe/drag to scroll).
 */
export function RelatedProducts({ categorySlug, currentProductId, productSlug }: RelatedProductsProps) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const { products, loading } = useRelatedProducts({
    categorySlug,
    currentProductId,
    language,
    productSlug,
  });

  useEffect(() => {
    setLanguage(getStoredLanguage());

    const handleLanguageUpdate = () => {
      setLanguage(getStoredLanguage());
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  const relatedRowStyle = {
    gap: RELATED_PRODUCTS_CARD_GAP_PX,
    paddingTop: RELATED_PRODUCTS_GRID_OFFSET_TOP_PX,
  } as const;

  return (
    <section className="py-12 mt-20 border-t border-gray-200">
      <HomeSectionHeadingRow
          id="related-products-heading"
          title={t(language, 'product.related_products_title')}
          seeAllHref="/products"
          seeAllLabel=""
          color={BEST_PRODUCTS_HEADING_COLOR}
          chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
          titleLineHeightPx={BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX}
          minHeightPx={BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX}
          headingPaddingYPx={BEST_PRODUCTS_HEADING_PADDING_Y_PX}
          showSeeAllLink={false}
        />

        {loading ? (
          <div className="scrollbar-hide flex overflow-x-auto overflow-y-visible pb-6" style={relatedRowStyle}>
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="shrink-0 animate-pulse rounded-[30px] bg-gray-100"
                style={{
                  width: PRODUCTS_CATALOG_CARD_WIDTH_PX,
                  height: PRODUCTS_CATALOG_CARD_HEIGHT_PX,
                }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t(language, 'product.noRelatedProducts')}</p>
          </div>
        ) : (
          <div
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-visible pb-6"
            style={relatedRowStyle}
          >
            {products.map((product, index) => (
              <RelatedProductCard
                key={product.id}
                product={product}
                imagePriority={index < 4}
              />
            ))}
          </div>
        )}
    </section>
  );
}
