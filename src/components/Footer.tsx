import {
  FOOTER_BORDER_RADIUS_TOP_PX,
  FOOTER_BG_COLOR,
  FOOTER_CONTENT_MAX_WIDTH_PX,
  FOOTER_CONTENT_Z_INDEX,
  FOOTER_DECORATION_Z_INDEX,
  FOOTER_MAX_WIDTH_PX,
  FOOTER_PADDING_X_PX,
  FOOTER_PADDING_Y_PX,
  FOOTER_STRAWBERRY_Z_INDEX,
  FOOTER_TOP_OVERLAP_PX,
  FOOTER_YELLOW_TOP_PX,
} from '../constants/footer';
import { FooterStarDecoration, FooterStrawberryDecoration } from './footer/FooterDecorations';
import { FooterSiteContent } from './footer/FooterSiteContent';

/**
 * Site footer — Figma node `1:166`.
 * Top corner wedges stay transparent (`FOOTER_YELLOW_TOP_PX` inset) so the section above
 * fills the rounded corners; extra yellow strip keeps the footer top edge visible.
 */
export function Footer() {
  return (
    <footer
      className="relative z-20 w-full overflow-visible"
      style={{
        marginTop: -FOOTER_TOP_OVERLAP_PX,
        paddingTop: FOOTER_PADDING_Y_PX,
        paddingBottom: FOOTER_PADDING_Y_PX,
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          top: FOOTER_YELLOW_TOP_PX,
          zIndex: FOOTER_DECORATION_Z_INDEX,
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
          borderTopLeftRadius: FOOTER_BORDER_RADIUS_TOP_PX,
          borderTopRightRadius: FOOTER_BORDER_RADIUS_TOP_PX,
        }}
      >
        <FooterStarDecoration />
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

      <div
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={{ zIndex: FOOTER_STRAWBERRY_Z_INDEX }}
      >
        <FooterStrawberryDecoration />
      </div>
    </footer>
  );
}
