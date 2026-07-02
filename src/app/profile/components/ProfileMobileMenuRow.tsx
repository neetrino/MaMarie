import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  PROFILE_MOBILE_ASSETS,
  PROFILE_MOBILE_CHEVRON_SIZE_PX,
  PROFILE_MOBILE_ICON_THEMES,
  PROFILE_MOBILE_MENU_ICON_BOX_RADIUS_PX,
  PROFILE_MOBILE_MENU_ICON_BOX_SIZE_PX,
  type ProfileMobileIconTheme,
} from '../../../constants/profile-mobile-page';

interface ProfileMobileMenuRowProps {
  label: string;
  icon?: ReactNode;
  iconTheme?: ProfileMobileIconTheme;
  onClick: () => void;
  variant?: 'default' | 'logout';
}

function ProfileMobileMenuChevron() {
  return (
    <Image
      src={PROFILE_MOBILE_ASSETS.chevronRight}
      alt=""
      width={PROFILE_MOBILE_CHEVRON_SIZE_PX}
      height={PROFILE_MOBILE_CHEVRON_SIZE_PX}
      aria-hidden
      className="shrink-0 opacity-80"
    />
  );
}

/** Single profile menu row — tinted icon box, label, pink chevron. */
export function ProfileMobileMenuRow({
  label,
  icon,
  iconTheme = 'pink',
  onClick,
  variant = 'default',
}: ProfileMobileMenuRowProps) {
  const theme = PROFILE_MOBILE_ICON_THEMES[iconTheme];
  const isLogout = variant === 'logout';
  const isMultilineLabel = label.includes('\n');

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-gray-50/80"
    >
      <span className="flex min-w-0 items-center gap-3">
        {!isLogout && icon ? (
          <span
            className="flex shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5"
            style={{
              width: PROFILE_MOBILE_MENU_ICON_BOX_SIZE_PX,
              height: PROFILE_MOBILE_MENU_ICON_BOX_SIZE_PX,
              borderRadius: PROFILE_MOBILE_MENU_ICON_BOX_RADIUS_PX,
              backgroundColor: theme.background,
              color: theme.foreground,
            }}
          >
            {icon}
          </span>
        ) : null}
        <span
          className={`text-base ${
            isMultilineLabel ? 'whitespace-pre-line leading-snug' : 'truncate'
          } ${isLogout ? 'font-bold text-red-500' : 'font-medium text-gray-800'}`}
        >
          {label}
        </span>
      </span>
      <ProfileMobileMenuChevron />
    </button>
  );
}
