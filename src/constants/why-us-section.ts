import {
  HOME_SECTION_CHEVRON_SIZE_PX,
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_LINK_FONT_SIZE_PX,
  HOME_SECTION_LINK_GAP_PX,
  HOME_SECTION_LINK_LINE_HEIGHT_PX,
  HOME_SECTION_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
  HOME_SECTION_TITLE_FONT_SIZE_PX,
  homeSectionColumnWidthPx,
} from './home-sections';

/** Figma node `1:112` — «Why choose us» section. */
export const WHY_US_SECTION_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;

/** Extra space below sale banner before «Why us» heading. */
export const WHY_US_SECTION_OFFSET_TOP_PX = 40;

export const WHY_US_SECTION_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const WHY_US_HEADING_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const WHY_US_SECTION_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const WHY_US_HEADING_PADDING_Y_PX = 7;
export const WHY_US_HEADING_MIN_HEIGHT_PX = 94;

export const WHY_US_TITLE_FONT_SIZE_PX = HOME_SECTION_TITLE_FONT_SIZE_PX;
export const WHY_US_TITLE_LINE_HEIGHT_PX = 80;

export const WHY_US_HEADING_COLOR = '#c2ddf9';

export const WHY_US_LINK_FONT_SIZE_PX = HOME_SECTION_LINK_FONT_SIZE_PX;
export const WHY_US_LINK_LINE_HEIGHT_PX = HOME_SECTION_LINK_LINE_HEIGHT_PX;
export const WHY_US_LINK_GAP_PX = HOME_SECTION_LINK_GAP_PX;
export const WHY_US_CHEVRON_SIZE_PX = HOME_SECTION_CHEVRON_SIZE_PX;

export const WHY_US_ASSETS = {
  chevronRight: '/assets/home/icon-chevron-right.svg',
} as const;

/** Figma `Info Cards` — gap below heading. */
export const WHY_US_GRID_OFFSET_TOP_PX = 24;
export const WHY_US_GRID_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const WHY_US_CARD_GAP_PX = 10;
export const WHY_US_CARD_COUNT = 4;

/** Figma node `1:115` — info card (scaled to fit content row). */
export const WHY_US_CARD_DESIGN_WIDTH_PX = 338.75;
export const WHY_US_CARD_DESIGN_HEIGHT_PX = 635;
export const WHY_US_CARD_WIDTH_PX = homeSectionColumnWidthPx(WHY_US_CARD_COUNT, WHY_US_CARD_GAP_PX);
export const WHY_US_CARD_HEIGHT_PX = Math.round(
  WHY_US_CARD_WIDTH_PX * (WHY_US_CARD_DESIGN_HEIGHT_PX / WHY_US_CARD_DESIGN_WIDTH_PX),
);
export const WHY_US_CARD_LAYOUT_SCALE = WHY_US_CARD_WIDTH_PX / WHY_US_CARD_DESIGN_WIDTH_PX;
export const WHY_US_CARD_RADIUS_PX = 30;

function scaleWhyUsCardPx(value: number): number {
  return value * WHY_US_CARD_LAYOUT_SCALE;
}

export const WHY_US_CARD_CONTENT_LEFT_PX = scaleWhyUsCardPx(19);
export const WHY_US_CARD_CONTENT_TOP_PX = scaleWhyUsCardPx(57);
export const WHY_US_CARD_CONTENT_WIDTH_PX = scaleWhyUsCardPx(275);
export const WHY_US_CARD_CONTENT_GAP_PX = scaleWhyUsCardPx(8);

export const WHY_US_CARD_TITLE_SIZE_PX = 40;
export const WHY_US_CARD_TITLE_LINE_HEIGHT_PX = 46;
export const WHY_US_CARD_DESCRIPTION_SIZE_PX = 16;
export const WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX = 20;
export const WHY_US_CARD_DESCRIPTION_COLOR = 'rgba(255, 255, 255, 0.79)';

export interface WhyUsCardLayout {
  id: string;
  backgroundColor: string;
  imageSrc: string;
  imageLeftPx: number;
  imageTopPx: number;
  imageSizePx: number;
}

export const WHY_US_CARD_LAYOUTS: WhyUsCardLayout[] = [
  {
    id: '01',
    backgroundColor: '#d4e770',
    imageSrc: '/assets/home/why-us/card-1.png',
    imageLeftPx: -90,
    imageTopPx: 282,
    imageSizePx: 416,
  },
  {
    id: '02',
    backgroundColor: '#f9e490',
    imageSrc: '/assets/home/why-us/card-2.png',
    imageLeftPx: -87.75,
    imageTopPx: 302,
    imageSizePx: 399,
  },
  {
    id: '03',
    backgroundColor: '#e9c9ff',
    imageSrc: '/assets/home/why-us/card-3.png',
    imageLeftPx: -99.5,
    imageTopPx: 295,
    imageSizePx: 438,
  },
  {
    id: '04',
    backgroundColor: '#d0e7ff',
    imageSrc: '/assets/home/why-us/card-4.png',
    imageLeftPx: -51.25,
    imageTopPx: 318,
    imageSizePx: 390,
  },
];
