import {
  PROFILE_MOBILE_ASSETS,
  PROFILE_MOBILE_AVATAR_SIZE_PX,
} from '../../../constants/profile-mobile-page';

interface ProfileMobileAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  sizePx?: number;
}

/** Figma profile header — pink clay circle with white silhouette. */
export function ProfileMobileAvatar({
  firstName,
  lastName,
  avatarUrl,
  sizePx = PROFILE_MOBILE_AVATAR_SIZE_PX,
}: ProfileMobileAvatarProps) {
  const avatarSizeStyle = {
    width: sizePx,
    height: sizePx,
  } as const;
  const alt = `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Profile';

  if (avatarUrl) {
    return (
      <div
        className="relative shrink-0 rounded-full bg-white p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.9)]"
        style={avatarSizeStyle}
      >
        <img src={avatarUrl} alt={alt} className="h-full w-full rounded-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={avatarSizeStyle}>
      <img
        src={PROFILE_MOBILE_ASSETS.defaultAvatar}
        alt={alt}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
