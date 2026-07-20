'use client';

import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { SizeGuideSideSheet } from '../../../components/size-guide/SizeGuideSideSheet';
import {
  CLAY_PRIMARY_BUTTON_CLASS,
  getClayPrimaryButtonCompactStyle,
} from '../../../constants/clay-primary-button';
import {
  HERO_GENDER_BUTTON_BOYS_BG_COLOR,
  HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
} from '../../../constants/hero';
import { MOBILE_PRODUCTS_CATALOG_CARD_ASSETS } from '../../../constants/mobile-products-catalog';
import { formatPrice, type CurrencyCode } from '../../../lib/currency';
import { t, getProductText } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import { sanitizeHtml } from '../../../lib/utils/sanitize';
import {
  PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
  PRODUCT_QUANTITY_STEPPER_HEIGHT_PX,
  PRODUCT_QUANTITY_STEPPER_SHELL_CLASS,
  PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS,
  PRODUCT_QUANTITY_STEPPER_VALUE_CLASS,
} from './constants';
import { ProductAttributesSelector } from './ProductAttributesSelector';
import { ProductRatingSummary } from './ProductRatingSummary';
import type { Product, ProductVariant } from './types';

interface ProductInfoAndActionsProps {
  product: Product;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  currency: string;
  language: LanguageCode;
  averageRating: number;
  reviewsCount: number;
  quantity: number;
  maxQuantity: number;
  isOutOfStock: boolean;
  isVariationRequired: boolean;
  hasUnavailableAttributes: boolean;
  unavailableAttributes: Map<string, boolean>;
  canAddToCart: boolean;
  isAddingToCart: boolean;
  isInWishlist: boolean;
  showMessage: string | null;
  isLoggedIn: boolean;
  currentVariant: ProductVariant | null;
  attributeGroups: Map<string, any[]>;
  selectedColor: string | null;
  selectedSize: string | null;
  selectedAttributeValues: Map<string, string>;
  colorGroups: Array<{ color: string; stock: number; variants: ProductVariant[] }>;
  sizeGroups: Array<{ size: string; stock: number; variants: ProductVariant[] }>;
  onQuantityAdjust: (delta: number) => void;
  onAddToCart: () => Promise<void>;
  onAddToWishlist: (e: MouseEvent) => void;
  onScrollToReviews: () => void;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  onAttributeValueSelect: (attrKey: string, value: string) => void;
  getOptionValue: (options: any[] | undefined, key: string) => string | null;
  getRequiredAttributesMessage: () => string;
}

interface ProductQuantityStepperProps {
  quantity: number;
  maxQuantity: number;
  onQuantityAdjust: (delta: number) => void;
}

