import type { FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import {
  PROFILE_DESKTOP_DANGER_BUTTON_CLASS,
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../constants/profile-desktop-page';
import type { UserProfile } from './types';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfileDeleteAccountProps {
  profile: UserProfile | null;
  password: string;
  setPassword: (value: string) => void;
  confirmation: string;
  setConfirmation: (value: string) => void;
  acknowledged: boolean;
  setAcknowledged: (value: boolean) => void;
  deleting: boolean;
  onSubmit: (e: FormEvent) => void;
  t: (key: string) => string;
}

export function ProfileDeleteAccount({
  profile,
  password,
  setPassword,
  confirmation,
  setConfirmation,
  acknowledged,
  setAcknowledged,
  deleting,
  onSubmit,
  t,
}: ProfileDeleteAccountProps) {
  if (!profile) {
    return (
      <ProfileSectionCard>
        <p className="text-sm text-gray-600">{t('profile.common.loadingProfile')}</p>
      </ProfileSectionCard>
    );
  }

  const hasPassword = profile.hasPassword ?? true;

  return (
    <ProfileSectionCard className="border border-red-200 bg-red-50/30">
      <div className="mb-6 space-y-2 sm:mb-8">
        <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('profile.deleteAccount.title')}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-700">{t('profile.deleteAccount.description')}</p>
      </div>

      <ul className="mb-8 max-w-2xl list-disc space-y-2 pl-5 text-sm text-gray-600 sm:mb-10">
        <li>{t('profile.deleteAccount.pointOrders')}</li>
        <li>{t('profile.deleteAccount.pointLogin')}</li>
        <li>{t('profile.deleteAccount.pointData')}</li>
      </ul>

      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6 lg:mx-0 lg:max-w-2xl">
        {hasPassword ? (
          <Input
            label={t('profile.deleteAccount.currentPassword')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('profile.deleteAccount.currentPasswordPlaceholder')}
            autoComplete="current-password"
            className={PROFILE_DESKTOP_INPUT_CLASS}
            required
          />
        ) : (
          <Input
            label={t('profile.deleteAccount.confirmationLabel')}
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={t('profile.deleteAccount.confirmationPlaceholder')}
            autoComplete="off"
            className={PROFILE_DESKTOP_INPUT_CLASS}
            required
          />
        )}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          <span className="text-sm leading-snug text-gray-800">{t('profile.deleteAccount.acknowledge')}</span>
        </label>

        <div className="pt-1 sm:pt-2">
          <Button
            type="submit"
            variant="primary"
            className={`w-full sm:w-auto ${PROFILE_DESKTOP_DANGER_BUTTON_CLASS}`}
            disabled={deleting || !acknowledged}
          >
            {deleting ? t('profile.deleteAccount.deleting') : t('profile.deleteAccount.submit')}
          </Button>
        </div>
      </form>
    </ProfileSectionCard>
  );
}
