import type { FormEvent } from 'react';
import { Input } from '@shop/ui';
import {
  PROFILE_DESKTOP_DEFAULT_BADGE_CLASS,
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
} from '../../constants/profile-desktop-page';
import type { Address, UserProfile } from './types';
import { ProfileClayButton } from './components/ProfileClayButton';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfileAddressesProps {
  profile: UserProfile | null;
  showAddressForm: boolean;
  setShowAddressForm: (show: boolean) => void;
  editingAddress: Address | null;
  addressForm: Address;
  setAddressForm: (address: Address) => void;
  savingAddress: boolean;
  onSave: (e: FormEvent) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  onEdit: (address: Address) => void;
  onResetForm: () => void;
  t: (key: string) => string;
}

export function ProfileAddresses({
  profile,
  showAddressForm,
  setShowAddressForm,
  editingAddress,
  addressForm,
  setAddressForm,
  savingAddress,
  onSave,
  onDelete,
  onSetDefault,
  onEdit,
  onResetForm,
  t,
}: ProfileAddressesProps) {
  return (
    <ProfileSectionCard>
      <div className={`${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('profile.addresses.title')}</h2>
        <ProfileClayButton
          type="button"
          variant={showAddressForm ? 'secondary' : 'primary'}
          className="w-full shrink-0 sm:w-auto"
          onClick={() => {
            onResetForm();
            setShowAddressForm(!showAddressForm);
          }}
        >
          {showAddressForm ? t('profile.addresses.form.cancel') : `+ ${t('profile.addresses.addNew')}`}
        </ProfileClayButton>
      </div>

      {showAddressForm ? (
        <form
          onSubmit={onSave}
          className="mb-8 space-y-5 rounded-[15px] bg-[#fcfcfc] p-4 sm:mb-10 sm:p-6"
        >
          <h3 className="text-base font-semibold text-gray-900">
            {editingAddress ? t('profile.addresses.form.editTitle') : t('profile.addresses.form.addTitle')}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <Input
              label={t('profile.addresses.form.addressLine1')}
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              className={PROFILE_DESKTOP_INPUT_CLASS}
              required
            />
            <Input
              label={t('profile.addresses.form.city')}
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              className={PROFILE_DESKTOP_INPUT_CLASS}
              required
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={addressForm.isDefault || false}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
            />
            <span className="text-sm text-gray-700">{t('profile.addresses.form.isDefault')}</span>
          </label>
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:gap-3">
            <ProfileClayButton
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setShowAddressForm(false);
                onResetForm();
              }}
            >
              {t('profile.addresses.form.cancel')}
            </ProfileClayButton>
            <ProfileClayButton
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={savingAddress}
            >
              {savingAddress
                ? t('profile.addresses.form.saving')
                : editingAddress
                  ? t('profile.addresses.form.update')
                  : t('profile.addresses.form.add')}
            </ProfileClayButton>
          </div>
        </form>
      ) : null}

      <div className="space-y-4">
        {profile?.addresses && profile.addresses.length > 0 ? (
          profile.addresses.map((address, index) => (
            <div key={address.id || address._id || index} className="rounded-[15px] bg-[#fcfcfc] p-4 transition hover:bg-white sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                <div className="min-w-0 flex-1 space-y-2">
                  {address.isDefault ? (
                    <span className={PROFILE_DESKTOP_DEFAULT_BADGE_CLASS}>{t('profile.addresses.default')}</span>
                  ) : null}
                  <p className="text-sm text-gray-800 sm:text-base">{address.addressLine1}</p>
                  <p className="text-sm text-gray-800 sm:text-base">{address.city}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 lg:pt-0">
                  {!address.isDefault ? (
                    <ProfileClayButton
                      type="button"
                      variant="secondary"
                      className="flex-1 sm:flex-initial"
                      onClick={() => onSetDefault((address.id || address._id)!)}
                    >
                      {t('profile.addresses.setDefault')}
                    </ProfileClayButton>
                  ) : null}
                  <ProfileClayButton
                    type="button"
                    variant="secondary"
                    className="flex-1 sm:flex-initial"
                    onClick={() => onEdit(address)}
                  >
                    {t('profile.addresses.edit')}
                  </ProfileClayButton>
                  <ProfileClayButton
                    type="button"
                    variant="danger"
                    className="flex-1 sm:flex-initial"
                    onClick={() => onDelete((address.id || address._id)!)}
                  >
                    {t('profile.addresses.delete')}
                  </ProfileClayButton>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-12 text-center text-sm text-gray-500 sm:py-16">{t('profile.addresses.noAddresses')}</p>
        )}
      </div>
    </ProfileSectionCard>
  );
}
