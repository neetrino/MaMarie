'use client';

import { useEffect } from 'react';
import {
  HOME_GENDER_CATEGORY_SLUG,
  homeGenderCategoryProductsHref,
} from '../../constants/home-gender-categories';
import { warmStorefrontCatalogRoute } from '../../lib/storefront/storefront-catalog-prefetch';

const HOME_GENDER_PREFETCH_IDLE_TIMEOUT_MS = 4_000;
const HOME_GENDER_PREFETCH_FALLBACK_DELAY_MS = 2_000;

/** Warms default + girls/boys catalog APIs while the home page is visible. */
export function HomeGenderCatalogPrefetch() {
  useEffect(() => {
    const warmGenderCatalogs = () => {
      warmStorefrontCatalogRoute('/products');
      warmStorefrontCatalogRoute(
        homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.girls)
      );
      warmStorefrontCatalogRoute(
        homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.boys)
      );
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(warmGenderCatalogs, {
        timeout: HOME_GENDER_PREFETCH_IDLE_TIMEOUT_MS,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warmGenderCatalogs, HOME_GENDER_PREFETCH_FALLBACK_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return null;
}
