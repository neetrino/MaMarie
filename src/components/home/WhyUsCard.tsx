'use client';

import {
  WHY_US_CARD_DESCRIPTION_COLOR,
  WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX,
  WHY_US_CARD_DESCRIPTION_SIZE_PX,
  WHY_US_CARD_TEXT_MAX_WIDTH_PX,
  WHY_US_CARD_TITLE_LINE_HEIGHT_PX,
  WHY_US_CARD_TITLE_SIZE_PX,
  WHY_US_CARD_WIDTH_PX,
  WHY_US_LAYOUT_SCALE,
  type WhyUsCardLayout,
} from '../../constants/why-us-section';
import { WhyUsCardImage } from './WhyUsCardImage';

export interface WhyUsCardContent {
  title: string;
  description: string;
}

interface WhyUsCardProps {
  layout: WhyUsCardLayout;
  content: WhyUsCardContent;
}

export function WhyUsCard({ layout, content }: WhyUsCardProps) {
  return (
    <article
      className="flex shrink-0 flex-col items-center"
      style={{
        width: WHY_US_CARD_WIDTH_PX,
        gap: layout.sectionGapPx * WHY_US_LAYOUT_SCALE,
      }}
    >
      <WhyUsCardImage src={layout.imageSrc} layout={layout.imageLayout} />

      <div
        className="flex w-full flex-col items-center text-center"
        style={{
          gap: layout.textGapPx * WHY_US_LAYOUT_SCALE,
          maxWidth: WHY_US_CARD_TEXT_MAX_WIDTH_PX,
        }}
      >
        <h3
          className="font-bold text-black"
          style={{
            maxWidth: layout.titleMaxWidthPx * WHY_US_LAYOUT_SCALE,
            fontSize: WHY_US_CARD_TITLE_SIZE_PX,
            lineHeight: `${WHY_US_CARD_TITLE_LINE_HEIGHT_PX}px`,
          }}
        >
          {content.title}
        </h3>

        <p
          className="font-normal"
          style={{
            color: WHY_US_CARD_DESCRIPTION_COLOR,
            fontSize: WHY_US_CARD_DESCRIPTION_SIZE_PX,
            lineHeight: `${WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX}px`,
          }}
        >
          {content.description}
        </p>
      </div>
    </article>
  );
}
