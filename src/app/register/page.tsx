'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { resolveRegisterApiError } from '../../lib/auth/client-api-error-messages';
import {
  AuthFieldErrors,
  clearAuthFieldError,
  validateRegisterFields,
} from '../../lib/auth/auth-form-field-errors';
import { logger } from '@/lib/utils/logger';
import {
  REGISTER_CARD_MAX_WIDTH_PX,
  REGISTER_CARD_OFFSET_TOP_PX,
  REGISTER_PAGE_MIN_HEIGHT_PX,
} from '../../constants/login-page';
import { LoginPageScene } from '../../components/auth/LoginPageScene';
import { RegisterForm } from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const nextFieldErrors = validateRegisterFields(
      {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        acceptTerms,
      },
      t,
    );

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);
    logger.debug('🔐 [REGISTER PAGE] Form submitted');

    try {
      await register({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      logger.debug('✅ [REGISTER PAGE] Registration successful, redirecting...');
      setTimeout(() => {
        if (window.location.pathname === '/register') {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err: unknown) {
      logger.error('❌ [REGISTER PAGE] Registration error', {
        message: err instanceof Error ? err.message : String(err),
      });
      setError(resolveRegisterApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formLabels = {
    firstName: t('register.form.firstName'),
    lastName: t('register.form.lastName'),
    email: t('register.form.email'),
    phone: t('register.form.phone'),
    password: t('register.form.password'),
    confirmPassword: t('register.form.confirmPassword'),
    acceptTerms: t('register.form.acceptTerms'),
    termsOfService: t('register.form.termsOfService'),
    and: t('register.form.and'),
    privacyPolicy: t('register.form.privacyPolicy'),
    submit: t('register.form.createAccount'),
    submitting: t('register.form.creatingAccount'),
    alreadyHaveAccount: t('register.form.alreadyHaveAccount'),
    signIn: t('register.form.signIn'),
    showPassword: t('login.form.showPassword'),
    hidePassword: t('login.form.hidePassword'),
    passwordHint: t('register.passwordHint'),
    placeholders: {
      firstName: t('register.placeholders.firstName'),
      lastName: t('register.placeholders.lastName'),
      email: t('register.placeholders.email'),
      phone: t('register.placeholders.phone'),
      password: t('register.placeholders.password'),
      confirmPassword: t('register.placeholders.confirmPassword'),
    },
  };

  return (
    <LoginPageScene
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      cardMaxWidthPx={REGISTER_CARD_MAX_WIDTH_PX}
      sectionMinHeightPx={REGISTER_PAGE_MIN_HEIGHT_PX}
      cardOffsetTopPx={REGISTER_CARD_OFFSET_TOP_PX}
    >
      <RegisterForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        acceptTerms={acceptTerms}
        error={error}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        labels={formLabels}
        onSubmit={handleSubmit}
        onFirstNameChange={(event) => {
          setFirstName(event.target.value);
          setFieldErrors((prev) => clearAuthFieldError(prev, 'firstName'));
        }}
        onLastNameChange={(event) => {
          setLastName(event.target.value);
          setFieldErrors((prev) => clearAuthFieldError(prev, 'lastName'));
        }}
        onEmailChange={(event) => {
          setEmail(event.target.value);
          setFieldErrors((prev) => {
            let next = clearAuthFieldError(prev, 'email');
            next = clearAuthFieldError(next, 'phone');
            return next;
          });
        }}
        onPhoneChange={(event) => {
          setPhone(event.target.value);
          setFieldErrors((prev) => {
            let next = clearAuthFieldError(prev, 'phone');
            next = clearAuthFieldError(next, 'email');
            return next;
          });
        }}
        onPasswordChange={(event) => {
          setPassword(event.target.value);
          setFieldErrors((prev) => clearAuthFieldError(prev, 'password'));
        }}
        onConfirmPasswordChange={(event) => {
          setConfirmPassword(event.target.value);
          setFieldErrors((prev) => clearAuthFieldError(prev, 'confirmPassword'));
        }}
        onAcceptTermsChange={(checked) => {
          setAcceptTerms(checked);
          setFieldErrors((prev) => clearAuthFieldError(prev, 'terms'));
        }}
        onTogglePassword={() => setShowPassword((current) => !current)}
        onToggleConfirmPassword={() => setShowConfirmPassword((current) => !current)}
      />
    </LoginPageScene>
  );
}
