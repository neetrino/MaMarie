'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { formatPrice } from '../../../lib/currency';
import { t } from '../../../lib/i18n';
import type { ProductPageSnapshot } from '../../../lib/product-page-snapshot';
import { sanitizeHtml } from '../../../lib/utils/sanitize';
import { ProductRatingSummary } from './ProductRatingSummary';
import { ProductPageSnapshotAttributes } from './ProductPageSnapshotAttributes';
import {
  PRODUCT_PDP_QUANTITY_STEPPER_BUTTON_CLASS,
  PRODUCT_PDP_QUANTITY_STEPPER_CLASS,
  PRODUCT_PDP_QUANTITY_STEPPER_VALUE_CLASS,
} from './constants';

interface ProductPageSnapshotInfoProps {
  snapshot: ProductPageSnapshot;
}

function ProductPageSnapshotQuantityStepper() {
  return (
    <div className={PRODUCT_PDP_QUANTITY_STEPPER_CLASS}>
      <button type="button" disabled className={PRODUCT_PDP_QUANTITY_STEPPER_BUTTON_CLASS}>
        -
      </button>
      <div className={PRODUCT_PDP_QUANTITY_STEPPER_VALUE_CLASS}>1</div>
      <button type="button" disabled className={PRODUCT_PDP_QUANTITY_STEPPER_BUTTON_CLASS}>
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

        <div className="mb-6 flex items-start justify-between gap-4">
          <h1 className="min-w-0 flex-1 text-4xl font-bold text-gray-900">{snapshot.title}</h1>
          <ProductRatingSummary
            averageRating={snapshot.averageRating ?? 0}
            reviewsCount={snapshot.reviewsCount ?? 0}
            onReviewsClick={() => {}}
            language={language}
            className="mb-0 shrink-0 justify-end pointer-events-none"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
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
            <div className="shrink-0 lg:hidden">
              <ProductPageSnapshotQuantityStepper />
            </div>
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

      <div className="mt-auto lg:pt-0 pt-6">
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="hidden shrink-0 lg:block">
            <ProductPageSnapshotQuantityStepper />
          </div>
          <button
            type="button"
            disabled
            className="flex-1 h-12 bg-brand-cart text-gray-900 rounded-full uppercase font-bold disabled:cursor-default"
          >
            {actionLabel}
          </button>
          <button
            type="button"
            disabled
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200"
            aria-hidden
          >
            <Heart />
          </button>
        </div>
      </div>
    </div>
  );
}
