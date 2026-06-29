'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import {
  HERO_GENDER_BUTTON_BOYS_BG_COLOR,
  HERO_GENDER_BUTTON_FONT_SIZE_PX,
  HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
  HERO_GENDER_BUTTON_GIRLS_WIDTH_PX,
  HERO_GENDER_BUTTON_HEIGHT_PX,
  HERO_GENDER_BUTTON_INSET_SHADOW,
  HERO_GENDER_BUTTON_LINE_HEIGHT_PX,
  HERO_GENDER_BUTTON_PADDING_X_PX,
  HERO_GENDER_BUTTONS_GAP_PX,
} from '../../constants/hero';

const genderButtonClassName =
  'relative flex items-center justify-center rounded-full font-bold text-white transition-opacity hover:opacity-90';

interface GenderButtonProps {
  href: string;
  label: string;
  backgroundColor: string;
  widthPx?: number;
}

function GenderButton({ href, label, backgroundColor, widthPx }: GenderButtonProps) {
  return (
    <Link
      href={href}
      className={genderButtonClassName}
      style={{
        height: HERO_GENDER_BUTTON_HEIGHT_PX,
        width: widthPx,
        paddingLeft: HERO_GENDER_BUTTON_PADDING_X_PX,
        paddingRight: HERO_GENDER_BUTTON_PADDING_X_PX,
        backgroundColor,
        fontSize: HERO_GENDER_BUTTON_FONT_SIZE_PX,
        lineHeight: `${HERO_GENDER_BUTTON_LINE_HEIGHT_PX}px`,
        boxShadow: HERO_GENDER_BUTTON_INSET_SHADOW,
      }}
    >
      {label}
    </Link>
  );
}

/** Figma nodes `51:338`–`51:342` — girls / boys shop CTAs. */
export function HeroGenderButtons() {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-wrap items-center justify-center"
      style={{ gap: HERO_GENDER_BUTTONS_GAP_PX }}
      role="group"
      aria-label={t('home.hero.genderButtons.label')}
    >
      <GenderButton
        href="/products"
        label={t('home.hero.genderButtons.girls')}
        backgroundColor={HERO_GENDER_BUTTON_GIRLS_BG_COLOR}
        widthPx={HERO_GENDER_BUTTON_GIRLS_WIDTH_PX}
      />
      <GenderButton
        href="/products"
        label={t('home.hero.genderButtons.boys')}
        backgroundColor={HERO_GENDER_BUTTON_BOYS_BG_COLOR}
      />
    </div>
  );
}
