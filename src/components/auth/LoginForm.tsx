import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import {
  LOGIN_ACTIONS_GAP_PX,
  LOGIN_ACTIONS_TOP_GAP_PX,
  LOGIN_CHECKBOX_GAP_PX,
  LOGIN_CHECKBOX_SIZE_PX,
  LOGIN_ERROR_CLASS,
  LOGIN_FIELD_ASSETS,
  LOGIN_FOOTER_TEXT_COLOR,
  LOGIN_INPUT_ICON_SIZE_PX,
  LOGIN_MUTED_TEXT_COLOR,
  LOGIN_SECONDARY_TEXT_FONT_SIZE_PX,
  LOGIN_SIGNUP_LINK_COLOR,
  LOGIN_SUBMIT_BG,
  LOGIN_SUBMIT_FONT_SIZE_PX,
  LOGIN_SUBMIT_HEIGHT_PX,
  LOGIN_SUBMIT_INSET_SHADOW,
  LOGIN_SUBMIT_LINE_HEIGHT_PX,
} from '../../constants/login-page';
import { CLAY_PRIMARY_BUTTON_CLASS } from '../../constants/clay-primary-button';
import type { AuthFieldErrors } from '../../lib/auth/auth-form-field-errors';
import { LoginFormField } from './LoginFormField';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  error: string | null;
  fieldErrors: AuthFieldErrors;
  isSubmitting: boolean;
  isLoading: boolean;
  labels: {
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    submit: string;
    submitting: string;
    noAccount: string;
    signUp: string;
    showPassword: string;
    hidePassword: string;
  };
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (checked: boolean) => void;
  onTogglePassword: () => void;
}

/** Figma `222:546` — fields, clay submit, remember/forgot row, sign-up link. */
export function LoginForm({
  email,
  password,
  showPassword,
  rememberMe,
  error,
  fieldErrors,
  isSubmitting,
  isLoading,
  labels,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onTogglePassword,
}: LoginFormProps) {
  const disabled = isSubmitting || isLoading;
  const iconSize = LOGIN_INPUT_ICON_SIZE_PX;

  return (
    <form
      onSubmit={onSubmit}
      className="auth-page-form flex w-full flex-col gap-6 lg:gap-[22px]"
      suppressHydrationWarning
    >
      {error ? (
        <div className={LOGIN_ERROR_CLASS} role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      <div className="auth-page-form-fields flex w-full flex-col gap-5 lg:gap-[18px]">
        <LoginFormField
          id="email"
          label={labels.email}
          type="email"
          value={email}
          placeholder={labels.emailPlaceholder}
          iconSrc={LOGIN_FIELD_ASSETS.iconMail}
          autoComplete="email"
          disabled={disabled}
          hasError={Boolean(fieldErrors.email)}
          onChange={onEmailChange}
        />
        <LoginFormField
          id="password"
          label={labels.password}
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder={labels.passwordPlaceholder}
          iconSrc={LOGIN_FIELD_ASSETS.iconLock}
          autoComplete="current-password"
          disabled={disabled}
          hasError={Boolean(fieldErrors.password)}
          onChange={onPasswordChange}
          trailing={
            <button
              type="button"
              onClick={onTogglePassword}
              disabled={disabled}
              className="shrink-0 hover:opacity-70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={showPassword ? labels.hidePassword : labels.showPassword}
            >
              {showPassword ? (
                <Eye size={iconSize} strokeWidth={1.75} className="text-[#232323]" />
              ) : (
                <Image
                  src={LOGIN_FIELD_ASSETS.iconEyeOff}
                  alt=""
                  width={iconSize}
                  height={iconSize}
                  unoptimized
                  aria-hidden
                />
              )}
            </button>
          }
        />
      </div>

      <div className="flex w-full flex-col" style={{ gap: LOGIN_ACTIONS_TOP_GAP_PX }}>
        <button
          type="submit"
          disabled={disabled}
          className={`${CLAY_PRIMARY_BUTTON_CLASS} w-full border-0 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50`}
          style={{
            height: LOGIN_SUBMIT_HEIGHT_PX,
            fontSize: LOGIN_SUBMIT_FONT_SIZE_PX,
            lineHeight: `${LOGIN_SUBMIT_LINE_HEIGHT_PX}px`,
            backgroundColor: LOGIN_SUBMIT_BG,
            boxShadow: LOGIN_SUBMIT_INSET_SHADOW,
          }}
        >
          {disabled ? labels.submitting : labels.submit}
        </button>

        <div
          className="flex w-full flex-wrap items-center justify-between gap-y-2"
          style={{ gap: LOGIN_ACTIONS_GAP_PX }}
        >
          <label
            className="flex items-center"
            style={{ gap: LOGIN_CHECKBOX_GAP_PX, color: LOGIN_MUTED_TEXT_COLOR }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => onRememberMeChange(event.target.checked)}
              disabled={disabled}
              autoComplete="off"
              suppressHydrationWarning
              className="rounded border-[#ededed] text-brand-pink focus:ring-brand-pink/35"
              style={{ width: LOGIN_CHECKBOX_SIZE_PX, height: LOGIN_CHECKBOX_SIZE_PX }}
            />
            <span className="font-medium" style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX }}>
              {labels.rememberMe}
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="font-medium underline decoration-solid underline-offset-2"
            style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX, color: LOGIN_MUTED_TEXT_COLOR }}
          >
            {labels.forgotPassword}
          </Link>
        </div>
      </div>

      <p className="text-center" style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX, color: LOGIN_FOOTER_TEXT_COLOR }}>
        {labels.noAccount}{' '}
        <Link
          href="/register"
          className="font-semibold underline decoration-solid underline-offset-2"
          style={{ color: LOGIN_SIGNUP_LINK_COLOR }}
        >
          {labels.signUp}
        </Link>
      </p>
    </form>
  );
}
