'use client';

import { Maximize2 } from 'lucide-react';
import { ProductLabels } from '../../../components/ProductLabels';
import { t } from '../../../lib/i18n';
import type { ProductPageSnapshot } from '../../../lib/product-page-snapshot';
import {
  PRODUCT_PDP_GALLERY_LAYOUT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS,
} from './constants';

interface ProductPageSnapshotGalleryProps {
  snapshot: ProductPageSnapshot;
}

export function ProductPageSnapshotGallery({ snapshot }: ProductPageSnapshotGalleryProps) {
  return (
    <div className={PRODUCT_PDP_GALLERY_LAYOUT_CLASS}>
      <div className={PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS}>
        <div data-product-fly-origin className={PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS}>
          <img
            src={snapshot.imageUrl}
            alt={snapshot.title}
            className="absolute inset-0 h-full w-full object-contain"
            decoding="async"
          />
          {snapshot.discountPercent ? (
            <div className="absolute top-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
              -{snapshot.discountPercent}%
            </div>
          ) : null}
          {snapshot.labels && snapshot.labels.length > 0 ? <ProductLabels labels={snapshot.labels} /> : null}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3">
            <button
              type="button"
              disabled
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm disabled:cursor-default"
              aria-label={t(snapshot.language, 'common.ariaLabels.fullscreenImage')}
            >
              <Maximize2 className="h-5 w-5 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
