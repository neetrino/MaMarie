'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import {
  CLAY_PRIMARY_BUTTON_CLASS,
  getClayPrimaryButtonCompactStyle,
} from '../../../constants/clay-primary-button';
import {
  HERO_GENDER_BUTTON_BOYS_BG_COLOR,
  HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
} from '../../../constants/hero';
import { HOME_PRODUCT_CARD_CART_BG } from '../../../constants/home-sections';
import { formatPrice } from '../../../lib/currency';
import { t } from '../../../lib/i18n';
import type { ProductPageSnapshot } from '../../../lib/product-page-snapshot';
import { sanitizeHtml } from '../../../lib/utils/sanitize';
import {
  PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
  PRODUCT_PDP_ACTIONS_ROW_CLASS,
  PRODUCT_PDP_ACTIONS_TOP_ROW_CLASS,
  PRODUCT_PDP_ADD_TO_CART_BUTTON_CLASS,
  PRODUCT_PDP_SIZE_GUIDE_ACTION_CLASS,
  PRODUCT_QUANTITY_STEPPER_SHELL_CLASS,
  PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS,
  PRODUCT_QUANTITY_STEPPER_VALUE_CLASS,
} from './constants';
import { ProductPageSnapshotAttributes } from './ProductPageSnapshotAttributes';
import { ProductRatingSummary } from './ProductRatingSummary';

interface ProductPageSnapshotInfoProps {
  snapshot: ProductPageSnapshot;
}

function ProductPageSnapshotQuantityStepper() {
  return (
    <div
      className={`${CLAY_PRIMARY_BUTTON_CLASS} ${PRODUCT_QUANTITY_STEPPER_SHELL_CLASS}`}
      style={{
        ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_GIRLS_BG_COLOR),
        paddingLeft: 0,
        paddingRight: 0,
        height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
      }}
    >
      <button
        type="button"
        disabled
        className={`${PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS} disabled:opacity-50`}
      >
        -
      </button>
      <div className={PRODUCT_QUANTITY_STEPPER_VALUE_CLASS}>1</div>
      <button
        type="button"
        disabled
        className={`${PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS} disabled:opacity-50`}
      >
        +
      </button>
    </div>
  );
}

export function ProductPageSnapshotInfo({ snapshot }: ProductPageSnapshotInfoProps) {
  const { language, currency } = snapshot;
  const showRegularPrice = Boolean(
    (snapshot.originalPrice && snapshot.originalPrice > snapshot.price)
      || (snapshot.compareAtPrice && snapshot.compareAtPrice > snapshot.price),
  );
  const regularPriceValue = snapshot.originalPrice && snapshot.originalPrice > snapshot.price
    ? snapshot.originalPrice
    : snapshot.compareAtPrice ?? 0;
  const description = snapshot.description ?? (
    snapshot.subtitle && snapshot.subtitle !== snapshot.title ? snapshot.subtitle : ''
  );
  const needsColor = Boolean(snapshot.colors && snapshot.colors.length > 0);
  const needsSize = Boolean(snapshot.sizes && snapshot.sizes.length > 0);
  const isVariationRequired = needsColor || needsSize;
  const requiredAttributesMessage = needsColor && needsSize
    ? t(language, 'product.selectColorAndSize')
    : needsColor
      ? t(language, 'product.selectColor')
      : needsSize
        ? t(language, 'product.selectSize')
        : t(language, 'product.selectOptions');
  const actionLabel = snapshot.inStock === false
    ? t(language, 'product.outOfStock')
    : isVariationRequired
      ? requiredAttributesMessage
      : t(language, 'product.addToCart');

  return (
    <div className="flex h-full min-h-0 flex-col" aria-busy="true" aria-label="Product details loading">
      <div className="flex-1">
        {snapshot.brandName ? (
          <div className="mb-2 flex items-center gap-2">
            {snapshot.brandLogoUrl ? (
              <div className="relative h-5 w-5 overflow-hidden rounded-full border border-gray-200">
                <Image
                  src={snapshot.brandLogoUrl}
                  alt={snapshot.brandName}
                  fill
                  className="object-cover"
                  sizes="20px"
                  unoptimized
                />
              </div>
            ) : null}
            <p className="text-sm text-gray-500">{snapshot.brandName}</p>
          </div>
        ) : null}

        <div className="mb-6">
          <h1 className="min-w-0 text-4xl font-bold text-gray-900">{snapshot.title}</h1>
        </div>

        <div className="mb-6 w-full">
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(snapshot.price, currency)}
              </p>
              {showRegularPrice ? (
                <p className="text-xl text-gray-500 line-through decoration-gray-400">
                  {formatPrice(regularPriceValue, currency)}
                </p>
              ) : null}
              {snapshot.discountPercent && snapshot.discountPercent > 0 ? (
                <span className="text-lg font-semibold text-blue-600">
                  -{snapshot.discountPercent}%
                </span>
              ) : null}
            </div>
            <ProductRatingSummary
              averageRating={snapshot.averageRating ?? 0}
              reviewsCount={snapshot.reviewsCount ?? 0}
              onReviewsClick={() => {}}
              language={language}
              className="mb-0 shrink-0 justify-self-end pointer-events-none"
            />
          </div>
        </div>

        <div
          className="text-gray-600 mb-8 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />

        <div className="mb-8">
          <ProductPageSnapshotAttributes
            colors={snapshot.colors}
            sizes={snapshot.sizes}
            language={language}
          />
        </div>
      </div>

      <div className="mt-auto pt-6 lg:pt-0">
        <div className={`${PRODUCT_PDP_ACTIONS_ROW_CLASS} pointer-events-none`}>
          <div className={PRODUCT_PDP_ACTIONS_TOP_ROW_CLASS}>
            <ProductPageSnapshotQuantityStepper />
            {snapshot.sizes && snapshot.sizes.length > 0 ? (
              <button
                type="button"
                disabled
                className={`${CLAY_PRIMARY_BUTTON_CLASS} ${PRODUCT_PDP_SIZE_GUIDE_ACTION_CLASS}`}
                style={{
                  ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_BOYS_BG_COLOR),
                  height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
                }}
              >
                {t(language, 'product.sizeGuide.open')}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            disabled
            className={`${CLAY_PRIMARY_BUTTON_CLASS} ${PRODUCT_PDP_ADD_TO_CART_BUTTON_CLASS} !text-gray-900`}
            style={{
              ...getClayPrimaryButtonCompactStyle(HOME_PRODUCT_CARD_CART_BG),
              height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
            }}
          >
            {actionLabel}
          </button>
          <button
            type="button"
            disabled
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 lg:flex"
            aria-hidden
          >
            <Heart />
          </button>
        </div>
      </div>
    </div>
  );
}
