export type AuthFieldErrors = Partial<Record<string, string>>;

export function clearAuthFieldError(
  errors: AuthFieldErrors,
  field: string,
): AuthFieldErrors {
  if (!errors[field]) {
    return errors;
  }

  const next = { ...errors };
  delete next[field];
  return next;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export function validateLoginFields(
  values: LoginFormValues,
  t: (key: string) => string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!values.email.trim()) {
    errors.email = t('login.errors.emailRequired');
  }

  if (!values.password) {
    errors.password = t('login.errors.passwordRequired');
  }

  return errors;
}

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function validateRegisterFields(
  values: RegisterFormValues,
  t: (key: string) => string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = t('register.errors.firstNameRequired');
  }

  if (!values.lastName.trim()) {
    errors.lastName = t('register.errors.lastNameRequired');
  }

  if (!values.email.trim() && !values.phone.trim()) {
    const message = t('register.errors.emailOrPhoneRequired');
    errors.email = message;
    errors.phone = message;
  }

  if (!values.password) {
    errors.password = t('register.errors.passwordRequired');
  } else if (values.password.length < 6) {
    errors.password = t('register.errors.passwordMinLength');
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = t('register.errors.passwordRequired');
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = t('register.errors.passwordsDoNotMatch');
  }

  if (!values.acceptTerms) {
    errors.terms = t('register.errors.mustAcceptTerms');
  }

  return errors;
}