function ProductQuantityStepper({
  quantity,
  maxQuantity,
  onQuantityAdjust,
}: ProductQuantityStepperProps) {
  return (
    <div
      className={`${CLAY_PRIMARY_BUTTON_CLASS} ${PRODUCT_QUANTITY_STEPPER_SHELL_CLASS}`}
      style={{
        ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_GIRLS_BG_COLOR),
        paddingLeft: 0,
        paddingRight: 0,
        height: PRODUCT_QUANTITY_STEPPER_HEIGHT_PX,
      }}
    >
      <button
        type="button"
        onClick={() => onQuantityAdjust(-1)}
        disabled={quantity <= 1}
        className={`${PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        -
      </button>
      <div className={PRODUCT_QUANTITY_STEPPER_VALUE_CLASS}>{quantity}</div>
      <button
        type="button"
        onClick={() => onQuantityAdjust(1)}
        disabled={quantity >= maxQuantity}
        className={`${PRODUCT_QUANTITY_STEPPER_SIDE_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        +
      </button>
    </div>
  );
}

export function ProductInfoAndActions({
  product,
  price,
  originalPrice,
  compareAtPrice,
  discountPercent,
  currency,
  language,
  averageRating,
  reviewsCount,
  quantity,
  maxQuantity,
  isOutOfStock,
  isVariationRequired,
  hasUnavailableAttributes,
  unavailableAttributes,
  canAddToCart,
  isAddingToCart,
  isInWishlist,
  showMessage,
  isLoggedIn,
  currentVariant,
  attributeGroups,
  selectedColor,
  selectedSize,
  selectedAttributeValues,
  colorGroups,
  sizeGroups,
  onQuantityAdjust,
  onAddToCart,
  onAddToWishlist,
  onScrollToReviews,
  onColorSelect,
  onSizeSelect,
  onAttributeValueSelect,
  getOptionValue,
  getRequiredAttributesMessage,
}: ProductInfoAndActionsProps) {
  const showRegularPrice = Boolean(
    originalPrice || (compareAtPrice && compareAtPrice > price),
  );
  const regularPriceValue = originalPrice || compareAtPrice || 0;
  const actionLabel = isAddingToCart
    ? t(language, 'product.adding')
    : isOutOfStock
      ? t(language, 'product.outOfStock')
      : isVariationRequired
        ? getRequiredAttributesMessage()
        : hasUnavailableAttributes
          ? t(language, 'product.outOfStock')
          : t(language, 'product.addToCart');
  const mobileFormattedActionLabel =
    isVariationRequired && actionLabel.includes(' և ')
      ? actionLabel.replace(' և ', '\nև ')
      : actionLabel;
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const showSizeGuide =
    sizeGroups.length > 0 ||
    (attributeGroups.get('size')?.length ?? 0) > 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1">
        {product.brand && (
          <div className="mb-2 flex items-center gap-2">
            {(product.brand.logo || product.brand.logoUrl) ? (
              <div className="relative h-5 w-5 overflow-hidden rounded-full border border-gray-200">
                <Image
                  src={product.brand.logo || product.brand.logoUrl || ''}
                  alt={product.brand.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                  unoptimized
                />
              </div>
            ) : null}
            <p className="text-sm text-gray-500">{product.brand.name}</p>
          </div>
        )}
        <div className="mb-4 flex items-start justify-between gap-4 lg:mb-6">
          <h1 className="min-w-0 flex-1 text-4xl font-bold text-gray-900">
            {getProductText(language, product.id, 'title') || product.title}
          </h1>
          <ProductRatingSummary
            averageRating={averageRating}
            reviewsCount={reviewsCount}
            onReviewsClick={onScrollToReviews}
            language={language}
            className="mb-0 shrink-0 justify-end"
          />
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-bold text-gray-900">{formatPrice(price, currency as CurrencyCode)}</p>
              {showRegularPrice && (
                <p className="text-xl text-gray-500 line-through decoration-gray-400">
                  {formatPrice(regularPriceValue, currency as CurrencyCode)}
                </p>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-lg font-semibold text-blue-600">
                  -{discountPercent}%
                </span>
              )}
            </div>
            <div className="shrink-0">
              <ProductQuantityStepper
                quantity={quantity}
                maxQuantity={maxQuantity}
                onQuantityAdjust={onQuantityAdjust}
              />
            </div>
          </div>
        </div>
        <div className="text-gray-600 mb-8 prose prose-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getProductText(language, product.id, 'longDescription') || product.description || '') }} />

        {/* Attributes Section */}
        <div className="mb-4">
          <ProductAttributesSelector
            product={product}
            attributeGroups={attributeGroups}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedAttributeValues={selectedAttributeValues}
            unavailableAttributes={unavailableAttributes}
            colorGroups={colorGroups}
            sizeGroups={sizeGroups}
            language={language}
            quantity={quantity}
            maxQuantity={maxQuantity}
            isOutOfStock={isOutOfStock}
            isVariationRequired={isVariationRequired}
            hasUnavailableAttributes={hasUnavailableAttributes}
            canAddToCart={canAddToCart}
            isAddingToCart={isAddingToCart}
            showMessage={showMessage}
            onColorSelect={onColorSelect}
            onSizeSelect={onSizeSelect}
            onAttributeValueSelect={onAttributeValueSelect}
            onQuantityAdjust={onQuantityAdjust}
            onAddToCart={onAddToCart}
            getOptionValue={getOptionValue}
            getRequiredAttributesMessage={getRequiredAttributesMessage}
          />
        </div>
      </div>
      
      {/* Action buttons — bottom-aligned with gallery image on desktop */}
      <div className="mt-auto lg:pt-0 pt-6">
        {/* Show unavailable attributes message if needed */}
        {hasUnavailableAttributes && !isVariationRequired && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              {Array.from(unavailableAttributes.entries()).map(([attrKey]) => {
                const productAttr = product?.productAttributes?.find((pa: any) => pa.attribute?.key === attrKey);
                const attributeName = productAttr?.attribute?.name || attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
                return attrKey === 'color' ? t(language, 'product.color') : 
                       attrKey === 'size' ? t(language, 'product.size') : 
                       attributeName;
              }).join(', ')} {t(language, 'product.outOfStock')}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {showSizeGuide ? (
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className={`${CLAY_PRIMARY_BUTTON_CLASS} shrink-0 self-center lg:self-auto`}
              style={{
                ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_BOYS_BG_COLOR),
                height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
              }}
            >
              {t(language, 'product.sizeGuide.open')}
            </button>
          ) : null}
          <div className="flex flex-1 items-center gap-3">
            <button 
              disabled={!canAddToCart || isAddingToCart} 
              className="flex-1 rounded-full bg-brand-cart font-bold text-gray-900 transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              style={{ height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX }}
              onClick={onAddToCart}
            >
              <span className="relative block h-full w-full">
                <span className="absolute inset-y-0 left-0 right-[2.625rem] flex translate-x-[3px] items-center justify-center whitespace-pre-line text-center leading-[1.05] md:whitespace-normal md:leading-normal">
                  {mobileFormattedActionLabel}
                </span>
                <span className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                  <Image
                    src={MOBILE_PRODUCTS_CATALOG_CARD_ASSETS.cart}
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </span>
              </span>
            </button>
            <button 
              onClick={onAddToWishlist} 
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isInWishlist
                  ? 'border-gray-200 text-brand-pink'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Heart fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
      {showMessage && <div className="mt-4 p-4 bg-gray-900 text-white rounded-md shadow-lg">{showMessage}</div>}
      <SizeGuideSideSheet
        isOpen={isSizeGuideOpen}
        language={language}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}



