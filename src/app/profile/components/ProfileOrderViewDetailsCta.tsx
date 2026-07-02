import Image from 'next/image';
import {
  PROFILE_DESKTOP_ASSETS,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ARROW_SIZE_PX,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_CLASS,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_FONT_SIZE_PX,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_HEIGHT_PX,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_OFFSET_X_PX,
  PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_SIZE_PX,
} from '../../../constants/profile-desktop-page';

interface ProfileOrderViewDetailsCtaProps {
  label: string;
}

function stripTrailingArrow(label: string): string {
  return label.replace(/\s*[→➔]\s*$/u, '').trim();
}

/** Figma `66:454` — pink pill with centered label and white arrow circle. */
export function ProfileOrderViewDetailsCta({ label }: ProfileOrderViewDetailsCtaProps) {
  return (
    <span
      className={PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_CLASS}
      style={{
        minHeight: PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_HEIGHT_PX,
        fontSize: PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_FONT_SIZE_PX,
      }}
    >
      <span className="flex-1 text-center">{stripTrailingArrow(label)}</span>
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white"
        style={{
          width: PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_SIZE_PX,
          height: PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_SIZE_PX,
          transform: `translateX(-${PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_OFFSET_X_PX}px)`,
        }}
      >
        <Image
          src={PROFILE_DESKTOP_ASSETS.orderViewDetailsArrow}
          alt=""
          width={PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ARROW_SIZE_PX}
          height={PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ARROW_SIZE_PX}
          aria-hidden
        />
      </span>
    </span>
  );
}
