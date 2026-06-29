import {
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
  BEST_PRODUCTS_SECTION_OFFSET_TOP_PX,
  BEST_PRODUCTS_CARD_COUNT,
  BEST_PRODUCTS_CARD_GAP_PX,
  HOME_PRODUCT_CARD_HEIGHT_PX,
  HOME_PRODUCT_CARD_WIDTH_PX,
} from '../../constants/home-sections';
import { HomePageSection } from './HomeSectionShell';

/**
 * Layout-stable shell while best products data streams in.
 */
export function BestProductsSectionSkeleton() {
  return (
    <HomePageSection offsetTopPx={BEST_PRODUCTS_SECTION_OFFSET_TOP_PX}>
      <div className="animate-pulse" aria-busy="true" aria-label="Loading best products">
        <div
          className="flex items-center justify-between rounded bg-neutral-200/70"
          style={{ minHeight: BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX }}
        />

        <div
          className="flex w-full overflow-hidden pb-8"
          style={{
            paddingTop: BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
            gap: BEST_PRODUCTS_CARD_GAP_PX,
          }}
        >
          {Array.from({ length: BEST_PRODUCTS_CARD_COUNT }).map((_, index) => (
            <div
              key={index}
              className="shrink-0 rounded-[30px] bg-[#f9e490]/60"
              style={{
                width: HOME_PRODUCT_CARD_WIDTH_PX,
                height: HOME_PRODUCT_CARD_HEIGHT_PX,
              }}
            />
          ))}
        </div>
      </div>
    </HomePageSection>
  );
}
