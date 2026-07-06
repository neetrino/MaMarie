import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  PROFILE_DESKTOP_DASHBOARD_CARD_CLASS,
  PROFILE_DESKTOP_STAT_THEMES,
  type ProfileDesktopStatTheme,
} from '../../../constants/admin-desktop-page';
import { PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS } from '../../../constants/profile-mobile-page';

interface AdminStatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  theme: ProfileDesktopStatTheme;
  onClick?: () => void;
}

/** Dashboard stat tile — matches profile dashboard clay cards. */
export function AdminStatCard({ label, value, icon, theme, onClick }: AdminStatCardProps) {
  const palette = PROFILE_DESKTOP_STAT_THEMES[theme];
  const isSvgDecoration = palette.decoration.endsWith('.svg');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-full overflow-hidden p-6 text-left transition-transform duration-200 ease-out hover:-translate-y-1 disabled:cursor-default disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${PROFILE_DESKTOP_DASHBOARD_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${palette.iconInnerClass}`}
        style={{
          backgroundColor: palette.iconBackground,
          color: palette.iconForeground,
        }}
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight" style={{ color: palette.valueColor }}>
        {value}
      </p>
      <div className="pointer-events-none absolute bottom-3 right-3 opacity-90">
        {isSvgDecoration ? (
          <Image src={palette.decoration} alt="" width={28} height={28} aria-hidden className="h-7 w-7" />
        ) : (
          <Image
            src={palette.decoration}
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="h-10 w-10 object-contain"
          />
        )}
      </div>
    </button>
  );
}
