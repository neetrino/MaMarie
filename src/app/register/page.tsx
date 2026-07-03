'use client';

import { useState, FormEvent } from 'react';
import { Input, Card } from '@shop/ui';
import Link from 'next/link';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  PROFILE_DESKTOP_ALERT_ERROR_CLASS,
  PROFILE_DESKTOP_INPUT_CLASS,
} from '../../constants/profile-desktop-page';
import { AUTH_FORM_CARD_CLASS } from '../../constants/auth-form';
import { ProfileClayButton } from '../profile/components/ProfileClayButton';
import { useTranslation } from '../../lib/i18n-client';
import { resolveRegisterApiError } from '../../lib/auth/client-api-error-messages';
import {
  AuthFieldErrors,
  clearAuthFieldError,
  validateRegisterFields,
} from '../../lib/auth/auth-form-field-errors';
import { Eye, EyeOff } from 'lucide-react';
import { logger } from "@/lib/utils/logger";

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
    logger.debug('✅ [REGISTER PAGE] All validations passed');

    try {
      logger.debug('📤 [REGISTER PAGE] Calling register function...');
      logger.debug('📤 [REGISTER PAGE] Registration data:', {
        email: email.trim() || 'not provided',
        phone: phone.trim() || 'not provided',
        hasPassword: !!password,
        firstName: firstName.trim() || 'not provided',
        lastName: lastName.trim() || 'not provided',
      });
      
      await register({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      
      logger.debug('✅ [REGISTER PAGE] Registration successful, redirecting...');
      // Redirect is handled by AuthContext
      // But we can also redirect here as a fallback
      setTimeout(() => {
        if (window.location.pathname === '/register') {
          logger.debug('🔄 [REGISTER PAGE] Fallback redirect to home...');
          window.location.href = '/';
        }
      }, 1000);
    } catch (err: unknown) {
      console.error('❌ [REGISTER PAGE] Registration error:', err);
      if (err instanceof Error) {
        console.error('❌ [REGISTER PAGE] Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
      }
      setError(resolveRegisterApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 md:max-w-2xl lg:px-8">
      <Card className={`p-8 ${AUTH_FORM_CARD_CLASS}`}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('register.title')}</h1>
        <p className="text-gray-600 mb-8">{t('register.subtitle')}</p>

        {error && (
          <div className={`mb-4 ${PROFILE_DESKTOP_ALERT_ERROR_CLASS}`}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.firstName')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder={t('register.placeholders.firstName')}
                className={`w-full ${PROFILE_DESKTOP_INPUT_CLASS}`}
                value={firstName}
                error={fieldErrors.firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFieldErrors((prev) => clearAuthFieldError(prev, 'firstName'));
                }}
                disabled={isSubmitting || isLoading}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.lastName')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder={t('register.placeholders.lastName')}
                className={`w-full ${PROFILE_DESKTOP_INPUT_CLASS}`}
                value={lastName}
                error={fieldErrors.lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setFieldErrors((prev) => clearAuthFieldError(prev, 'lastName'));
                }}
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.email')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.placeholders.email')}
                className={`w-full ${PROFILE_DESKTOP_INPUT_CLASS}`}
                value={email}
                error={fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => {
                    let next = clearAuthFieldError(prev, 'email');
                    next = clearAuthFieldError(next, 'phone');
                    return next;
                  });
                }}
                disabled={isSubmitting || isLoading}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.phone')}
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('register.placeholders.phone')}
                className={`w-full ${PROFILE_DESKTOP_INPUT_CLASS}`}
                value={phone}
                error={fieldErrors.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setFieldErrors((prev) => {
                    let next = clearAuthFieldError(prev, 'phone');
                    next = clearAuthFieldError(next, 'email');
                    return next;
                  });
                }}
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.password')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('register.placeholders.password')}
                  className={`w-full pr-10 ${PROFILE_DESKTOP_INPUT_CLASS}`}
                  value={password}
                  error={fieldErrors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => clearAuthFieldError(prev, 'password'));
                  }}
                  disabled={isSubmitting || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t('register.passwordHint')}
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.form.confirmPassword')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('register.placeholders.confirmPassword')}
                  className={`w-full pr-10 ${PROFILE_DESKTOP_INPUT_CLASS}`}
                  value={confirmPassword}
                  error={fieldErrors.confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => clearAuthFieldError(prev, 'confirmPassword'));
                  }}
                  disabled={isSubmitting || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isSubmitting || isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                setFieldErrors((prev) => clearAuthFieldError(prev, 'terms'));
              }}
              className={`mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                fieldErrors.terms ? 'border-error' : ''
              }`}
              disabled={isSubmitting || isLoading}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              {t('register.form.acceptTerms')}{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                {t('register.form.termsOfService')}
              </Link>{' '}
              {t('register.form.and')}{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                {t('register.form.privacyPolicy')}
              </Link>
            </label>
          </div>
          {fieldErrors.terms && (
            <p className="-mt-2 text-sm text-error">{fieldErrors.terms}</p>
          )}
          <ProfileClayButton
            variant="primary"
            className="w-full"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? t('register.form.creatingAccount') : t('register.form.createAccount')}
          </ProfileClayButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('register.form.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              {t('register.form.signIn')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

