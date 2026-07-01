import {
  CONTACT_FORM_ASSETS,
  CONTACT_FORM_STRAWBERRY_IMAGE_SCALE,
  CONTACT_FORM_STRAWBERRY_RIGHT_PX,
  CONTACT_FORM_STRAWBERRY_ROTATE_DEG,
  CONTACT_FORM_STRAWBERRY_SIZE_PX,
  CONTACT_FORM_STRAWBERRY_TOP_PX,
} from '../../constants/contact-form';

/** Figma contact form — strawberry decoration overlapping top-right card edge. */
export function ContactFormStrawberry() {
  return (
    <div
      className="pointer-events-none absolute z-10 flex items-center justify-center overflow-visible"
      style={{
        top: CONTACT_FORM_STRAWBERRY_TOP_PX,
        right: CONTACT_FORM_STRAWBERRY_RIGHT_PX,
        width: CONTACT_FORM_STRAWBERRY_SIZE_PX,
        height: CONTACT_FORM_STRAWBERRY_SIZE_PX,
      }}
      aria-hidden
    >
      <img
        alt=""
        src={CONTACT_FORM_ASSETS.strawberry}
        decoding="async"
        draggable={false}
        className="max-w-none object-contain"
        style={{
          width: CONTACT_FORM_STRAWBERRY_SIZE_PX,
          height: CONTACT_FORM_STRAWBERRY_SIZE_PX,
          transform: `rotate(${CONTACT_FORM_STRAWBERRY_ROTATE_DEG}deg) scale(${CONTACT_FORM_STRAWBERRY_IMAGE_SCALE})`,
        }}
      />
    </div>
  );
}
