'use client';

import {
  CLAY_PRIMARY_BUTTON_CLASS,
  getClayPrimaryButtonCompactStyle,
} from '../../../constants/clay-primary-button';
import { HERO_GENDER_BUTTON_BOYS_BG_COLOR } from '../../../constants/hero';
import { processImageUrl } from '../../../lib/utils/image-utils';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import { PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX } from './constants';
import type { Product, ProductVariant } from './types';
import { logger } from "@/lib/utils/logger";
import {
  resolveAttributeNameDisplay,
  resolveAttributeValueDisplayLabel,
} from './utils/attribute-display-label';

interface AttributeGroupValue {
  valueId?: string;
  value: string;
  label: string;
  stock: number;
  variants: ProductVariant[];
  imageUrl?: string | null;
  colors?: string[] | null;
}

interface ProductAttributesSelectorProps {
  product: Product;
  attributeGroups: Map<string, AttributeGroupValue[]>;
  selectedColor: string | null;
  selectedSize: string | null;
  selectedAttributeValues: Map<string, string>;
  unavailableAttributes: Map<string, boolean>;
  colorGroups: Array<{ color: string; stock: number; variants: ProductVariant[] }>;
  sizeGroups: Array<{ size: string; stock: number; variants: ProductVariant[] }>;
  language: LanguageCode;
  showSizeGuide?: boolean;
  onOpenSizeGuide?: () => void;
  quantity: number;
  maxQuantity: number;
  isOutOfStock: boolean;
  isVariationRequired: boolean;
  hasUnavailableAttributes: boolean;
  canAddToCart: boolean;
  isAddingToCart: boolean;
  showMessage: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  onAttributeValueSelect: (attrKey: string, value: string) => void;
  onQuantityAdjust: (delta: number) => void;
  onAddToCart: () => Promise<void>;
  getOptionValue: (options: any[] | undefined, key: string) => string | null;
  getRequiredAttributesMessage: () => string;
}

// Helper function to get color hex/rgb from color name
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'beige': '#F5F5DC', 'black': '#000000', 'blue': '#0000FF', 'brown': '#A52A2A',
    'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'red': '#FF0000',
    'white': '#FFFFFF', 'yellow': '#FFFF00', 'orange': '#FFA500', 'pink': '#FFC0CB',
    'purple': '#800080', 'navy': '#000080', 'maroon': '#800000', 'olive': '#808000',
    'teal': '#008080', 'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00',
    'silver': '#C0C0C0', 'gold': '#FFD700',
  };
  const normalizedName = colorName.toLowerCase().trim();
  return colorMap[normalizedName] || '#CCCCCC';
};

function getSizeCircleDimensionClass(totalValues: number): string {
  if (totalValues > 6) return 'h-9 w-9 text-[10px]';
  if (totalValues > 3) return 'h-10 w-10 text-xs';
  return 'h-11 w-11 text-sm';
}

function getSizeCircleButtonClass({
  isSelected,
  isDisabled,
  isLowStock = false,
  dimensionClass,
}: {
  isSelected: boolean;
  isDisabled: boolean;
  isLowStock?: boolean;
  dimensionClass: string;
}): string {
  return [
    dimensionClass,
    'flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 font-medium transition-all',
    isSelected
      ? 'scale-110 border-[3px] border-green-500 bg-gray-50'
      : isDisabled
        ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
        : isLowStock
          ? 'border-gray-200 opacity-60 hover:opacity-80'
          : 'border-gray-300 hover:scale-105 hover:border-gray-400',
  ].join(' ');
}

function SizeGuideButton({
  language,
  onOpenSizeGuide,
}: {
  language: LanguageCode;
  onOpenSizeGuide: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpenSizeGuide}
      className={`${CLAY_PRIMARY_BUTTON_CLASS} ml-auto shrink-0 self-center`}
      style={{
        ...getClayPrimaryButtonCompactStyle(HERO_GENDER_BUTTON_BOYS_BG_COLOR),
        height: PRODUCT_PDP_ACTION_BUTTON_HEIGHT_PX,
      }}
    >
      {t(language, 'product.sizeGuide.open')}
    </button>
  );
}

