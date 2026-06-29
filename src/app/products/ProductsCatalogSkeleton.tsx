import {
  PRODUCTS_CATALOG_MAIN_GAP_PX,
  PRODUCTS_CATALOG_MAX_WIDTH_PX,
  PRODUCTS_CATALOG_PADDING_LEFT_PX,
  PRODUCTS_CATALOG_PADDING_RIGHT_PX,
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX,
} from '../../constants/products-catalog';

/**
 * Shell for /products while catalog data streams in (layout-stable, no spinners).
 */
export function ProductsCatalogSkeleton() {
  return (
    <div
      className="mx-auto w-full animate-pulse"
      style={{
        maxWidth: PRODUCTS_CATALOG_MAX_WIDTH_PX,
        paddingLeft: PRODUCTS_CATALOG_PADDING_LEFT_PX,
        paddingRight: PRODUCTS_CATALOG_PADDING_RIGHT_PX,
      }}
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className="pb-6 pt-2">
        <div className="h-8 w-48 rounded bg-neutral-200" />
      </div>

      <div className="flex flex-col lg:flex-row" style={{ gap: PRODUCTS_CATALOG_MAIN_GAP_PX }}>
        <aside
          className="hidden shrink-0 lg:block"
          style={{ width: PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX }}
          aria-hidden
        >
          <div className="flex flex-col gap-5">
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-36 rounded-2xl bg-neutral-200" />
            <div className="h-32 rounded-2xl bg-neutral-200" />
          </div>
        </aside>

        <div className="min-w-0 flex-1 py-2">
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
  );
}
