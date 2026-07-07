import type { HomeProductCardData } from './HomeProductCard';
import { BEST_PRODUCTS_SECTION_OFFSET_TOP_PX } from '../../constants/home-sections';
import { BestProductsBlock } from './BestProductsBlock';
import { HomePageSection } from './HomeSectionShell';

interface BestProductsSectionProps {
  products: HomeProductCardData[];
}

export function BestProductsSection({ products }: BestProductsSectionProps) {
  return (
    <HomePageSection offsetTopPx={BEST_PRODUCTS_SECTION_OFFSET_TOP_PX}>
      <BestProductsBlock products={products} />
    </HomePageSection>
  );
}
