import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { apiClient } from '../../../lib/api-client';
import { useAuth } from '../../../lib/auth/AuthContext';
import type { CheckoutFormData } from '../types';
import { resolveDeliveryCityFromProfile } from '../utils/resolve-delivery-city';

interface ProfileAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  phone?: string;
  isDefault?: boolean;
}

interface UserProfileResponse {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  addresses?: ProfileAddress[];
}

function applyProfileFields(
  setValue: UseFormSetValue<CheckoutFormData>,
  fields: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
  },
): void {
  if (fields.firstName) {
    setValue('firstName', fields.firstName);
  }
  if (fields.lastName) {
    setValue('lastName', fields.lastName);
  }
  if (fields.email) {
    setValue('email', fields.email);
  }
  if (fields.phone) {
    setValue('phone', fields.phone);
  }
}

function applyDefaultAddress(
  setValue: UseFormSetValue<CheckoutFormData>,
  addresses: ProfileAddress[],
): void {
  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
  if (!defaultAddress) {
    return;
  }

  if (defaultAddress.firstName) {
    setValue('firstName', defaultAddress.firstName);
  }
  if (defaultAddress.lastName) {
    setValue('lastName', defaultAddress.lastName);
  }
  if (defaultAddress.phone) {
    setValue('phone', defaultAddress.phone);
  }

  if (defaultAddress.addressLine1) {
    const fullAddress = defaultAddress.addressLine2
      ? `${defaultAddress.addressLine1}, ${defaultAddress.addressLine2}`
      : defaultAddress.addressLine1;
    setValue('shippingAddress', fullAddress);
  }

  const city = resolveDeliveryCityFromProfile(defaultAddress.city);
  if (city) {
    setValue('shippingCity', city);
  } else if (defaultAddress.city) {
    setValue('shippingCity', defaultAddress.city);
  }
}

export function useUserProfile(
  isLoggedIn: boolean,
  isLoading: boolean,
  setValue: UseFormSetValue<CheckoutFormData>,
) {
  const { user } = useAuth();

  useEffect(() => {
    async function loadUserProfile() {
      if (isLoading || !isLoggedIn) {
        return;
      }

      if (user) {
        applyProfileFields(setValue, user);
      }

      try {
        const profile = await apiClient.get<UserProfileResponse>('/api/v1/users/profile');
        applyProfileFields(setValue, profile);

        if (profile.addresses && profile.addresses.length > 0) {
          applyDefaultAddress(setValue, profile.addresses);
        }
      } catch {
        // Auth context fields remain as fallback
      }
    }

    loadUserProfile();
  }, [isLoggedIn, isLoading, user?.id, user?.firstName, user?.lastName, user?.email, user?.phone, setValue]);
}
