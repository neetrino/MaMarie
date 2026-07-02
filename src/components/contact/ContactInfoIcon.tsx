import {
  CONTACT_INFO_ICON_IMAGE_SCALE,
  CONTACT_INFO_ICON_SIZE_PX,
} from '../../constants/contact-page';

interface ContactInfoIconProps {
  src: string;
}

/** Clay-style contact block icon — transparent PNG with artboard padding compensated via scale. */
export function ContactInfoIcon({ src }: ContactInfoIconProps) {
  return (
    <div
      className="relative shrink-0 overflow-visible"
      style={{
        width: CONTACT_INFO_ICON_SIZE_PX,
        height: CONTACT_INFO_ICON_SIZE_PX,
      }}
      aria-hidden
    >
      <img
        alt=""
        src={src}
        decoding="async"
        draggable={false}
        className="absolute left-1/2 top-1/2 max-w-none object-contain"
        style={{
          width: CONTACT_INFO_ICON_SIZE_PX,
          height: CONTACT_INFO_ICON_SIZE_PX,
          transform: `translate(-50%, -50%) scale(${CONTACT_INFO_ICON_IMAGE_SCALE})`,
        }}
      />
    </div>
  );
}
