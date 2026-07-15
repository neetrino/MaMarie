/** localStorage key — must stay in sync with AuthContext. */
export const AUTH_USER_STORAGE_KEY = 'auth_user';

export interface StoredAuthUserFields {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
}

/**
 * Merges profile fields into the cached auth user and notifies listeners.
 * Keeps header / checkout / contact in sync after profile edits.
 */
export function syncStoredAuthUser(fields: StoredAuthUserFields): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next = {
      ...parsed,
      firstName: fields.firstName ?? parsed.firstName,
      lastName: fields.lastName ?? parsed.lastName,
      email: fields.email ?? parsed.email,
      phone: fields.phone ?? parsed.phone,
    };

    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('auth-updated'));
  } catch {
    // Ignore corrupt storage — AuthContext will recover on next load
  }
}
