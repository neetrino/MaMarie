import type { GeneratedVariant, ProductLabel } from '../types';

export type ProductFormFieldErrors = Partial<Record<string, string>>;

export function clearProductFieldError(
  errors: ProductFormFieldErrors,
  field: string,
): ProductFormFieldErrors {
  if (!errors[field]) {
    return errors;
  }

  const next = { ...errors };
  delete next[field];
  return next;
}

interface ValidateProductFormInput {
  productType: 'simple' | 'variable';
  title: string;
  slug: string;
  labels: ProductLabel[];
  simpleProductData: {
    price: string;
    quantity: string;
  };
  selectedAttributesForVariants: Set<string>;
  generatedVariants: GeneratedVariant[];
  isEditMode: boolean;
  hasVariantsToLoad: boolean;
}

function validateBasicFields(
  title: string,
  slug: string,
  t: (key: string) => string,
  errors: ProductFormFieldErrors,
): void {
  if (!title.trim()) {
    errors.title = t('admin.products.add.titleRequired');
  }

  if (!slug.trim()) {
    errors.slug = t('admin.products.add.slugRequired');
  }
}

function validateSimpleProductFields(
  price: string,
  quantity: string,
  t: (key: string) => string,
  errors: ProductFormFieldErrors,
): void {
  const priceValue = parseFloat(price);
  if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
    errors.price = t('admin.products.add.priceRequired');
  }

  if (!quantity.trim() || Number.isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) < 0) {
    errors.quantity = t('admin.products.add.quantityRequired');
  }
}

function validateLabels(
  labels: ProductLabel[],
  t: (key: string) => string,
  errors: ProductFormFieldErrors,
): void {
  labels.forEach((label, index) => {
    if (!label.value.trim()) {
      errors[`label.${index}.value`] = t('admin.products.add.labelValueRequired');
    }
  });
}

function validateVariableProductFields(
  input: ValidateProductFormInput,
  t: (key: string) => string,
  errors: ProductFormFieldErrors,
): void {
  const hasLoadedVariants = input.isEditMode && input.hasVariantsToLoad;

  if (!hasLoadedVariants && input.selectedAttributesForVariants.size === 0) {
    errors.attributes = t('admin.products.add.attributesRequired');
  }

  if (input.generatedVariants.length === 0) {
    errors.variants = t('admin.products.add.variantsRequired');
    return;
  }

  input.generatedVariants.forEach((variant) => {
    const priceValue = parseFloat(variant.price);
    if (!variant.price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      errors[`variant.${variant.id}.price`] = t('admin.products.add.variantPriceRequired');
    }

    if (variant.stock.trim() === '' || Number.isNaN(parseInt(variant.stock, 10))) {
      errors[`variant.${variant.id}.stock`] = t('admin.products.add.variantStockRequired');
    }

    if (input.selectedAttributesForVariants.size > 0 && variant.selectedValueIds.length === 0) {
      errors[`variant.${variant.id}.values`] = t('admin.products.add.variantValuesRequired');
    }
  });
}

export function validateProductForm(
  input: ValidateProductFormInput,
  t: (key: string) => string,
): ProductFormFieldErrors {
  const errors: ProductFormFieldErrors = {};

  validateBasicFields(input.title, input.slug, t, errors);
  validateLabels(input.labels, t, errors);

  if (input.productType === 'simple') {
    validateSimpleProductFields(
      input.simpleProductData.price,
      input.simpleProductData.quantity,
      t,
      errors,
    );
  } else {
    validateVariableProductFields(input, t, errors);
  }

  if (Object.keys(errors).length > 0) {
    errors.formSummary = t('admin.products.add.fixFormErrors');
  }

  return errors;
}

export function scrollToFirstProductFormError(): void {
  const firstErrorField = document.querySelector('[data-field-error="true"]');
  firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
