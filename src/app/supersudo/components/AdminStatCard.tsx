import Image from 'next/image';
import type { ReactNode } from 'react';
import { DecorationMotionShell } from '../../../components/decoration-motion/DecorationMotionShell';
import {
  PROFILE_DESKTOP_DASHBOARD_CARD_CLASS,
  PROFILE_DESKTOP_STAT_DECORATION_SIZE_PX,
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

/** Dashboard stat tile — same clay layout as profile dashboard cards. */
export function AdminStatCard({ label, value, icon, theme, onClick }: AdminStatCardProps) {
  const palette = PROFILE_DESKTOP_STAT_THEMES[theme];
  const decorationSizePx = PROFILE_DESKTOP_STAT_DECORATION_SIZE_PX;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative flex w-full items-center overflow-hidden p-6 text-left transition-transform duration-200 ease-out hover:-translate-y-1 disabled:cursor-default disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${PROFILE_DESKTOP_DASHBOARD_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}
    >
      <div className="flex w-full items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${palette.iconInnerClass}`}
          style={{
            backgroundColor: palette.iconBackground,
            color: palette.iconForeground,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug text-gray-600">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight" style={{ color: palette.valueColor }}>
            {value}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 opacity-90">
        <DecorationMotionShell motion={palette.motion} inline>
          <Image
            src={palette.decoration}
            alt=""
            width={decorationSizePx}
            height={decorationSizePx}
            aria-hidden
            className="h-14 w-14 object-contain"
          />
        </DecorationMotionShell>
      </div>
    </button>
  );
}
