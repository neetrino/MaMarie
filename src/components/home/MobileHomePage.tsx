'use client';

import { MOBILE_HOME_BG, MOBILE_HOME_SECTION_GAP_PX } from '../../constants/mobile-home';
import type { HomeProductCardData } from './HomeProductCard';
import { MobileHomeHero } from './mobile/MobileHomeHero';
import { MobileHomeProductSection } from './mobile/MobileHomeProductSection';
import { MobileHomeTestimonialsCarousel } from './mobile/MobileHomeTestimonialsCarousel';

interface MobileHomePageProps {
  products: HomeProductCardData[];
}

export function MobileHomePage({ products }: MobileHomePageProps) {
  const firstRow = products.slice(0, 3);
  const secondRow = products.length > 3 ? products.slice(3) : products.slice(0, 3);

  return (
    <div className="lg:hidden" style={{ backgroundColor: MOBILE_HOME_BG }}>
      <MobileHomeHero />

      <div className="flex flex-col pb-8" style={{ gap: MOBILE_HOME_SECTION_GAP_PX }}>
        <MobileHomeProductSection products={firstRow} />
        <MobileHomeTestimonialsCarousel />
        <MobileHomeProductSection products={secondRow} />
      </div>
    </div>
  );
}
