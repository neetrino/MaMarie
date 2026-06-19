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
} from '../constants/footer';
import { FooterStarDecoration, FooterStrawberryDecoration } from './footer/FooterDecorations';
import { FooterSiteContent } from './footer/FooterSiteContent';

/** Site footer — Figma node `1:166`. */
export function Footer() {
  return (
    <footer
      className="relative w-full overflow-visible"
      style={{
        paddingTop: FOOTER_PADDING_Y_PX,
        paddingBottom: FOOTER_PADDING_Y_PX,
        backgroundColor: FOOTER_BG_COLOR,
        borderTopLeftRadius: FOOTER_BORDER_RADIUS_TOP_PX,
        borderTopRightRadius: FOOTER_BORDER_RADIUS_TOP_PX,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
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
