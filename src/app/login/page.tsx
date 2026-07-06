'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { resolveLoginApiError } from '../../lib/auth/client-api-error-messages';
import {
  AuthFieldErrors,
  clearAuthFieldError,
  validateLoginFields,
} from '../../lib/auth/auth-form-field-errors';
import { logger } from '@/lib/utils/logger';
import { useClientMounted } from '../../lib/use-client-mounted';
import { AuthFormSkeleton } from '../../components/auth/AuthFormSkeleton';
import { LoginPageScene } from '../../components/auth/LoginPageScene';
import { LoginForm } from '../../components/auth/LoginForm';

function LoginPageContent() {
  const { t } = useTranslation();
  const isFormMounted = useClientMounted();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const nextFieldErrors = validateLoginFields({ email, password }, t);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      logger.debug('🔐 [LOGIN PAGE] Form submitted');
      const loggedInUser = await login(email.trim(), password);
      const isUserAdmin =
        Array.isArray(loggedInUser.roles) && loggedInUser.roles.includes('admin');
      const destination = isUserAdmin ? '/supersudo' : redirectTo;
      logger.debug('✅ [LOGIN PAGE] Login successful, redirecting to:', destination);
      router.push(destination);
    } catch (err: unknown) {
      logger.error('❌ [LOGIN PAGE] Login error', {
        message: err instanceof Error ? err.message : String(err),
      });
      setError(resolveLoginApiError(err instanceof Error ? err.message : String(err), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push(isAdmin ? '/supersudo' : redirectTo);
    }
  }, [isLoggedIn, isLoading, isAdmin, redirectTo, router]);

  const formLabels = {
    email: t('login.form.email'),
    emailPlaceholder: t('login.form.emailPlaceholder'),
    password: t('login.form.password'),
    passwordPlaceholder: t('login.form.passwordPlaceholder'),
    rememberMe: t('login.form.rememberMe'),
    forgotPassword: t('login.form.forgotPassword'),
    submit: t('login.form.submit'),
    submitting: t('login.form.submitting'),
    noAccount: t('login.form.noAccount'),
    signUp: t('login.form.signUp'),
    showPassword: t('login.form.showPassword'),
    hidePassword: t('login.form.hidePassword'),
  };

  return (
    <LoginPageScene title={t('login.title')} subtitle={t('login.subtitle')}>
      {isFormMounted ? (
        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          rememberMe={rememberMe}
          error={error}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          labels={formLabels}
          onSubmit={handleSubmit}
          onEmailChange={(event) => {
            setEmail(event.target.value);
            setFieldErrors((prev) => clearAuthFieldError(prev, 'email'));
          }}
          onPasswordChange={(event) => {
            setPassword(event.target.value);
            setFieldErrors((prev) => clearAuthFieldError(prev, 'password'));
          }}
          onRememberMeChange={setRememberMe}
          onTogglePassword={() => setShowPassword((current) => !current)}
        />
      ) : (
        <AuthFormSkeleton />
      )}
    </LoginPageScene>
  );
}

function LoginPageFallback() {
  const { t } = useTranslation();

  return (
    <LoginPageScene title={t('login.title')} subtitle={t('login.subtitle')}>
      <AuthFormSkeleton />
    </LoginPageScene>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
