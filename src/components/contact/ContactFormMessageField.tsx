'use client';

import { useLayoutEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import {
  CONTACT_FORM_INPUT_CLASS,
  CONTACT_FORM_INPUT_FONT_SIZE_PX,
  CONTACT_FORM_INPUT_HEIGHT_PX,
  CONTACT_FORM_INPUT_LINE_HEIGHT_PX,
  CONTACT_FORM_INPUT_RADIUS_PX,
  CONTACT_FORM_INPUT_VERTICAL_PADDING_PX,
  CONTACT_FORM_INPUT_BORDER_COLOR,
  CONTACT_FORM_LABEL_COLOR,
  CONTACT_FORM_LABEL_FONT_SIZE_PX,
  CONTACT_FORM_LABEL_LINE_HEIGHT_PX,
  CONTACT_FORM_LABEL_TO_INPUT_GAP_PX,
} from '../../constants/contact-form';

interface ContactFormMessageFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function syncTextareaHeight(textarea: HTMLTextAreaElement): void {
  textarea.style.height = `${CONTACT_FORM_INPUT_HEIGHT_PX}px`;
  textarea.style.height = `${Math.max(CONTACT_FORM_INPUT_HEIGHT_PX, textarea.scrollHeight)}px`;
}

/** Message field — starts as a single-line input, grows row-by-row on wrap. */
export function ContactFormMessageField({
  id,
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: ContactFormMessageFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    syncTextareaHeight(textarea);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    syncTextareaHeight(event.currentTarget);
    onChange(event);
  };

  return (
    <div
      className="flex flex-col"
      style={{ gap: CONTACT_FORM_LABEL_TO_INPUT_GAP_PX }}
    >
      <label
        htmlFor={id}
        className="font-semibold"
        style={{
          fontSize: CONTACT_FORM_LABEL_FONT_SIZE_PX,
          lineHeight: `${CONTACT_FORM_LABEL_LINE_HEIGHT_PX}px`,
          color: CONTACT_FORM_LABEL_COLOR,
        }}
      >
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        rows={1}
        required={required}
        value={value}
        onChange={handleChange}
        className={`${CONTACT_FORM_INPUT_CLASS} resize-none overflow-hidden`}
        style={{
          minHeight: CONTACT_FORM_INPUT_HEIGHT_PX,
          height: CONTACT_FORM_INPUT_HEIGHT_PX,
          borderRadius: CONTACT_FORM_INPUT_RADIUS_PX,
          borderColor: CONTACT_FORM_INPUT_BORDER_COLOR,
          fontSize: CONTACT_FORM_INPUT_FONT_SIZE_PX,
          lineHeight: `${CONTACT_FORM_INPUT_LINE_HEIGHT_PX}px`,
          paddingTop: CONTACT_FORM_INPUT_VERTICAL_PADDING_PX,
          paddingBottom: CONTACT_FORM_INPUT_VERTICAL_PADDING_PX,
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
