'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_SEARCH_HEIGHT_PX,
  MOBILE_HOME_SEARCH_ICON_LEFT_PX,
  MOBILE_HOME_SEARCH_ICON_SIZE_PX,
  MOBILE_HOME_SEARCH_INPUT_PADDING_LEFT_PX,
  MOBILE_HOME_SEARCH_RADIUS_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';

/** Figma `74:748` + `74:750` — mobile home hero search pill. */
export function MobileHomeSearchField() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearchFocus = () => {
    router.push('/products');
  };

  return (
    <div className="relative w-full">
      <label htmlFor="mobile-home-search" className="sr-only">
        {t('home.mobile.searchPlaceholder')}
      </label>
      <input
        id="mobile-home-search"
        type="search"
        readOnly
        onFocus={handleSearchFocus}
        placeholder={t('home.mobile.searchPlaceholder')}
        className="w-full border-none bg-white text-sm text-[rgba(0,0,0,0.72)] outline-none placeholder:text-[rgba(0,0,0,0.45)]"
        style={{
          height: MOBILE_HOME_SEARCH_HEIGHT_PX,
          borderRadius: MOBILE_HOME_SEARCH_RADIUS_PX,
          paddingLeft: MOBILE_HOME_SEARCH_INPUT_PADDING_LEFT_PX,
          paddingRight: 16,
        }}
      />
      <Image
        src={MOBILE_HOME_ASSETS.search}
        alt=""
        width={MOBILE_HOME_SEARCH_ICON_SIZE_PX}
        height={MOBILE_HOME_SEARCH_ICON_SIZE_PX}
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ left: MOBILE_HOME_SEARCH_ICON_LEFT_PX }}
      />
    </div>
  );
}
