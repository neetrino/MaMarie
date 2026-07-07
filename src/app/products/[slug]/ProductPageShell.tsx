'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { readProductPageSnapshot, type ProductPageSnapshot } from '@/lib/product-page-snapshot';
import { ProductInfoColumnSkeleton } from './ProductInfoColumnSkeleton';
import { ProductPageFrame } from './ProductPageFrame';
import { ProductPageSnapshotGallery } from './ProductPageSnapshotGallery';
import { ProductPageSnapshotInfo } from './ProductPageSnapshotInfo';

function readSlugFromPathname(pathname: string): string | undefined {
  const [, section, rawSlug] = pathname.split('/');
  if (section !== 'products' || !rawSlug) {
    return undefined;
  }
  return decodeURIComponent(rawSlug);
}

/**
 * Initial PDP shell — card snapshot when available, otherwise neutral skeleton.
 */
export function ProductPageShell() {
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<ProductPageSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(readProductPageSnapshot(readSlugFromPathname(pathname)));
  }, [pathname]);

  return (
    <ProductPageFrame className="min-h-[min(100dvh,720px)]" aria-busy="true" aria-label="Product loading">
      <div className="grid grid-cols-1 gap-12 items-start lg:grid-cols-[55%_45%] lg:items-stretch">
        {snapshot ? (
          <ProductPageSnapshotGallery snapshot={snapshot} />
        ) : (
          <div className="flex gap-6 items-start">
            <div className="flex flex-col gap-4 w-28 flex-shrink-0" aria-hidden>
              <div className="aspect-[3/4] w-full rounded-lg bg-neutral-100" />
              <div className="aspect-[3/4] w-full rounded-lg bg-neutral-100" />
              <div className="aspect-[3/4] w-full rounded-lg bg-neutral-100" />
            </div>
            <div className="flex-1">
              <div className="relative aspect-square w-full max-w-[560px] mx-auto lg:mx-0 rounded-lg bg-neutral-100" aria-hidden />
            </div>
          </div>
        )}
        {snapshot ? <ProductPageSnapshotInfo snapshot={snapshot} /> : <ProductInfoColumnSkeleton />}
      </div>
    </ProductPageFrame>
  );
}
