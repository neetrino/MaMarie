import type { ReactNode } from 'react';
import {
  PROFILE_DESKTOP_CARD_CLASS,
  PROFILE_DESKTOP_TAB_ICON_THEME,
  PROFILE_MOBILE_ICON_THEMES,
} from '../../constants/profile-desktop-page';
import type { ProfileTab, ProfileTabConfig, UserProfile } from './types';
import { ProfileMobileAvatar } from './components/ProfileMobileAvatar';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  t: (key: string) => string;
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ProfileDesktopContactRow({
  icon,
  value,
}: {
  icon: ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[15px] bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100/80">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fdeef2] text-brand-pink">
        {icon}
      </span>
      <p className="min-w-0 break-all text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

function ProfileDesktopTabNav({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  return (
    <nav className="flex flex-col gap-1" role="tablist" aria-label="Profile sections">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const theme = PROFILE_MOBILE_ICON_THEMES[PROFILE_DESKTOP_TAB_ICON_THEME[tab.id]];
        const isMultilineLabel = tab.label.includes('\n');

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`flex w-full items-center gap-3 rounded-[15px] border-l-4 px-3 py-2.5 text-left transition-colors ${
              isActive ? 'pl-[calc(0.75rem-4px)]' : 'border-transparent hover:bg-white/70'
            }`}
            style={
              isActive
                ? {
                    borderLeftColor: theme.foreground,
                    backgroundColor: theme.background,
                  }
                : undefined
            }
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
              style={{
                backgroundColor: theme.background,
                color: theme.foreground,
              }}
            >
              {tab.icon}
            </span>
            <span
              className={`min-w-0 flex-1 text-sm font-medium ${
                isActive ? 'font-semibold' : 'text-gray-800'
              } ${isMultilineLabel ? 'whitespace-pre-line leading-snug' : ''}`}
              style={isActive ? { color: theme.foreground } : undefined}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function ProfileHeader({ profile, tabs, activeTab, onTabChange, onLogout, t }: ProfileHeaderProps) {
  const hasSplitName = Boolean(profile?.firstName && profile?.lastName);

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col p-5 ${PROFILE_DESKTOP_CARD_CLASS}`}
      aria-label="Profile navigation"
    >
      <div className="shrink-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <ProfileMobileAvatar
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            avatarUrl={
              profile?.avatarUrl || profile?.avatar || profile?.imageUrl || profile?.image || null
            }
          />
          <div className="min-w-0">
            {hasSplitName ? (
              <p className="text-lg font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </p>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {profile?.firstName || profile?.lastName || t('profile.myProfile')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {profile?.email ? (
            <ProfileDesktopContactRow icon={<MailIcon className="h-4 w-4" />} value={profile.email} />
          ) : null}
          {profile?.phone ? (
            <ProfileDesktopContactRow icon={<PhoneIcon className="h-4 w-4" />} value={profile.phone} />
          ) : null}
        </div>
      </div>

      <div className="profile-desktop-sidebar-scroll profile-scroll-area mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-gray-100 pt-4">
        <ProfileDesktopTabNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-[15px] border-l-4 border-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/70"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fdeef2] text-brand-pink">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-brand-pink">{t('common.navigation.logout')}</span>
        </button>
      </div>
    </div>
  );
}
