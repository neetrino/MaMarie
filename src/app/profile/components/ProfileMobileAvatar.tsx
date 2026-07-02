import { BRAND_COLORS } from '../../../constants/brand';

interface ProfileMobileAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

/** Figma profile header — pink clay circle with white silhouette. */
export function ProfileMobileAvatar({ firstName, lastName, avatarUrl }: ProfileMobileAvatarProps) {
  const alt = `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Profile';

  if (avatarUrl) {
    return (
      <div className="relative h-20 w-20 shrink-0 rounded-full bg-white p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.9)]">
        <img src={avatarUrl} alt={alt} className="h-full w-full rounded-full object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"
      style={{ backgroundColor: BRAND_COLORS.pink }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-10 w-10 text-white"
        aria-hidden
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
      </svg>
    </div>
  );
}
