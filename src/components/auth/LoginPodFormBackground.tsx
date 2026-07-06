import Image from 'next/image';
import {
  LOGIN_POD_FORM_BG,
  LOGIN_POD_FORM_BG_HEIGHT_PX,
  LOGIN_POD_FORM_LEFT_PERCENT,
  LOGIN_POD_FORM_WIDTH_PERCENT,
} from '../../constants/login-page';

/** Figma `222:492` — clay pod-form background behind the login card. */
export function LoginPodFormBackground() {
  return (
    <div
      aria-hidden
      className="auth-page-pod-bg pointer-events-none absolute inset-x-0 bottom-0 overflow-x-clip overflow-y-visible max-[743px]:hidden"
      style={{ height: LOGIN_POD_FORM_BG_HEIGHT_PX }}
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
          className="max-w-none object-contain object-bottom"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
