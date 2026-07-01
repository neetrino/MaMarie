'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  HOME_SECTION_CHEVRON_SIZE_PX,
  HOME_SECTION_HEADING_MIN_HEIGHT_PX,
  HOME_SECTION_HEADING_PADDING_Y_PX,
  HOME_SECTION_HEADING_TITLE_LINE_HEIGHT_PX,
  HOME_SECTION_LINK_FONT_SIZE_PX,
  HOME_SECTION_LINK_GAP_PX,
  HOME_SECTION_LINK_LINE_HEIGHT_PX,
  HOME_SECTION_TITLE_FONT_SIZE_PX,
} from '../../constants/home-sections';

export interface HomeSectionHeadingRowProps {
  id: string;
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
  color: string;
  chevronSrc: string;
  titleFontSizePx?: number;
  titleLineHeightPx?: number;
  minHeightPx?: number;
  headingPaddingYPx?: number;
  showSeeAllLink?: boolean;
}

/** Section title + «See all» row — lives inside `HomePageSection`. */
export function HomeSectionHeadingRow({
  id,
  title,
  seeAllHref,
  seeAllLabel,
  color,
  chevronSrc,
  titleFontSizePx = HOME_SECTION_TITLE_FONT_SIZE_PX,
  titleLineHeightPx = HOME_SECTION_HEADING_TITLE_LINE_HEIGHT_PX,
  minHeightPx = HOME_SECTION_HEADING_MIN_HEIGHT_PX,
  headingPaddingYPx = HOME_SECTION_HEADING_PADDING_Y_PX,
  showSeeAllLink = true,
}: HomeSectionHeadingRowProps) {
  return (
    <div
      className="flex w-full items-center justify-between"
      style={{
        minHeight: minHeightPx,
        paddingTop: headingPaddingYPx,
        paddingBottom: headingPaddingYPx,
      }}
    >
      <h2
        id={id}
        className="shrink-0 font-black"
        style={{
          color,
          fontSize: titleFontSizePx,
          lineHeight: `${titleLineHeightPx}px`,
        }}
      >
        {title}
      </h2>

      {showSeeAllLink ? (
      <Link
        href={seeAllHref}
        className="group inline-flex shrink-0 items-center font-bold transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
        style={{
          gap: HOME_SECTION_LINK_GAP_PX,
          color,
          fontSize: HOME_SECTION_LINK_FONT_SIZE_PX,
          lineHeight: `${HOME_SECTION_LINK_LINE_HEIGHT_PX}px`,
        }}
      >
        {seeAllLabel}
        <Image
          src={chevronSrc}
          alt=""
          width={HOME_SECTION_CHEVRON_SIZE_PX}
          height={HOME_SECTION_CHEVRON_SIZE_PX}
          aria-hidden
          className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
        />
      </Link>
      ) : null}
    </div>
  );
}
