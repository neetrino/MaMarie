import {
  HomeContentHorizontalFrame,
  HomeSectionContent,
} from '../../components/home/HomeSectionShell';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_ROW_GAP_GRID3_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  PRODUCTS_CATALOG_DEFAULT_VIEW_MODE,
  PRODUCTS_CATALOG_GRID_OFFSET_TOP_PX,
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX,
  PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
  PRODUCTS_CATALOG_TOP_ROW_PB_PX,
  getProductsCatalogGridClassName,
} from '../../constants/products-catalog';
import { MOBILE_PRODUCTS_CATALOG_TITLE_TO_FILTERS_GAP_PX } from '../../constants/mobile-products-catalog';

/**
 * Shell for /products while catalog data streams in (layout-stable, no spinners).
 */
export function ProductsCatalogSkeleton() {
  return (
    <HomeContentHorizontalFrame>
      <HomeSectionContent>
        <div className="animate-pulse" aria-busy="true" aria-label="Loading products">
      <div
        className="flex flex-col pt-2 pb-4 lg:hidden"
        style={{ gap: MOBILE_PRODUCTS_CATALOG_TITLE_TO_FILTERS_GAP_PX }}
      >
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

          <div style={{ paddingTop: PRODUCTS_CATALOG_GRID_OFFSET_TOP_PX }}>
            <div
              className={getProductsCatalogGridClassName(PRODUCTS_CATALOG_DEFAULT_VIEW_MODE)}
              style={{
                columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
                rowGap: PRODUCTS_CATALOG_CARD_ROW_GAP_GRID3_PX,
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[30px] bg-[#f9e490]/60"
                  style={{
                    width: PRODUCTS_CATALOG_CARD_WIDTH_PX,
                    height: PRODUCTS_CATALOG_CARD_HEIGHT_PX,
                  }}
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
