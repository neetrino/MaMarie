import type { FormEvent } from 'react';
import { Input } from '@shop/ui';
import {
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
} from '../../constants/profile-desktop-page';
import { ProfileClayButton } from './components/ProfileClayButton';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfilePasswordProps {
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: (form: ProfilePasswordProps['passwordForm']) => void;
  savingPassword: boolean;
  onSave: (e: FormEvent) => void;
  t: (key: string) => string;
}

export function ProfilePassword({
  passwordForm,
  setPasswordForm,
  savingPassword,
  onSave,
  t,
}: ProfilePasswordProps) {
  return (
    <ProfileSectionCard mobileFrameless>
      <div className="mx-auto w-full max-w-md lg:max-w-lg">
        <h2
          className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} ${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} text-center`}
        >
          {t('profile.password.title')}
        </h2>
        <form onSubmit={onSave} className="space-y-6">
        <Input
          label={t('profile.password.currentPassword')}
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          placeholder={t('profile.password.currentPasswordPlaceholder')}
          className={PROFILE_DESKTOP_INPUT_CLASS}
          required
        />
        <Input
          label={t('profile.password.newPassword')}
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          placeholder={t('profile.password.newPasswordPlaceholder')}
          className={PROFILE_DESKTOP_INPUT_CLASS}
          required
        />
        <Input
          label={t('profile.password.confirmPassword')}
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          placeholder={t('profile.password.confirmPasswordPlaceholder')}
          className={PROFILE_DESKTOP_INPUT_CLASS}
          required
        />
        <div className="flex justify-center pt-2 sm:pt-4">
          <ProfileClayButton
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={savingPassword}
          >
            {savingPassword ? t('profile.password.changing') : t('profile.password.change')}
          </ProfileClayButton>
        </div>
      </form>
      </div>
    </ProfileSectionCard>
  );
}
