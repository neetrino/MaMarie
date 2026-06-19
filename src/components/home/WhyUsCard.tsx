'use client';

import Image from 'next/image';
import {
  WHY_US_CARD_CONTENT_GAP_PX,
  WHY_US_CARD_CONTENT_LEFT_PX,
  WHY_US_CARD_CONTENT_TOP_PX,
  WHY_US_CARD_CONTENT_WIDTH_PX,
  WHY_US_CARD_DESCRIPTION_COLOR,
  WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX,
  WHY_US_CARD_DESCRIPTION_SIZE_PX,
  WHY_US_CARD_HEIGHT_PX,
  WHY_US_CARD_LAYOUT_SCALE,
  WHY_US_CARD_RADIUS_PX,
  WHY_US_CARD_TITLE_LINE_HEIGHT_PX,
  WHY_US_CARD_TITLE_SIZE_PX,
  WHY_US_CARD_WIDTH_PX,
  type WhyUsCardLayout,
} from '../../constants/why-us-section';

export interface WhyUsCardContent {
  titleLines: string[];
  descriptionLines: string[];
}

interface WhyUsCardProps {
  layout: WhyUsCardLayout;
  content: WhyUsCardContent;
}

export function WhyUsCard({ layout, content }: WhyUsCardProps) {
  return (
    <article
      className="relative shrink-0 overflow-hidden"
      style={{
        width: WHY_US_CARD_WIDTH_PX,
        height: WHY_US_CARD_HEIGHT_PX,
        borderRadius: WHY_US_CARD_RADIUS_PX,
        backgroundColor: layout.backgroundColor,
      }}
    >
      <div
        className="absolute flex flex-col"
        style={{
          left: WHY_US_CARD_CONTENT_LEFT_PX,
          top: WHY_US_CARD_CONTENT_TOP_PX,
          width: WHY_US_CARD_CONTENT_WIDTH_PX,
          gap: WHY_US_CARD_CONTENT_GAP_PX,
        }}
      >
        <h3
          className="font-bold text-white"
          style={{
            fontSize: WHY_US_CARD_TITLE_SIZE_PX,
            lineHeight: `${WHY_US_CARD_TITLE_LINE_HEIGHT_PX}px`,
          }}
        >
          {content.titleLines.map((line, lineIndex) => (
            <span key={`title-${lineIndex}`} className="block">
              {line}
            </span>
          ))}
        </h3>

        <p
          className="font-normal"
          style={{
            color: WHY_US_CARD_DESCRIPTION_COLOR,
            fontSize: WHY_US_CARD_DESCRIPTION_SIZE_PX,
            lineHeight: `${WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX}px`,
          }}
        >
          {content.descriptionLines.map((line, lineIndex) => (
            <span key={`desc-${lineIndex}`} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute relative"
        style={{
          left: layout.imageLeftPx * WHY_US_CARD_LAYOUT_SCALE,
          top: layout.imageTopPx * WHY_US_CARD_LAYOUT_SCALE,
          width: layout.imageSizePx * WHY_US_CARD_LAYOUT_SCALE,
          height: layout.imageSizePx * WHY_US_CARD_LAYOUT_SCALE,
        }}
      >
        <Image
          src={layout.imageSrc}
          alt=""
          fill
          sizes={`${layout.imageSizePx}px`}
          className="object-cover"
        />
      </div>
    </article>
  );
}
