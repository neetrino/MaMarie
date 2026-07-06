import Image from 'next/image';
import { Eye } from 'lucide-react';
import {
  LOGIN_FIELD_ASSETS,
  LOGIN_INPUT_ICON_COLOR,
  LOGIN_INPUT_ICON_SIZE_PX,
  LOGIN_INPUT_ICON_STROKE_WIDTH_DESKTOP,
  LOGIN_INPUT_ICON_STROKE_WIDTH_MOBILE,
  getLoginFieldAssetMobileSrc,
} from '../../constants/login-page';

const AUTH_FIELD_ICON_IMAGE_PROPS = {
  width: LOGIN_INPUT_ICON_SIZE_PX,
  height: LOGIN_INPUT_ICON_SIZE_PX,
  unoptimized: true as const,
  'aria-hidden': true as const,
};

/** Figma field icons — thinner, filter-free SVG on mobile; desktop assets unchanged. */
export function AuthFieldIcon({ src }: { src: string }) {
  const mobileSrc = getLoginFieldAssetMobileSrc(src);

  return (
    <>
      <Image
        {...AUTH_FIELD_ICON_IMAGE_PROPS}
        src={mobileSrc}
        alt=""
        className="shrink-0 lg:hidden"
      />
      <Image
        {...AUTH_FIELD_ICON_IMAGE_PROPS}
        src={src}
        alt=""
        className="hidden shrink-0 lg:block"
      />
    </>
  );
}

interface AuthPasswordVisibilityIconProps {
  visible: boolean;
  size?: number;
}

/** Password reveal toggle — matches field icon weight and color per breakpoint. */
export function AuthPasswordVisibilityIcon({
  visible,
  size = LOGIN_INPUT_ICON_SIZE_PX,
}: AuthPasswordVisibilityIconProps) {
  if (visible) {
    return (
      <>
        <Eye
          size={size}
          strokeWidth={LOGIN_INPUT_ICON_STROKE_WIDTH_MOBILE}
          className="shrink-0 lg:hidden"
          style={{ color: LOGIN_INPUT_ICON_COLOR }}
        />
        <Eye
          size={size}
          strokeWidth={LOGIN_INPUT_ICON_STROKE_WIDTH_DESKTOP}
          className="hidden shrink-0 text-[#232323] lg:block"
        />
      </>
    );
  }

  return (
    <AuthFieldIcon src={LOGIN_FIELD_ASSETS.iconEyeOff} />
  );
}
