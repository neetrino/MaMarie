import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from '../../components/home/HomeSectionShell';
import {
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX,
  PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
  PRODUCTS_CATALOG_TOP_ROW_PB_PX,
} from '../../constants/products-catalog';

/**
 * Shell for /products while catalog data streams in (layout-stable, no spinners).
 */
export function ProductsCatalogSkeleton() {
  return (
    <HomeContentHorizontalFrame>
      <HomeSectionContent>
        <div className="animate-pulse" aria-busy="true" aria-label="Loading products">
      <div className="space-y-3 pt-2 pb-4 lg:hidden">
        <div className="h-8 w-48 rounded bg-neutral-200" />
        <div
          className="rounded-[30px] bg-neutral-200"
          style={{ width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
        />
      </div>

      <div className="flex flex-col items-start lg:flex-row" style={{ gap: PRODUCTS_CATALOG_MAIN_GAP_PX }}>
        <aside
          className="hidden shrink-0 lg:block"
          style={{ width: PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX }}
          aria-hidden
        >
          <div className="flex flex-col gap-5">
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-36 rounded-2xl bg-neutral-200" />
            <div className="h-72 rounded-2xl bg-neutral-200" />
            <div className="h-32 rounded-2xl bg-neutral-200" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div
            className="hidden items-center justify-between gap-4 lg:flex"
            style={{ paddingBottom: PRODUCTS_CATALOG_TOP_ROW_PB_PX }}
          >
            <div className="h-8 w-48 rounded bg-neutral-200" />
            <div className="flex gap-3">
              <div
                className="rounded-[30px] bg-neutral-200"
                style={{ width: 182, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
              />
              <div
                className="rounded-[30px] bg-neutral-200"
                style={{ width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[30px] bg-[#f9e490]/60"
                  style={{ width: 344, height: 371 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
        </div>
      </HomeSectionContent>
    </HomeContentHorizontalFrame>
  );
}
