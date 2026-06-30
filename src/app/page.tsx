import { Suspense } from 'react';
import { AboutUsSection } from '../components/home/AboutUsSection';
import { BestProductsSection } from '../components/home/BestProductsSection';
import { BestProductsSectionSkeleton } from '../components/home/BestProductsSectionSkeleton';
import { HeroSection } from '../components/home/HeroSection';
import { MobileHomeSection } from '../components/home/MobileHomeSection';
import { SaleSection } from '../components/home/SaleSection';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { DesktopFluidFrame } from '../components/DesktopFluidFrame';
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

      <DesktopFluidFrame className="hidden min-h-screen bg-white lg:flex">
        <div className="flex min-h-screen w-full flex-col bg-white">
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
      </DesktopFluidFrame>
    </>
  );
}
