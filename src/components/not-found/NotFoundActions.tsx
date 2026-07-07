'use client';

import Image from 'next/image';
import { StorefrontCatalogLink } from '../storefront/StorefrontCatalogLink';
import {
  NOT_FOUND_ACTIONS_GAP_PX,
  NOT_FOUND_ASSETS,
  NOT_FOUND_BUTTON_ICON_GAP_PX,
  NOT_FOUND_BUTTON_ICON_SIZE_PX,
  NOT_FOUND_HOME_BUTTON_BG,
  NOT_FOUND_SHOP_BUTTON_BG,
} from '../../constants/not-found-page';
import {
  CLAY_PRIMARY_BUTTON_CLASS,
  getClayPrimaryButtonStyle,
} from '../../constants/clay-primary-button';
import { useTranslation } from '../../lib/i18n-client';

interface NotFoundActionButtonProps {
  href: string;
  label: string;
  backgroundColor: string;
  iconSrc?: string;
}

function NotFoundActionButton({
  href,
  label,
  backgroundColor,
  iconSrc,
}: NotFoundActionButtonProps) {
  return (
    <StorefrontCatalogLink
      href={href}
      className={`${CLAY_PRIMARY_BUTTON_CLASS} inline-flex w-auto max-w-full whitespace-nowrap`}
      style={{
        ...getClayPrimaryButtonStyle(backgroundColor),
        gap: iconSrc ? NOT_FOUND_BUTTON_ICON_GAP_PX : undefined,
      }}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          width={NOT_FOUND_BUTTON_ICON_SIZE_PX}
          height={NOT_FOUND_BUTTON_ICON_SIZE_PX}
          aria-hidden
          className="shrink-0 brightness-0 invert"
        />
      ) : null}
      <span>{label}</span>
    </StorefrontCatalogLink>
  );
}

/** Figma 404 — homepage and continue-shopping clay CTAs. */
export function NotFoundActions() {
  const { t } = useTranslation();

  return (
    <div
      className="flex w-full flex-col-reverse items-center justify-center lg:flex-row"
      style={{ gap: NOT_FOUND_ACTIONS_GAP_PX }}
    >
      <NotFoundActionButton
        href="/"
        label={t('common.notFound.goHome')}
        backgroundColor={NOT_FOUND_HOME_BUTTON_BG}
      />
      <NotFoundActionButton
        href="/products"
        label={t('common.notFound.continueShopping')}
        backgroundColor={NOT_FOUND_SHOP_BUTTON_BG}
        iconSrc={NOT_FOUND_ASSETS.iconCart}
      />
    </div>
  );
}
