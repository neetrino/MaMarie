'use client';

import {
  MOBILE_HOME_BG,
  MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX,
  MOBILE_HOME_HERO_TO_FIRST_SECTION_GAP_PX,
  MOBILE_HOME_SECTION_GAP_PX,
} from '../../constants/mobile-home';
import type { HomeProductCardData } from './HomeProductCard';
import { MobileHomeHero } from './mobile/MobileHomeHero';
import { MobileHomeCopyright } from './mobile/MobileHomeCopyright';
import { MobileHomeProductSection } from './mobile/MobileHomeProductSection';
import { MobileHomeTestimonialsCarousel } from './mobile/MobileHomeTestimonialsCarousel';

interface MobileHomePageProps {
  products: HomeProductCardData[];
}

export function MobileHomePage({ products }: MobileHomePageProps) {
  return (
    <div
      className="mobile-home-page w-full max-w-full overflow-x-hidden lg:hidden"
      style={{ backgroundColor: MOBILE_HOME_BG }}
    >
      <MobileHomeHero />

      <div
        className="flex flex-col"
        style={{
          gap: MOBILE_HOME_SECTION_GAP_PX,
          paddingTop: MOBILE_HOME_HERO_TO_FIRST_SECTION_GAP_PX,
          paddingBottom: MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX,
        }}
      >
        <MobileHomeProductSection products={products} />
        <div className="flex flex-col">
          <MobileHomeTestimonialsCarousel />
          <MobileHomeCopyright />
        </div>
      </div>
    </div>
  );
}
