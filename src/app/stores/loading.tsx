import { BRAND_LOADING_SPINNER_CLASS } from '../../constants/brand';
import { STORES_PAGE_MOBILE_BG } from '../../constants/stores-page';

export default function StoresLoading() {
  return (
    <div
      className="mobile-stores-page flex min-h-[50vh] items-center justify-center max-lg:bg-[var(--stores-loading-mobile-bg)] lg:bg-white"
      style={{ ['--stores-loading-mobile-bg' as string]: STORES_PAGE_MOBILE_BG }}
      aria-busy="true"
      aria-label="Loading stores"
    >
      <div className={`h-10 w-10 ${BRAND_LOADING_SPINNER_CLASS}`} />
    </div>
  );
}
