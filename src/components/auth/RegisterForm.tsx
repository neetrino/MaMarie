import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import {
  LOGIN_CHECKBOX_GAP_PX,
  LOGIN_CHECKBOX_SIZE_PX,
  LOGIN_ERROR_CLASS,
  LOGIN_FIELD_ASSETS,
  LOGIN_FIELDS_GAP_PX,
  LOGIN_FOOTER_TEXT_COLOR,
  LOGIN_FORM_GAP_PX,
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

interface RegisterFormLabels {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: string;
  termsOfService: string;
  and: string;
  privacyPolicy: string;
  submit: string;
  submitting: string;
  alreadyHaveAccount: string;
  signIn: string;
  showPassword: string;
  hidePassword: string;
  passwordHint: string;
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
}

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  acceptTerms: boolean;
  error: string | null;
  fieldErrors: AuthFieldErrors;
  isSubmitting: boolean;
  isLoading: boolean;
  labels: RegisterFormLabels;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFirstNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAcceptTermsChange: (checked: boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

function PasswordToggleButton({
  visible,
  disabled,
  showLabel,
  hideLabel,
  onToggle,
}: {
  visible: boolean;
  disabled: boolean;
  showLabel: string;
  hideLabel: string;
  onToggle: () => void;
}): ReactNode {
  const iconSize = LOGIN_INPUT_ICON_SIZE_PX;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="shrink-0 hover:opacity-70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={visible ? hideLabel : showLabel}
    >
      {visible ? (
        <Eye size={iconSize} strokeWidth={1.75} className="text-[#232323]" />
      ) : (
        <Image
          src={LOGIN_FIELD_ASSETS.iconEyeOff}
          alt=""
          width={iconSize}
          height={iconSize}
          aria-hidden
        />
      )}
    </button>
  );
}

/** Register form — same clay card styling as login (`222:546`). */
export function RegisterForm({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  acceptTerms,
  error,
  fieldErrors,
  isSubmitting,
  isLoading,
  labels,
  onSubmit,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAcceptTermsChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: RegisterFormProps) {
  const disabled = isSubmitting || isLoading;
  const gridGapStyle = { gap: LOGIN_FIELDS_GAP_PX };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col" style={{ gap: LOGIN_FORM_GAP_PX }}>
      {error ? (
        <div className={LOGIN_ERROR_CLASS} role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2" style={gridGapStyle}>
        <LoginFormField
          id="firstName"
          label={labels.firstName}
          value={firstName}
          placeholder={labels.placeholders.firstName}
          required
          disabled={disabled}
          hasError={Boolean(fieldErrors.firstName)}
          onChange={onFirstNameChange}
        />
        <LoginFormField
          id="lastName"
          label={labels.lastName}
          value={lastName}
          placeholder={labels.placeholders.lastName}
          required
          disabled={disabled}
          hasError={Boolean(fieldErrors.lastName)}
          onChange={onLastNameChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={gridGapStyle}>
        <LoginFormField
          id="email"
          label={labels.email}
          type="email"
          value={email}
          placeholder={labels.placeholders.email}
          iconSrc={LOGIN_FIELD_ASSETS.iconMail}
          required
          disabled={disabled}
          hasError={Boolean(fieldErrors.email)}
          onChange={onEmailChange}
        />
        <LoginFormField
          id="phone"
          label={labels.phone}
          type="tel"
          value={phone}
          placeholder={labels.placeholders.phone}
          disabled={disabled}
          hasError={Boolean(fieldErrors.phone)}
          onChange={onPhoneChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={gridGapStyle}>
        <div className="flex flex-col" style={gridGapStyle}>
          <LoginFormField
            id="password"
            label={labels.password}
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder={labels.placeholders.password}
            iconSrc={LOGIN_FIELD_ASSETS.iconLock}
            required
            disabled={disabled}
            hasError={Boolean(fieldErrors.password)}
            onChange={onPasswordChange}
            trailing={
              <PasswordToggleButton
                visible={showPassword}
                disabled={disabled}
                showLabel={labels.showPassword}
                hideLabel={labels.hidePassword}
                onToggle={onTogglePassword}
              />
            }
          />
          <p style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX, color: LOGIN_MUTED_TEXT_COLOR }}>
            {labels.passwordHint}
          </p>
        </div>
        <LoginFormField
          id="confirmPassword"
          label={labels.confirmPassword}
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          placeholder={labels.placeholders.confirmPassword}
          iconSrc={LOGIN_FIELD_ASSETS.iconLock}
          required
          disabled={disabled}
          hasError={Boolean(fieldErrors.confirmPassword)}
          onChange={onConfirmPasswordChange}
          trailing={
            <PasswordToggleButton
              visible={showConfirmPassword}
              disabled={disabled}
              showLabel={labels.showPassword}
              hideLabel={labels.hidePassword}
              onToggle={onToggleConfirmPassword}
            />
          }
        />
      </div>

      <label
        className="flex items-start"
        style={{ gap: LOGIN_CHECKBOX_GAP_PX, color: LOGIN_MUTED_TEXT_COLOR }}
      >
        <input
          id="terms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(event) => onAcceptTermsChange(event.target.checked)}
          disabled={disabled}
          className="mt-0.5 rounded border-[#ededed] text-brand-pink focus:ring-brand-pink/35"
          style={{ width: LOGIN_CHECKBOX_SIZE_PX, height: LOGIN_CHECKBOX_SIZE_PX }}
        />
        <span style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX }}>
          {labels.acceptTerms}{' '}
          <Link href="/terms" className="underline" style={{ color: LOGIN_SIGNUP_LINK_COLOR }}>
            {labels.termsOfService}
          </Link>{' '}
          {labels.and}{' '}
          <Link href="/privacy" className="underline" style={{ color: LOGIN_SIGNUP_LINK_COLOR }}>
            {labels.privacyPolicy}
          </Link>
        </span>
      </label>
      {fieldErrors.terms ? (
        <p className="text-sm text-red-600" role="alert">
          {fieldErrors.terms}
        </p>
      ) : null}

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

      <p className="text-center" style={{ fontSize: LOGIN_SECONDARY_TEXT_FONT_SIZE_PX, color: LOGIN_FOOTER_TEXT_COLOR }}>
        {labels.alreadyHaveAccount}{' '}
        <Link
          href="/login"
          className="font-semibold underline decoration-solid underline-offset-2"
          style={{ color: LOGIN_SIGNUP_LINK_COLOR }}
        >
          {labels.signIn}
        </Link>
      </p>
    </form>
  );
}
