import {
  FOOTER_BORDER_RADIUS_TOP_PX,
  FOOTER_BG_COLOR,
  FOOTER_CONTENT_MAX_WIDTH_PX,
  FOOTER_CONTENT_Z_INDEX,
  FOOTER_DECORATION_Z_INDEX,
  FOOTER_GAP_BG_COLOR,
  FOOTER_HEIGHT_PX,
  FOOTER_MAX_WIDTH_PX,
  FOOTER_PADDING_BOTTOM_PX,
  FOOTER_PADDING_TOP_PX,
  FOOTER_PADDING_X_PX,
  FOOTER_YELLOW_TOP_PX,
} from '../constants/footer';
import { FooterBunnyDecoration } from './footer/FooterDecorations';
import { FooterSiteContent } from './footer/FooterSiteContent';

/**
 * Site footer — Figma node `51:428`.
 * `FOOTER_TOP_GAP_PX` keeps white space above the yellow rounded body; strawberry may overlap it.
 */
export function Footer() {
  const contentPaddingTopPx = FOOTER_YELLOW_TOP_PX + FOOTER_PADDING_TOP_PX;

  return (
    <footer
      className="relative z-20 w-full overflow-visible"
      style={{
        paddingTop: contentPaddingTopPx,
        paddingBottom: FOOTER_PADDING_BOTTOM_PX,
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: FOOTER_YELLOW_TOP_PX,
          backgroundColor: FOOTER_GAP_BG_COLOR,
          zIndex: FOOTER_DECORATION_Z_INDEX,
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          top: FOOTER_YELLOW_TOP_PX,
          zIndex: FOOTER_DECORATION_Z_INDEX,
          minHeight: FOOTER_HEIGHT_PX,
          backgroundColor: FOOTER_BG_COLOR,
          borderTopLeftRadius: FOOTER_BORDER_RADIUS_TOP_PX,
          borderTopRightRadius: FOOTER_BORDER_RADIUS_TOP_PX,
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{
          top: FOOTER_YELLOW_TOP_PX,
          zIndex: FOOTER_DECORATION_Z_INDEX,
          minHeight: FOOTER_HEIGHT_PX,
          borderTopLeftRadius: FOOTER_BORDER_RADIUS_TOP_PX,
          borderTopRightRadius: FOOTER_BORDER_RADIUS_TOP_PX,
        }}
      >
        <FooterBunnyDecoration />
      </div>

      <div
        className="relative mx-auto w-full"
        style={{
          zIndex: FOOTER_CONTENT_Z_INDEX,
          maxWidth: FOOTER_MAX_WIDTH_PX,
          paddingLeft: FOOTER_PADDING_X_PX,
          paddingRight: FOOTER_PADDING_X_PX,
        }}
      >
        <div className="mx-auto w-full" style={{ maxWidth: FOOTER_CONTENT_MAX_WIDTH_PX }}>
          <FooterSiteContent />
        </div>
      </div>
    </footer>
  );
}
