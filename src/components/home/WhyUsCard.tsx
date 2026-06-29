'use client';

import {
  WHY_US_CARD_DESCRIPTION_COLOR,
  WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX,
  WHY_US_CARD_DESCRIPTION_SIZE_PX,
  WHY_US_CARD_DESCRIPTION_WIDTH_PX,
  WHY_US_CARD_TEXT_BLOCK_WIDTH_PX,
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

function scalePx(value: number): number {
  return value * WHY_US_LAYOUT_SCALE;
}

export function WhyUsCard({ layout, content }: WhyUsCardProps) {
  return (
    <article
      className="flex shrink-0 flex-col items-center"
      style={{
        width: WHY_US_CARD_WIDTH_PX,
        gap: scalePx(layout.sectionGapPx),
      }}
    >
      <WhyUsCardImage src={layout.imageSrc} layout={layout.imageLayout} />

      <div
        className="flex shrink-0 flex-col items-center"
        style={{ width: WHY_US_CARD_TEXT_BLOCK_WIDTH_PX }}
      >
        <h3
          className="mx-auto break-words text-center font-bold text-black"
          style={{
            width: scalePx(layout.titleMaxWidthPx),
            minHeight: scalePx(layout.titleMinHeightPx),
            fontSize: WHY_US_CARD_TITLE_SIZE_PX,
            lineHeight: `${WHY_US_CARD_TITLE_LINE_HEIGHT_PX}px`,
          }}
        >
          {content.title}
        </h3>

        <p
          className="break-words text-center font-normal"
          style={{
            marginTop: scalePx(layout.titleDescriptionGapPx),
            width: WHY_US_CARD_DESCRIPTION_WIDTH_PX,
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