export function ProductAttributesSelector({
  product,
  attributeGroups,
  selectedColor,
  selectedSize,
  selectedAttributeValues,
  unavailableAttributes,
  colorGroups,
  sizeGroups,
  language,
  showSizeGuide,
  onOpenSizeGuide,
  onColorSelect,
  onSizeSelect,
  onAttributeValueSelect,
  getOptionValue,
}: ProductAttributesSelectorProps) {
  const attributeGroupsEntries = Array.from(attributeGroups.entries());
  logger.debug('🎨 [PRODUCT ATTRIBUTES SELECTOR] attributeGroups entries:', attributeGroupsEntries.length);
  logger.debug('🎨 [PRODUCT ATTRIBUTES SELECTOR] attributeGroups keys:', Array.from(attributeGroups.keys()));
  logger.debug('🎨 [PRODUCT ATTRIBUTES SELECTOR] product.productAttributes:', product?.productAttributes);

  const useNewFormat = attributeGroupsEntries.some(([, arr]) => arr.length > 0);
  const hasLegacyColor = colorGroups.length > 0;
  const hasLegacySize = !product?.productAttributes && sizeGroups.length > 0;
  if (!useNewFormat && !hasLegacyColor && !hasLegacySize) {
    return null;
  }

  return (
    <div
      className={`space-y-4 ${
        useNewFormat
          ? 'min-[744px]:max-[1023px]:grid min-[744px]:max-[1023px]:grid-cols-2 min-[744px]:max-[1023px]:gap-4 min-[744px]:max-[1023px]:space-y-0'
          : ''
      }`}
    >
      {/* Attribute Selectors - Support both new (productAttributes) and old (colorGroups) format */}
      {/* Display all attributes from attributeGroups, not just from productAttributes */}
      {useNewFormat ? (
        // Use attributeGroups which contains all attributes (from productAttributes and variants)
        Array.from(attributeGroups.entries()).map(([attrKey, attrGroups]) => {
          // Try to get attribute name from productAttributes if available
          const productAttr = product?.productAttributes?.find((pa: { attribute?: { key?: string; name?: string } }) => pa.attribute?.key === attrKey);
          const attributeName = resolveAttributeNameDisplay(
            language,
            attrKey,
            productAttr?.attribute?.name,
          );
          const isColor = attrKey === 'color';
          const isSize = attrKey === 'size';

          if (attrGroups.length === 0) return null;

          // Check if this attribute is unavailable for the selected variant
          const isUnavailable = unavailableAttributes.get(attrKey) || false;
          
          return (
            <div
              key={attrKey}
              className={`space-y-1.5 ${
                !isColor && !isSize ? 'min-[744px]:max-[1023px]:col-span-2' : ''
              }`}
            >
              {isSize ? (
                <label
                  className={`text-xs font-bold uppercase ${
                    isUnavailable ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {attributeName}
                </label>
              ) : (
                <label
                  className={`text-xs font-bold uppercase ${
                    isUnavailable
                      ? 'text-red-600'
                      : isColor
                        ? 'text-blue-600'
                        : ''
                  }`}
                >
                  {isColor ? attributeName : `${attributeName}:`}
                </label>
              )}
              {isColor ? (
                <div className="flex flex-wrap gap-1.5 items-center">
                  {attrGroups.map((g) => {
                    const isSelected = selectedColor === g.value?.toLowerCase().trim();
                    // IMPORTANT: Don't disable based on stock - show all colors, even if stock is 0
                    // Stock is just informational, not a reason to hide the option
                    const isDisabled = false; // Always show all colors
                    // Process imageUrl to ensure it's in the correct format
                    const processedImageUrl = g.imageUrl ? processImageUrl(g.imageUrl) : null;
                    const hasImage = processedImageUrl && processedImageUrl.trim() !== '';
                    const colorHex = g.colors && Array.isArray(g.colors) && g.colors.length > 0 
                      ? g.colors[0] 
                      : getColorValue(g.value);
                    const colorLabel = resolveAttributeValueDisplayLabel(
                      language,
                      attrKey,
                      g.value,
                      g.label,
                    );
                    
                    // Dynamic sizing based on number of values
                    // Keep size consistent for 2 values, reduce for more
                    const totalValues = attrGroups.length;
                    const sizeClass = totalValues > 6 
                      ? 'w-8 h-8' 
                      : totalValues > 3 
                      ? 'w-9 h-9' 
                      : 'w-10 h-10';
                    const labelSizeClass = totalValues > 6
                      ? 'max-w-[2rem] text-[10px]'
                      : totalValues > 3
                        ? 'max-w-[2.25rem] text-[10px]'
                        : 'max-w-[2.5rem] text-xs';
                    
                    return (
                      <div key={g.valueId || g.value} className="flex flex-col items-center gap-0.5">
                        <button 
                          onClick={() => onColorSelect(g.value)}
                          className={`${sizeClass} rounded-full transition-all overflow-hidden ${
                            isSelected 
                              ? 'border-[3px] border-green-500 scale-110' 
                              : g.stock <= 0
                                ? 'border-2 border-gray-200 opacity-60 hover:opacity-80' 
                                : 'border-2 border-gray-300 hover:scale-105'
                          }`}
                          style={hasImage ? {} : { backgroundColor: colorHex }}
                          title={colorLabel}
                        >
                          {hasImage && processedImageUrl ? (
                            <img 
                              src={processedImageUrl} 
                              alt={colorLabel}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`❌ [COLOR IMAGE] Failed to load image for color "${g.value}":`, processedImageUrl);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                              onLoad={() => {
                                logger.debug(`✅ [COLOR IMAGE] Successfully loaded image for color "${g.value}":`, processedImageUrl);
                              }}
                            />
                          ) : null}
                        </button>
                        <span
                          className={`${labelSizeClass} text-center leading-tight text-gray-700 line-clamp-2`}
                        >
                          {colorLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : isSize ? (
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                  {attrGroups.map((g) => {
                    // Use stock from groups (already calculated with compatibility)
                    const displayStock = g.stock;
                    const isSelected = selectedSize === g.value.toLowerCase().trim();
                    // IMPORTANT: Don't disable based on stock - show all sizes, even if stock is 0
                    // Stock is just informational, not a reason to hide the option
                    const isDisabled = false; // Always show all sizes
                    
                    // Process imageUrl to ensure it's in the correct format
                    const processedImageUrl = g.imageUrl ? processImageUrl(g.imageUrl) : null;
                    const hasImage = processedImageUrl && processedImageUrl.trim() !== '';
                    
                    // Dynamic sizing based on number of values
                    // Keep size consistent for 2 values, reduce for more
                    const totalValues = attrGroups.length;
                    const dimensionClass = getSizeCircleDimensionClass(totalValues);
                    const sizeLabel = resolveAttributeValueDisplayLabel(
                      language,
                      attrKey,
                      g.value,
                      g.label,
                    );

                    return (
                      <button 
                        key={g.valueId || g.value}
                        onClick={() => onSizeSelect(g.value)}
                        className={getSizeCircleButtonClass({
                          isSelected,
                          isDisabled,
                          isLowStock: displayStock <= 0,
                          dimensionClass,
                        })}
                        title={sizeLabel}
                      >
                        {hasImage && processedImageUrl ? (
                          <img 
                            src={processedImageUrl} 
                            alt={g.label}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error(`❌ [SIZE IMAGE] Failed to load image for size "${g.value}":`, processedImageUrl);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            onLoad={() => {
                              logger.debug(`✅ [SIZE IMAGE] Successfully loaded image for size "${g.value}":`, processedImageUrl);
                            }}
                          />
                        ) : (
                          <span>{sizeLabel}</span>
                        )}
                      </button>
                    );
                  })}
                  </div>
                  {showSizeGuide && onOpenSizeGuide ? (
                    <SizeGuideButton language={language} onOpenSizeGuide={onOpenSizeGuide} />
                  ) : null}
                </div>
              ) : (
                // Generic attribute selector
                <div className="flex flex-wrap gap-1.5">
                  {attrGroups.map((g) => {
                    const selectedValueId = selectedAttributeValues.get(attrKey);
                    const isSelected = selectedValueId === g.valueId || (!g.valueId && selectedColor === g.value);
                    // IMPORTANT: Don't disable based on stock - show all attribute values, even if stock is 0
                    // Stock is just informational, not a reason to hide the option
                    const isDisabled = false; // Always show all attribute values
                    
                    // Process imageUrl to ensure it's in the correct format
                    const processedImageUrl = g.imageUrl ? processImageUrl(g.imageUrl) : null;
                    const hasImage = processedImageUrl && processedImageUrl.trim() !== '';
                    const hasColors = g.colors && Array.isArray(g.colors) && g.colors.length > 0;
                    const colorHex = hasColors && g.colors 
                      ? g.colors[0] 
                      : null;
                    
                    // Debug logging for image issues
                    if (g.imageUrl && !hasImage) {
                      console.warn(`⚠️ [ATTRIBUTE IMAGE] Failed to process imageUrl for attribute "${attrKey}" value "${g.value}":`, g.imageUrl);
                    }
                    
                    // Dynamic sizing based on number of values
                    // Keep size consistent for 2 values, reduce for more
                    const totalValues = attrGroups.length;
                    const paddingClass = totalValues > 6 
                      ? 'px-2 py-1' 
                      : totalValues > 3 
                      ? 'px-3 py-1.5' 
                      : 'px-4 py-2';
                    const textSizeClass = totalValues > 6 
                      ? 'text-xs' 
                      : 'text-sm';
                    const imageSizeClass = totalValues > 6 
                      ? 'w-4 h-4' 
                      : totalValues > 3 
                      ? 'w-5 h-5' 
                      : 'w-6 h-6';
                    const gapClass = totalValues > 6 
                      ? 'gap-1' 
                      : 'gap-2';

                    return (
                      <button
                        key={g.valueId || g.value}
                        onClick={() => {
                          if (!isDisabled) {
                            onAttributeValueSelect(attrKey, g.valueId || g.value);
                          }
                        }}
                        className={`${paddingClass} rounded-lg border-2 transition-all flex items-center ${gapClass} ${
                          isSelected
                            ? 'border-green-500 bg-gray-50'
                            : g.stock <= 0
                              ? 'border-gray-200 opacity-60 hover:opacity-80'
                              : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={!hasImage && colorHex ? { backgroundColor: colorHex } : {}}
                      >
                        {hasImage && processedImageUrl ? (
                          <img 
                            src={processedImageUrl} 
                            alt={g.label}
                            className={`${imageSizeClass} object-cover rounded border border-gray-300 flex-shrink-0`}
                            onError={(e) => {
                              console.error(`❌ [ATTRIBUTE IMAGE] Failed to load image for attribute "${attrKey}" value "${g.value}":`, processedImageUrl);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            onLoad={() => {
                              logger.debug(`✅ [ATTRIBUTE IMAGE] Successfully loaded image for attribute "${attrKey}" value "${g.value}":`, processedImageUrl);
                            }}
                          />
                        ) : hasColors && colorHex ? (
                          <div 
                            className={`${imageSizeClass} rounded border border-gray-300 flex-shrink-0`}
                            style={{ backgroundColor: colorHex }}
                          />
                        ) : null}
                        <span className={textSizeClass}>
                          {resolveAttributeValueDisplayLabel(language, attrKey, g.value, g.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        // Old format: Use colorGroups and sizeGroups
        <>
          {colorGroups.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-600">{t(language, 'product.color')}</label>
              <div className="flex flex-wrap gap-2 items-center">
                {colorGroups.map((g) => {
                  const isSelected = selectedColor === g.color?.toLowerCase().trim();
                  const isDisabled = g.stock <= 0;
                  const colorLabel = resolveAttributeValueDisplayLabel(language, 'color', g.color);
                  
                  return (
                    <div key={g.color} className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => !isDisabled && onColorSelect(g.color)}
                        disabled={isDisabled}
                        className={`w-10 h-10 rounded-full transition-all ${
                          isSelected 
                            ? 'border-[3px] border-green-500 scale-110' 
                            : isDisabled 
                              ? 'border-2 border-gray-100 opacity-30 grayscale cursor-not-allowed' 
                              : 'border-2 border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: getColorValue(g.color) }} 
                        title={colorLabel}
                      />
                      <span className="max-w-[2.5rem] text-center text-xs leading-tight text-gray-700 line-clamp-2">
                        {colorLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Size Groups - Show only if not using new format */}
      {!product?.productAttributes && sizeGroups.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase text-blue-600">{t(language, 'product.size')}</label>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex flex-wrap items-center gap-2">
            {sizeGroups.map((g) => {
              let displayStock = g.stock;
              if (selectedColor) {
                const v = g.variants.find(v => {
                  const colorOpt = getOptionValue(v.options, 'color');
                  return colorOpt === selectedColor.toLowerCase().trim();
                });
                displayStock = v ? v.stock : 0;
              }
              const isSelected = selectedSize === g.size;
              const isDisabled = displayStock <= 0;
              const sizeLabel = resolveAttributeValueDisplayLabel(language, 'size', g.size);
              const dimensionClass = getSizeCircleDimensionClass(sizeGroups.length);

              return (
                <button 
                  key={g.size} 
                  onClick={() => !isDisabled && onSizeSelect(g.size)}
                  disabled={isDisabled}
                  className={getSizeCircleButtonClass({
                    isSelected,
                    isDisabled,
                    dimensionClass,
                  })}
                  title={sizeLabel}
                >
                  <span>{sizeLabel}</span>
                </button>
              );
            })}
            </div>
            {showSizeGuide && onOpenSizeGuide ? (
              <SizeGuideButton language={language} onOpenSizeGuide={onOpenSizeGuide} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}



