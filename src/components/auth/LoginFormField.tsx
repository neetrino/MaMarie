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
  LOGIN_INPUT_RADIUS_PX,
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
  const handleEnterToNextField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const form = event.currentTarget.form;
    if (!form) {
      return;
    }

    const currentField = event.currentTarget;
    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="password"]',
      ),
    ).filter((field) => !field.disabled && field.offsetParent !== null);

    const currentIndex = fields.indexOf(currentField);
    const nextField = currentIndex >= 0 ? fields[currentIndex + 1] : null;

    if (nextField) {
      event.preventDefault();
      nextField.focus();
    }
  };

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
        className="flex w-full items-center overflow-hidden rounded-[36px] lg:rounded-[36px]"
        style={{
          gap: iconSrc ? LOGIN_INPUT_ICON_GAP_PX : 0,
          minHeight: LOGIN_INPUT_HEIGHT_PX,
          paddingLeft: LOGIN_INPUT_PADDING_X_PX,
          paddingRight: LOGIN_INPUT_PADDING_X_PX,
          paddingTop: LOGIN_INPUT_PADDING_Y_PX,
          paddingBottom: LOGIN_INPUT_PADDING_Y_PX,
          borderRadius: LOGIN_INPUT_RADIUS_PX,
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
          onKeyDown={handleEnterToNextField}
          className={LOGIN_INPUT_FIELD_CLASS}
          style={{
            lineHeight: 1.5,
            color: LOGIN_INPUT_TEXT_COLOR,
            letterSpacing: '-0.24px',
            outline: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
          }}
        />
        {trailing ? (
          <div className="relative -left-0.5 ml-2 flex h-full shrink-0 items-center self-center">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}
