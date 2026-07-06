import Image from 'next/image';
import {
  LOGIN_POD_FORM_BG,
  LOGIN_POD_FORM_LEFT_PERCENT,
  LOGIN_POD_FORM_WIDTH_PERCENT,
} from '../../constants/login-page';

/** Figma `222:492` — clay “marie” letters behind the login card. */
export function LoginPodFormBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute top-0 h-full"
        style={{
          left: `${LOGIN_POD_FORM_LEFT_PERCENT}%`,
          width: `${LOGIN_POD_FORM_WIDTH_PERCENT}%`,
        }}
      >
        <Image
          src={LOGIN_POD_FORM_BG}
          alt=""
          fill
          priority
          className="max-w-none object-cover object-bottom"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
