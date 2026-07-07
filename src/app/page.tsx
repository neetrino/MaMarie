import { AboutUsSection } from '../components/home/AboutUsSection';
import { BestProductsSection } from '../components/home/BestProductsSection';
import { HeroSection } from '../components/home/HeroSection';
import { HomeGenderCatalogPrefetch } from '../components/home/HomeGenderCatalogPrefetch';
import { MobileHomeSection } from '../components/home/MobileHomeSection';
import { SaleSection } from '../components/home/SaleSection';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { DesktopFluidFrame } from '../components/DesktopFluidFrame';
import { LazyWhenVisible } from '../components/LazyWhenVisible';
import { DEFAULT_LANGUAGE } from '../lib/language';
import { getHomeFeaturedProductsCached } from '../lib/services/home-featured-products';
import {
  HOME_ABOUT_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
  HOME_SALE_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
  HOME_WHY_US_SECTION_PLACEHOLDER_MIN_HEIGHT_PX,
} from '../constants/lazy-loading';

export default async function HomePage() {
  const featuredProducts = await getHomeFeaturedProductsCached(DEFAULT_LANGUAGE);

  return (
    <>
      <HomeGenderCatalogPrefetch />
      <MobileHomeSection products={featuredProducts} />

      <DesktopFluidFrame className="hidden min-h-screen bg-white lg:flex">
        <div className="flex min-h-screen w-full flex-col bg-white">
          <HeroSection />
          <div className="relative isolate z-[21]">
            <BestProductsSection products={featuredProducts} />
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
