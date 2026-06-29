import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
  HOME_SECTION_STACK_GAP_PX,
  HOME_SECTION_TITLE_FONT_SIZE_PX,
  homeSectionColumnWidthPx,
} from './home-sections';

/** Figma node `51:371` — «Why choose us» section. */
export const WHY_US_SECTION_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;
export const WHY_US_SECTION_OFFSET_TOP_PX = HOME_SECTION_STACK_GAP_PX;

export const WHY_US_SECTION_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const WHY_US_SECTION_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const WHY_US_HEADING_PADDING_Y_PX = 7;
export const WHY_US_HEADING_MIN_HEIGHT_PX = 94;
export const WHY_US_TITLE_FONT_SIZE_PX = HOME_SECTION_TITLE_FONT_SIZE_PX;
export const WHY_US_TITLE_LINE_HEIGHT_PX = 80;
export const WHY_US_HEADING_COLOR = '#ef95aa';

/** Figma `51:376` — cards row below heading. */
export const WHY_US_GRID_OFFSET_TOP_PX = 49;
export const WHY_US_GRID_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const WHY_US_CARD_GAP_PX = 35;
export const WHY_US_CARD_COUNT = 4;

export const WHY_US_DESIGN_COLUMN_WIDTH_PX = 317;
export const WHY_US_CARD_WIDTH_PX = homeSectionColumnWidthPx(WHY_US_CARD_COUNT, WHY_US_CARD_GAP_PX);
export const WHY_US_LAYOUT_SCALE = WHY_US_CARD_WIDTH_PX / WHY_US_DESIGN_COLUMN_WIDTH_PX;

function scaleWhyUsPx(value: number): number {
  return value * WHY_US_LAYOUT_SCALE;
}

export const WHY_US_IMAGE_BOX_WIDTH_PX = scaleWhyUsPx(283);
export const WHY_US_IMAGE_BOX_HEIGHT_PX = scaleWhyUsPx(248);

export const WHY_US_CARD_TITLE_SIZE_PX = 18;
export const WHY_US_CARD_TITLE_LINE_HEIGHT_PX = 24;
export const WHY_US_CARD_DESCRIPTION_SIZE_PX = 14;
export const WHY_US_CARD_DESCRIPTION_LINE_HEIGHT_PX = 20;
export const WHY_US_CARD_DESCRIPTION_COLOR = 'rgba(0, 0, 0, 0.79)';
export const WHY_US_CARD_TEXT_MAX_WIDTH_PX = scaleWhyUsPx(316);

export const WHY_US_ASSETS = {
  card1: '/assets/home/why-us/card-1.png',
  card2: '/assets/home/why-us/card-2.png',
  card3: '/assets/home/why-us/card-3.png',
  card4: '/assets/home/why-us/card-4.png',
} as const;

export interface WhyUsCardImageFillLayout {
  kind: 'fill';
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
}

export interface WhyUsCardImageCropLayout {
  kind: 'crop';
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  imageHeightPercent: number;
  imageWidthPercent: number;
  imageLeftPercent: number;
  imageTopPercent: number;
}

export interface WhyUsCardImageRotatedLayout {
  kind: 'rotated';
  wrapperLeftPx: number;
  wrapperTopPx: number;
  wrapperSizePx: number;
  rotateDeg: number;
  imageSizePx: number;
}

export type WhyUsCardImageLayout =
  | WhyUsCardImageFillLayout
  | WhyUsCardImageCropLayout
  | WhyUsCardImageRotatedLayout;

export interface WhyUsCardLayout {
  id: string;
  imageSrc: string;
  imageLayout: WhyUsCardImageLayout;
  sectionGapPx: number;
  textGapPx: number;
  titleMaxWidthPx: number;
}

export const WHY_US_CARD_LAYOUTS: WhyUsCardLayout[] = [
  {
    id: '01',
    imageSrc: WHY_US_ASSETS.card1,
    sectionGapPx: 23,
    textGapPx: 23,
    titleMaxWidthPx: 259,
    imageLayout: {
      kind: 'fill',
      leftPx: 54,
      topPx: 16,
      widthPx: 175,
      heightPx: 233,
    },
  },
  {
    id: '02',
    imageSrc: WHY_US_ASSETS.card2,
    sectionGapPx: 19,
    textGapPx: 19,
    titleMaxWidthPx: 273,
    imageLayout: {
      kind: 'crop',
      leftPx: 9,
      topPx: 40,
      widthPx: 265,
      heightPx: 170,
      imageHeightPercent: 146.38,
      imageWidthPercent: 115.37,
      imageLeftPercent: -7.76,
      imageTopPercent: -19.57,
    },
  },
  {
    id: '03',
    imageSrc: WHY_US_ASSETS.card3,
    sectionGapPx: 19,
    textGapPx: 19,
    titleMaxWidthPx: 273,
    imageLayout: {
      kind: 'crop',
      leftPx: 0,
      topPx: 0,
      widthPx: 283,
      heightPx: 248,
      imageHeightPercent: 114.11,
      imageWidthPercent: 100,
      imageLeftPercent: 0,
      imageTopPercent: 0.11,
    },
  },
  {
    id: '04',
    imageSrc: WHY_US_ASSETS.card4,
    sectionGapPx: 19,
    textGapPx: 33,
    titleMaxWidthPx: 273,
    imageLayout: {
      kind: 'rotated',
      wrapperLeftPx: -75,
      wrapperTopPx: -93,
      wrapperSizePx: 433.923,
      rotateDeg: -66.47,
      imageSizePx: 329.705,
    },
  },
];
