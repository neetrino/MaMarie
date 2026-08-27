const PRODUCT_PDP_COLOR_LABEL_BASE_CLASS =
  'text-center leading-tight text-gray-700 whitespace-normal break-words';

export function getProductColorSwatchRowClass(totalValues: number): string {
  if (totalValues > 6) {
    return 'flex flex-wrap items-start gap-x-2 gap-y-2';
  }
  if (totalValues > 3) {
    return 'flex flex-wrap items-start gap-x-3 gap-y-2';
  }
  return 'flex flex-wrap items-start gap-x-4 gap-y-2';
}

export function getProductColorSwatchItemClass(): string {
  return 'flex shrink-0 flex-col items-center gap-1';
}

export function getProductColorSwatchLabelClass(totalValues: number): string {
  if (totalValues > 6) {
    return `${PRODUCT_PDP_COLOR_LABEL_BASE_CLASS} max-w-[2rem] text-[10px] line-clamp-2`;
  }
  if (totalValues > 3) {
    return `${PRODUCT_PDP_COLOR_LABEL_BASE_CLASS} max-w-[3.25rem] text-[10px] line-clamp-2`;
  }
  return `${PRODUCT_PDP_COLOR_LABEL_BASE_CLASS} max-w-[7rem] text-xs`;
}

export function getProductColorSwatchSizeClass(totalValues: number): string {
  if (totalValues > 6) {
    return 'h-8 w-8';
  }
  if (totalValues > 3) {
    return 'h-9 w-9';
  }
  return 'h-10 w-10';
}
