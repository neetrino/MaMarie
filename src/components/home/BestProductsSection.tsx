import { unstable_cache } from 'next/cache';
import { DEFAULT_LANGUAGE } from '../../lib/language';
import { logger } from '../../lib/utils/logger';
import { productsService } from '../../lib/services/products.service';
import { BEST_PRODUCTS_CARD_COUNT } from '../../constants/home-sections';
import { BestProductsHeading } from './BestProductsHeading';
import { BestProductsGrid } from './BestProductsGrid';
import {
  fillBestProductsRow,
  getBestProductsFallbackList,
  mapToHomeProductCard,
} from './best-products-data';

const BEST_PRODUCTS_REVALIDATE_SECONDS = 600;

const getBestProductsCached = unstable_cache(
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
      logger.error('Failed to load home best products', { error, lang });
      return getBestProductsFallbackList();
    }
  },
  ['home-best-products-v1'],
  { revalidate: BEST_PRODUCTS_REVALIDATE_SECONDS }
);

export async function BestProductsSection() {
  const products = fillBestProductsRow(await getBestProductsCached(DEFAULT_LANGUAGE));

  return (
    <>
      <BestProductsHeading />
      <BestProductsGrid products={products} />
    </>
  );
}
