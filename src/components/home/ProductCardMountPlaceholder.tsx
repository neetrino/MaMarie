import {
  PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
  PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
} from '../../constants/products-catalog';

interface ProductCardMountPlaceholderProps {
  variant: 'grid' | 'list';
  widthPx?: number;
  heightPx?: number;
  className?: string;
}

/** Lightweight skeleton while a product card waits for viewport entry. */
export function ProductCardMountPlaceholder({
  variant,
  widthPx,
  heightPx,
  className,
}: ProductCardMountPlaceholderProps) {
  const isList = variant === 'list';

  return (
    <div
      className={`animate-pulse bg-[#f9e490]/60 ${className ?? ''}`}
      style={
        isList
          ? {
              width: '100%',
              height: PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
              borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
            }
          : {
              width: widthPx ?? '100%',
              height: heightPx,
              borderRadius: 30,
            }
      }
      aria-hidden
    />
  );
}
