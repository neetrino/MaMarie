import { unstable_cache } from 'next/cache';
import { DEFAULT_LANGUAGE } from '../../lib/language';
import { logger } from '../../lib/utils/logger';
import { productsService } from '../../lib/services/products.service';
import { BEST_PRODUCTS_CARD_COUNT } from '../../constants/home-sections';
import { MOBILE_HOME_PRODUCTS_VISIBLE_COUNT } from '../../constants/mobile-home';
import {
  fillBestProductsRow,
  getBestProductsFallbackList,
  mapToHomeProductCard,
} from './best-products-data';
import { MobileHomePage } from './MobileHomePage';

const MOBILE_HOME_PRODUCTS_REVALIDATE_SECONDS = 600;

const getMobileHomeProductsCached = unstable_cache(
  async (lang: string) => {
    try {
      const result = await productsService.findAll({
        filter: 'bestseller',
        limit: BEST_PRODUCTS_CARD_COUNT,
        page: 1,
        lang,
      });

      return result.data.map(mapToHomeProductCard);
    } catch (error) {
      logger.error('Failed to load mobile home products', { error, lang });
      return getBestProductsFallbackList();
    }
  },
  ['mobile-home-products-v1'],
  { revalidate: MOBILE_HOME_PRODUCTS_REVALIDATE_SECONDS },
);

export async function MobileHomeSection() {
  const products = fillBestProductsRow(await getMobileHomeProductsCached(DEFAULT_LANGUAGE));
  const rowCount = MOBILE_HOME_PRODUCTS_VISIBLE_COUNT * 2;

  return <MobileHomePage products={products.slice(0, rowCount)} />;
}
