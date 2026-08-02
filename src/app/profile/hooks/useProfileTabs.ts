import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProfileTab } from '../types';

const PROFILE_TABS: readonly ProfileTab[] = [
  'dashboard',
  'personal',
  'addresses',
  'password',
  'orders',
  'deleteAccount',
] as const;

function resolveProfileTab(tab: string | null): ProfileTab {
  if (tab && PROFILE_TABS.includes(tab as ProfileTab)) {
    return tab as ProfileTab;
  }
  return 'dashboard';
}

function profileTabHref(tab: ProfileTab): string {
  return tab === 'dashboard' ? '/profile' : `/profile?tab=${tab}`;
}

export function useProfileTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>(() =>
    resolveProfileTab(searchParams.get('tab')),
  );

  useEffect(() => {
    setActiveTab(resolveProfileTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tab: ProfileTab) => {
      setActiveTab(tab);
      router.push(profileTabHref(tab), { scroll: false });
    },
    [router],
  );

  /** Close mobile sheet / leave a section without keeping a deep-link tab in the URL. */
  const resetToMenu = useCallback(() => {
    setActiveTab('dashboard');
    router.replace('/profile', { scroll: false });
  }, [router]);

  return {
    activeTab,
    handleTabChange,
    resetToMenu,
  };
}
