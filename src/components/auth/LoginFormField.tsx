import type { ChangeEvent, ReactNode } from 'react';
import {
  LOGIN_INPUT_BG,
  LOGIN_INPUT_BORDER_COLOR,
  LOGIN_INPUT_BORDER_WIDTH_PX,
  LOGIN_INPUT_FIELD_CLASS,
  LOGIN_INPUT_HEIGHT_PX,
  LOGIN_INPUT_ICON_GAP_PX,
  LOGIN_INPUT_PADDING_X_PX,
  LOGIN_INPUT_PADDING_Y_PX,
  LOGIN_INPUT_SHELL_RADIUS_CLASS,
  LOGIN_INPUT_TEXT_COLOR,
  LOGIN_LABEL_COLOR,
  LOGIN_LABEL_FONT_SIZE_PX,
  LOGIN_LABEL_TO_INPUT_GAP_PX,
} from '../../constants/login-page';
import { AuthFieldIcon } from './AuthFieldIcon';

interface LoginFormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  iconSrc?: string;
  required?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  autoComplete?: string;
  trailing?: ReactNode;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function LoginFormFieldIcon({ src }: { src: string }) {
  return <AuthFieldIcon src={src} />;
}

/** Figma `222:548` / `222:553` — labeled pill input with leading icon. */
export function LoginFormField({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  iconSrc,
  required = false,
  disabled = false,
  hasError = false,
  autoComplete,
  trailing,
  onChange,
}: LoginFormFieldProps) {
  return (
    <div className="flex w-full flex-col" style={{ gap: LOGIN_LABEL_TO_INPUT_GAP_PX }}>
      <label
        htmlFor={id}
        className="font-medium"
        style={{
          fontSize: LOGIN_LABEL_FONT_SIZE_PX,
          lineHeight: 1.5,
          color: LOGIN_LABEL_COLOR,
          letterSpacing: '-0.24px',
        }}
      >
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      <div
        className={`flex w-full items-center overflow-hidden ${LOGIN_INPUT_SHELL_RADIUS_CLASS}`}
        style={{
          gap: iconSrc ? LOGIN_INPUT_ICON_GAP_PX : 0,
          minHeight: LOGIN_INPUT_HEIGHT_PX,
          paddingLeft: LOGIN_INPUT_PADDING_X_PX,
          paddingRight: LOGIN_INPUT_PADDING_X_PX,
          paddingTop: LOGIN_INPUT_PADDING_Y_PX,
          paddingBottom: LOGIN_INPUT_PADDING_Y_PX,
          borderWidth: LOGIN_INPUT_BORDER_WIDTH_PX,
          borderStyle: 'solid',
          borderColor: hasError ? '#ef4444' : LOGIN_INPUT_BORDER_COLOR,
          backgroundColor: LOGIN_INPUT_BG,
        }}
      >
        {iconSrc ? <LoginFormFieldIcon src={iconSrc} /> : null}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          autoCapitalize={type === 'email' ? 'none' : undefined}
          autoCorrect={type === 'email' ? 'off' : undefined}
          spellCheck={type === 'email' ? false : undefined}
          suppressHydrationWarning
          onChange={onChange}
          className={LOGIN_INPUT_FIELD_CLASS}
          style={{
            lineHeight: 1.5,
            color: LOGIN_INPUT_TEXT_COLOR,
            letterSpacing: '-0.24px',
          }}
        />
        {trailing}
      </div>
    </div>
  );
}
