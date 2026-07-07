import type { HomeProductCardData } from './HomeProductCard';
import { MOBILE_HOME_PRODUCTS_VISIBLE_COUNT } from '../../constants/mobile-home';
import { MobileHomePage } from './MobileHomePage';

interface MobileHomeSectionProps {
  products: HomeProductCardData[];
}

export function MobileHomeSection({ products }: MobileHomeSectionProps) {
  const rowCount = MOBILE_HOME_PRODUCTS_VISIBLE_COUNT * 2;

  return <MobileHomePage products={products.slice(0, rowCount)} />;
}
