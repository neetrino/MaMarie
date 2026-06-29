import { Suspense } from 'react';
import { AboutUsSection } from '../components/home/AboutUsSection';
import { BestProductsSection } from '../components/home/BestProductsSection';
import { BestProductsSectionSkeleton } from '../components/home/BestProductsSectionSkeleton';
import { HeroSection } from '../components/home/HeroSection';
import { MobileHomeSection } from '../components/home/MobileHomeSection';
import { SaleSection } from '../components/home/SaleSection';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { LazyWhenVisible } from '../components/LazyWhenVisible';
import {
  HOME_ABOUT_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
  HOME_SALE_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
  HOME_WHY_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
} from '../constants/lazy-loading';

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <MobileHomeSection />
      </Suspense>

      <div className="hidden min-h-screen bg-white lg:block">
        <HeroSection />
        <div className="relative isolate z-[21]">
          <Suspense fallback={<BestProductsSectionSkeleton />}>
            <BestProductsSection />
          </Suspense>
          <LazyWhenVisible minHeightPx={HOME_SALE_SECTION_PLACEHOLDER_MIN_HEIGHT_PX}>
            <SaleSection />
          </LazyWhenVisible>
          <LazyWhenVisible minHeightPx={HOME_WHY_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX}>
            <WhyUsSection />
          </LazyWhenVisible>
          <LazyWhenVisible minHeightPx={HOME_ABOUT_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX}>
            <AboutUsSection />
          </LazyWhenVisible>
        </div>
      </div>
    </>
  );
}
