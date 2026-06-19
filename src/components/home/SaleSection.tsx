import { SALE_SECTION_OFFSET_TOP_PX } from '../../constants/sale-section';
import { SaleSectionBlock } from './SaleSectionBlock';
import { HomePageSection } from './HomeSectionShell';

/**
 * Sale section — Figma node `1:98` (heading `1:99`, banner `1:105`).
 */
export function SaleSection() {
  return (
    <HomePageSection offsetTopPx={SALE_SECTION_OFFSET_TOP_PX}>
      <SaleSectionBlock />
    </HomePageSection>
  );
}
