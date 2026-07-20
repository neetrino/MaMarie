import Image from 'next/image';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_BIRD_IMAGE_SIZE_PX,
  ABOUT_PAGE_BIRD_LEFT_PX,
  ABOUT_PAGE_BIRD_ROTATE_DEG,
  ABOUT_PAGE_BIRD_TOP_PX,
  ABOUT_PAGE_BIRD_WRAPPER_SIZE_PX,
  ABOUT_PAGE_GALLERY_CARD_GAP_PX,
  ABOUT_PAGE_GALLERY_CARD_HEIGHT_PX,
  ABOUT_PAGE_GALLERY_CARD_RADIUS_PX,
  ABOUT_PAGE_GALLERY_CARD_WIDTH_PX,
  ABOUT_PAGE_GALLERY_CARDS_TOP_PX,
  ABOUT_PAGE_GALLERY_HEIGHT_PX,
  ABOUT_PAGE_GALLERY_PINK_BG,
  ABOUT_PAGE_GALLERY_PINK_WIDTH_PX,
  ABOUT_PAGE_GALLERY_ROW_OFFSET_X_PX,
  ABOUT_PAGE_GALLERY_TEXT_LEFT_PX,
  ABOUT_PAGE_GALLERY_TEXT_LINE_HEIGHT_PX,
  ABOUT_PAGE_GALLERY_TEXT_SIZE_PX,
  ABOUT_PAGE_GALLERY_TEXT_TOP_PX,
  ABOUT_PAGE_GALLERY_TEXT_WIDTH_PX,
  ABOUT_PAGE_IMAGE_QUALITY,
  ABOUT_PAGE_STRAWBERRY_IMAGE_SIZE_PX,
  ABOUT_PAGE_STRAWBERRY_LEFT_PX,
  ABOUT_PAGE_STRAWBERRY_ROTATE_DEG,
  ABOUT_PAGE_STRAWBERRY_TOP_PX,
  ABOUT_PAGE_STRAWBERRY_WRAPPER_SIZE_PX,
} from '../../constants/about-page';
import { AboutDecoration } from './AboutDecoration';

interface AboutGalleryProps {
  pinkParagraphs: [string, string];
}

function GalleryPhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: ABOUT_PAGE_GALLERY_CARD_WIDTH_PX,
        height: ABOUT_PAGE_GALLERY_CARD_HEIGHT_PX,
        borderRadius: ABOUT_PAGE_GALLERY_CARD_RADIUS_PX,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={ABOUT_PAGE_IMAGE_QUALITY}
        unoptimized
        sizes={`${ABOUT_PAGE_GALLERY_CARD_WIDTH_PX}px`}
        className="object-cover"
      />
    </div>
  );
}

function GalleryPinkCard({ paragraphs }: { paragraphs: [string, string] }) {
  return (
    <div
      className="relative shrink-0 overflow-visible"
      style={{
        width: ABOUT_PAGE_GALLERY_PINK_WIDTH_PX,
        height: ABOUT_PAGE_GALLERY_CARD_HEIGHT_PX,
        borderRadius: ABOUT_PAGE_GALLERY_CARD_RADIUS_PX,
        backgroundColor: ABOUT_PAGE_GALLERY_PINK_BG,
      }}
    >
      <AboutDecoration
        imageSrc={ABOUT_PAGE_ASSETS.decoBird}
        layout={{
          leftPx: ABOUT_PAGE_BIRD_LEFT_PX,
          topPx: ABOUT_PAGE_BIRD_TOP_PX,
          wrapperSizePx: ABOUT_PAGE_BIRD_WRAPPER_SIZE_PX,
          imageSizePx: ABOUT_PAGE_BIRD_IMAGE_SIZE_PX,
          rotateDeg: ABOUT_PAGE_BIRD_ROTATE_DEG,
        }}
      />
      <p
        className="absolute m-0 whitespace-pre-wrap break-words font-normal text-white"
        style={{
          left: ABOUT_PAGE_GALLERY_TEXT_LEFT_PX,
          top: ABOUT_PAGE_GALLERY_TEXT_TOP_PX,
          width: ABOUT_PAGE_GALLERY_TEXT_WIDTH_PX,
          fontSize: ABOUT_PAGE_GALLERY_TEXT_SIZE_PX,
          lineHeight: `${ABOUT_PAGE_GALLERY_TEXT_LINE_HEIGHT_PX}px`,
        }}
      >
        {paragraphs[0]}
        {'\n\n'}
        {paragraphs[1]}
      </p>
    </div>
  );
}

/**
 * Four-panel gallery — Figma `307:626`.
 */
export function AboutGallery({ pinkParagraphs }: AboutGalleryProps) {
  return (
    <div
      className="absolute left-0 w-full overflow-visible"
      style={{
        top: 0,
        height: ABOUT_PAGE_GALLERY_HEIGHT_PX,
      }}
    >
      <div
        className="absolute left-1/2 flex -translate-x-1/2 items-start"
        style={{
          top: ABOUT_PAGE_GALLERY_CARDS_TOP_PX,
          gap: ABOUT_PAGE_GALLERY_CARD_GAP_PX,
          marginLeft: ABOUT_PAGE_GALLERY_ROW_OFFSET_X_PX,
        }}
      >
        <GalleryPhotoCard src={ABOUT_PAGE_ASSETS.gallery1} alt="" />
        <GalleryPhotoCard src={ABOUT_PAGE_ASSETS.gallery2} alt="" />
        <GalleryPinkCard paragraphs={pinkParagraphs} />
        <GalleryPhotoCard src={ABOUT_PAGE_ASSETS.gallery3} alt="" />
      </div>

      <AboutDecoration
        imageSrc={ABOUT_PAGE_ASSETS.decoStrawberry}
        layout={{
          leftPx: ABOUT_PAGE_STRAWBERRY_LEFT_PX,
          topPx: ABOUT_PAGE_STRAWBERRY_TOP_PX,
          wrapperSizePx: ABOUT_PAGE_STRAWBERRY_WRAPPER_SIZE_PX,
          imageSizePx: ABOUT_PAGE_STRAWBERRY_IMAGE_SIZE_PX,
          rotateDeg: ABOUT_PAGE_STRAWBERRY_ROTATE_DEG,
        }}
      />
    </div>
  );
}
