import type { FormEvent } from 'react';
import { useMemo } from 'react';
import { Input } from '@shop/ui';
import { ClaySelect } from '../../components/ClaySelect';
import { BRAND_CHECKBOX_CLASS } from '../../constants/brand';
import {
  PROFILE_DESKTOP_CARD_CLASS,
  PROFILE_DESKTOP_DEFAULT_BADGE_CLASS,
  PROFILE_DESKTOP_INPUT_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
} from '../../constants/profile-desktop-page';
import { PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS } from '../../constants/profile-mobile-page';
import {
  CHECKOUT_DELIVERY_CITY_VALUES,
  getCheckoutDeliveryCityLabel,
  resolveCheckoutDeliveryCityDisplayLabel,
} from '../checkout/constants/checkout-delivery-cities';
import type { Address, UserProfile } from './types';
import { ProfileClayButton } from './components/ProfileClayButton';
import { ProfileSectionCard } from './components/ProfileSectionCard';

/** Default («լռելյայն») address always first after «Սահմանել որպես լռելյայն». */
function sortAddressesForDisplay(addresses: Address[]): Address[] {
  return [...addresses].sort((left, right) => {
    const leftDefault = left.isDefault ? 0 : 1;
    const rightDefault = right.isDefault ? 0 : 1;
    return leftDefault - rightDefault;
  });
}

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
  const cityOptions = useMemo(
    () =>
      CHECKOUT_DELIVERY_CITY_VALUES.map((city) => ({
        value: city,
        label: getCheckoutDeliveryCityLabel(t, city),
      })),
    [t],
  );

  const sortedAddresses = useMemo(
    () => sortAddressesForDisplay(profile?.addresses ?? []),
    [profile?.addresses],
  );

  return (
    <ProfileSectionCard mobileFrameless>
      <div className={`${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('profile.addresses.title')}</h2>
        {!showAddressForm ? (
          <ProfileClayButton
            type="button"
            variant="primary"
            className="w-full shrink-0 sm:w-auto"
            onClick={() => {
              onResetForm();
              setShowAddressForm(true);
            }}
          >
            {`+ ${t('profile.addresses.addNew')}`}
          </ProfileClayButton>
        ) : null}
      </div>

      {showAddressForm ? (
        <form
          onSubmit={onSave}
          className={`mb-8 space-y-5 p-4 sm:mb-10 sm:p-6 ${PROFILE_DESKTOP_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}
        >
          <h3 className="text-base font-semibold text-gray-900">
            {editingAddress ? t('profile.addresses.form.editTitle') : t('profile.addresses.form.addTitle')}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <ClaySelect
              label={t('profile.addresses.form.city')}
              placeholder={t('checkout.shipping.selectCity')}
              options={cityOptions}
              value={addressForm.city}
              onChange={(city) => setAddressForm({ ...addressForm, city })}
              portal
            />
            <Input
              label={t('profile.addresses.form.addressLine1')}
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              className={PROFILE_DESKTOP_INPUT_CLASS}
              required
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={addressForm.isDefault || false}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className={`h-4 w-4 ${BRAND_CHECKBOX_CLASS}`}
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
        {sortedAddresses.length > 0 ? (
          sortedAddresses.map((address, index) => (
            <div
              key={address.id || address._id || index}
              className={`relative flex h-full flex-col p-4 pr-16 sm:p-5 sm:pr-16 lg:p-6 lg:pr-16 ${PROFILE_DESKTOP_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}
            >
              <div className="absolute right-3 top-3 flex items-center gap-1 sm:right-4 sm:top-4">
                <button
                  type="button"
                  onClick={() => onEdit(address)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-[#fdeef2] hover:text-brand-pink"
                  aria-label={t('profile.addresses.edit')}
                  title={t('profile.addresses.edit')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete((address.id || address._id)!)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={t('profile.addresses.delete')}
                  title={t('profile.addresses.delete')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {address.isDefault ? (
                  <span className={PROFILE_DESKTOP_DEFAULT_BADGE_CLASS}>{t('profile.addresses.default')}</span>
                ) : null}
                <p className="break-words text-sm font-medium leading-snug text-gray-900 sm:text-base">
                  {address.addressLine1}
                </p>
                <p className="break-words text-sm leading-snug text-gray-700 sm:text-base">
                  {resolveCheckoutDeliveryCityDisplayLabel(t, address.city) || address.city}
                </p>
              </div>
              {!address.isDefault ? (
                <div className="mt-4">
                  <ProfileClayButton
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => onSetDefault((address.id || address._id)!)}
                  >
                    {t('profile.addresses.setDefault')}
                  </ProfileClayButton>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="col-span-full py-12 text-center text-sm text-gray-500 sm:py-16">
            {t('profile.addresses.noAddresses')}
          </p>
        )}
      </div>
    </ProfileSectionCard>
  );
}
