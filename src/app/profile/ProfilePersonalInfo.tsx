import type { FormEvent } from 'react';
import { Input } from '@shop/ui';
import {
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
} from '../../constants/profile-desktop-page';
import type { UserProfile } from './types';
import { ProfileClayButton } from './components/ProfileClayButton';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfilePersonalInfoProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  setPersonalInfo: (info: ProfilePersonalInfoProps['personalInfo']) => void;
  savingPersonal: boolean;
  onSave: (e: FormEvent) => void;
  profile: UserProfile | null;
  t: (key: string) => string;
}

export function ProfilePersonalInfo({
  personalInfo,
  setPersonalInfo,
  savingPersonal,
  onSave,
  profile,
  t,
}: ProfilePersonalInfoProps) {
  return (
    <ProfileSectionCard mobileFrameless>
      <div className="mx-auto w-full max-w-lg lg:max-w-xl">
        <h2
          className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} ${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} text-center`}
        >
          {t('profile.personal.title')}
        </h2>
        <form onSubmit={onSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <Input
            label={t('profile.personal.firstName')}
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            placeholder={t('profile.personal.firstNamePlaceholder')}
            className={PROFILE_DESKTOP_INPUT_CLASS}
          />
          <Input
            label={t('profile.personal.lastName')}
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            placeholder={t('profile.personal.lastNamePlaceholder')}
            className={PROFILE_DESKTOP_INPUT_CLASS}
          />
        </div>
        <Input
          label={t('profile.personal.email')}
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
          placeholder={t('profile.personal.emailPlaceholder')}
          className={PROFILE_DESKTOP_INPUT_CLASS}
        />
        <Input
          label={t('profile.personal.phone')}
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
          placeholder={t('profile.personal.phonePlaceholder')}
          className={PROFILE_DESKTOP_INPUT_CLASS}
        />
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:pt-4">
          <ProfileClayButton
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              setPersonalInfo({
                firstName: profile?.firstName || '',
                lastName: profile?.lastName || '',
                email: profile?.email || '',
                phone: profile?.phone || '',
              });
            }}
          >
            {t('profile.personal.cancel')}
          </ProfileClayButton>
          <ProfileClayButton
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={savingPersonal}
          >
            {savingPersonal ? t('profile.personal.saving') : t('profile.personal.save')}
          </ProfileClayButton>
        </div>
      </form>
      </div>
    </ProfileSectionCard>
  );
}
