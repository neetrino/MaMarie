'use client';

import {
  WHY_US_CARD_COUNT,
  WHY_US_CARD_GAP_PX,
  WHY_US_CARD_LAYOUTS,
  WHY_US_GRID_OFFSET_TOP_PX,
  WHY_US_HEADING_COLOR,
  WHY_US_HEADING_MIN_HEIGHT_PX,
  WHY_US_HEADING_PADDING_Y_PX,
  WHY_US_TITLE_LINE_HEIGHT_PX,
} from '../../constants/why-us-section';
import { useTranslation } from '../../lib/i18n-client';
import { HomeSectionHeadingRow } from './HomeSectionHeading';
import type { WhyUsCardContent } from './WhyUsCard';
import { WhyUsCard } from './WhyUsCard';

const WHY_US_CARD_KEYS = ['card1', 'card2', 'card3', 'card4'] as const;

function useWhyUsCardContent(cardKey: (typeof WHY_US_CARD_KEYS)[number]): WhyUsCardContent {
  const { t } = useTranslation();
  const basePath = `home.whyUs.${cardKey}`;

  return {
    title: t(`${basePath}.title`),
    description: t(`${basePath}.description`),
  };
}

function WhyUsCardItem({ index }: { index: number }) {
  const cardKey = WHY_US_CARD_KEYS[index];
  const content = useWhyUsCardContent(cardKey);
  const layout = WHY_US_CARD_LAYOUTS[index];

  if (!layout) {
    return null;
  }

  return <WhyUsCard layout={layout} content={content} />;
}

export function WhyUsSectionBlock() {
  const { t } = useTranslation();

  return (
    <>
      <HomeSectionHeadingRow
        id="why-us-section-heading"
        title={t('home.whyUs.title')}
        seeAllHref="/products"
        seeAllLabel={t('common.search.seeAll')}
        color={WHY_US_HEADING_COLOR}
        chevronSrc=""
        showSeeAllLink={false}
        titleLineHeightPx={WHY_US_TITLE_LINE_HEIGHT_PX}
        minHeightPx={WHY_US_HEADING_MIN_HEIGHT_PX}
        headingPaddingYPx={WHY_US_HEADING_PADDING_Y_PX}
      />

      <div
        className="flex w-full overflow-x-auto pb-4 lg:overflow-visible"
        style={{
          paddingTop: WHY_US_GRID_OFFSET_TOP_PX,
          gap: WHY_US_CARD_GAP_PX,
        }}
      >
        {Array.from({ length: WHY_US_CARD_COUNT }, (_, index) => (
          <WhyUsCardItem key={WHY_US_CARD_LAYOUTS[index]?.id ?? index} index={index} />
        ))}
      </div>
    </>
  );
}
