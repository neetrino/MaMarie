import type { FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import {
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../constants/profile-desktop-page';
import type { UserProfile } from './types';
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
    <ProfileSectionCard>
      <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>
        {t('profile.personal.title')}
      </h2>
      <form onSubmit={onSave} className="mx-auto max-w-xl space-y-6 lg:mx-0 lg:max-w-2xl">
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
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
          <Button
            type="button"
            variant="outline"
            className={`w-full sm:w-auto ${PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS}`}
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
          </Button>
          <Button
            type="submit"
            variant="primary"
            className={`w-full sm:w-auto ${PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS}`}
            disabled={savingPersonal}
          >
            {savingPersonal ? t('profile.personal.saving') : t('profile.personal.save')}
          </Button>
        </div>
      </form>
    </ProfileSectionCard>
  );
}
