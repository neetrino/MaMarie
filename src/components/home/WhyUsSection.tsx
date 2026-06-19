import { WHY_US_SECTION_OFFSET_TOP_PX } from '../../constants/why-us-section';
import { HomePageSection } from './HomeSectionShell';
import { WhyUsSectionBlock } from './WhyUsSectionBlock';

/**
 * Why choose us — Figma node `1:112` (heading `1:144`, cards `1:114`).
 */
export function WhyUsSection() {
  return (
    <HomePageSection offsetTopPx={WHY_US_SECTION_OFFSET_TOP_PX}>
      <WhyUsSectionBlock />
    </HomePageSection>
  );
}
