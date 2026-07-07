'use client';

import Image from 'next/image';
import { StorefrontCatalogLink } from '../storefront/StorefrontCatalogLink';
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
import styles from './HomeSectionHeading.module.css';

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
  mobileTitleFontSizePx?: number;
  mobileTitleLineHeightPx?: number;
  mobileMinHeightPx?: number;
  mobileTitleMaxLines?: number;
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
  mobileTitleFontSizePx,
  mobileTitleLineHeightPx,
  mobileMinHeightPx,
  mobileTitleMaxLines,
  showSeeAllLink = true,
}: HomeSectionHeadingRowProps) {
  const hasMobileTitle = mobileTitleFontSizePx !== undefined;
  const hasMobileMultiline = hasMobileTitle && mobileTitleMaxLines !== undefined && mobileTitleMaxLines > 1;

  return (
    <div
      className={`flex w-full justify-between ${
        hasMobileMultiline ? 'items-start sm:items-center' : 'items-center'
      } ${styles.headingRow} ${hasMobileTitle ? styles.headingRowResponsive : ''}`}
      style={{
        ['--heading-min-height' as string]: `${minHeightPx}px`,
        ['--heading-padding-y' as string]: `${headingPaddingYPx}px`,
        ...(hasMobileTitle && mobileMinHeightPx !== undefined
          ? { ['--heading-min-height-mobile' as string]: `${mobileMinHeightPx}px` }
          : {}),
      }}
    >
      <h2
        id={id}
        className={`font-black ${styles.title} ${hasMobileTitle ? styles.titleResponsive : ''} ${
          hasMobileMultiline ? `${styles.titleMultilineMobile} sm:shrink-0` : 'shrink-0'
        }`}
        style={{
          color,
          ['--title-font-size' as string]: `${titleFontSizePx}px`,
          ['--title-line-height' as string]: `${titleLineHeightPx}px`,
          ...(hasMobileTitle
            ? {
                ['--title-font-size-mobile' as string]: `${mobileTitleFontSizePx}px`,
                ['--title-line-height-mobile' as string]: `${
                  mobileTitleLineHeightPx ?? mobileTitleFontSizePx
                }px`,
              }
            : {}),
          ...(hasMobileMultiline
            ? { ['--title-mobile-max-lines' as string]: String(mobileTitleMaxLines) }
            : {}),
        }}
      >
        {title}
      </h2>

      {showSeeAllLink ? (
      <StorefrontCatalogLink
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
      </StorefrontCatalogLink>
      ) : null}
    </div>
  );
}
