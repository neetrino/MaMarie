'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  CONTACT_FORM_CARD_BG,
  CONTACT_FORM_CARD_PADDING_TOP_PX,
  CONTACT_FORM_CARD_PADDING_X_PX,
  CONTACT_FORM_CARD_PADDING_Y_PX,
  CONTACT_FORM_CARD_RADIUS_PX,
  CONTACT_FORM_FIELD_GAP_PX,
  CONTACT_FORM_INPUT_CLASS,
  CONTACT_FORM_INPUT_FONT_SIZE_PX,
  CONTACT_FORM_INPUT_HEIGHT_PX,
  CONTACT_FORM_INPUT_RADIUS_PX,
  CONTACT_FORM_INPUT_BORDER_COLOR,
  CONTACT_FORM_LABEL_COLOR,
  CONTACT_FORM_LABEL_FONT_SIZE_PX,
  CONTACT_FORM_LABEL_LINE_HEIGHT_PX,
  CONTACT_FORM_LABEL_TO_INPUT_GAP_PX,
  CONTACT_FORM_SUBMIT_BG,
  CONTACT_FORM_SUBMIT_FONT_SIZE_PX,
  CONTACT_FORM_SUBMIT_HEIGHT_PX,
  CONTACT_FORM_SUBMIT_MARGIN_TOP_PX,
} from '../../constants/contact-form';
import { ContactFormMessageField } from './ContactFormMessageField';
import { ContactFormStrawberry } from './ContactFormStrawberry';
import { useTranslation } from '../../lib/i18n-client';
import { apiClient } from '../../lib/api-client';
import { useAuth } from '../../lib/auth/AuthContext';
import { logger } from '../../lib/utils/logger';
import { showToast } from '../Toast';

interface ContactFormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactFormFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function buildDisplayName(firstName?: string | null, lastName?: string | null): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

interface ContactFormFieldProps {
  id: keyof ContactFormFields;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email';
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function ContactFormField({
  id,
  label,
  value,
  placeholder,
  required = false,
  type = 'text',
  onChange,
}: ContactFormFieldProps) {
  const sharedStyle = {
    borderRadius: CONTACT_FORM_INPUT_RADIUS_PX,
    borderColor: CONTACT_FORM_INPUT_BORDER_COLOR,
    fontSize: CONTACT_FORM_INPUT_FONT_SIZE_PX,
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
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={CONTACT_FORM_INPUT_CLASS}
        style={{
          ...sharedStyle,
          height: CONTACT_FORM_INPUT_HEIGHT_PX,
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

/** Figma contact form — white card, stacked fields, pink pill submit, strawberry decoration. */
export function ContactForm() {
  const { t } = useTranslation();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [formData, setFormData] = useState<ContactFormFields>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading || !isLoggedIn) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const profile = await apiClient.get<{
          firstName?: string;
          lastName?: string;
          email?: string;
        }>('/api/v1/users/profile');

        if (cancelled) {
          return;
        }

        const name = buildDisplayName(profile.firstName, profile.lastName);
        setFormData((current) => ({
          ...current,
          name: current.name || name,
          email: current.email || profile.email || '',
        }));
      } catch {
        if (cancelled || !user) {
          return;
        }

        const name = buildDisplayName(user.firstName, user.lastName);
        setFormData((current) => ({
          ...current,
          name: current.name || name,
          email: current.email || user.email || '',
        }));
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isLoading, user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(
        '/api/v1/contact',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { skipAuth: true },
      );

      setFormData(EMPTY_FORM);
      showToast(t('contact.form.submitSuccess') || 'Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Չհաջողվեց ուղարկել հաղորդագրությունը';
      logger.error('Error submitting contact form', { error });
      showToast(t('contact.form.submitError') || `Սխալ: ${errorMessage}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-visible">
      <ContactFormStrawberry />

      <form
        onSubmit={handleSubmit}
        className="relative z-0 flex h-full w-full flex-col"
        style={{
          backgroundColor: CONTACT_FORM_CARD_BG,
          borderRadius: CONTACT_FORM_CARD_RADIUS_PX,
          paddingTop: CONTACT_FORM_CARD_PADDING_TOP_PX,
          paddingBottom: CONTACT_FORM_CARD_PADDING_Y_PX,
          paddingLeft: CONTACT_FORM_CARD_PADDING_X_PX,
          paddingRight: CONTACT_FORM_CARD_PADDING_X_PX,
          gap: CONTACT_FORM_FIELD_GAP_PX,
        }}
      >
        <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2 xl:grid-cols-1">
          <ContactFormField
            id="name"
            label={t('contact.form.name')}
            placeholder={t('contact.form.namePlaceholder')}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <ContactFormField
            id="email"
            label={t('contact.form.email')}
            placeholder={t('contact.form.emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>
        <ContactFormField
          id="subject"
          label={t('contact.form.subject')}
          placeholder={t('contact.form.subjectPlaceholder')}
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <ContactFormMessageField
          id="message"
          label={t('contact.form.message')}
          placeholder={t('contact.form.messagePlaceholder')}
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
          style={{
            marginTop: CONTACT_FORM_SUBMIT_MARGIN_TOP_PX - CONTACT_FORM_FIELD_GAP_PX,
            height: CONTACT_FORM_SUBMIT_HEIGHT_PX,
            borderRadius: 9999,
            backgroundColor: CONTACT_FORM_SUBMIT_BG,
            fontSize: CONTACT_FORM_SUBMIT_FONT_SIZE_PX,
          }}
        >
          {submitting ? t('contact.form.submitting') || 'Ուղարկվում է...' : t('contact.form.submit')}
        </button>
      </form>
    </div>
  );
}
