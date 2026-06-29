'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import {
  PRODUCTS_CATALOG_FILTER_CHEVRON_SRC,
  PRODUCTS_CATALOG_FILTER_SECTION_BG,
  PRODUCTS_CATALOG_FILTER_SECTION_RADIUS_PX,
  PRODUCTS_CATALOG_FILTER_SECTION_SHADOW,
  PRODUCTS_CATALOG_FILTER_TITLE_LETTER_SPACING_PX,
  PRODUCTS_CATALOG_FILTER_TITLE_SIZE_PX,
} from '../../constants/products-catalog';

interface ProductsFilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ProductsFilterSection({
  title,
  children,
  defaultOpen = true,
}: ProductsFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: PRODUCTS_CATALOG_FILTER_SECTION_BG,
        borderRadius: PRODUCTS_CATALOG_FILTER_SECTION_RADIUS_PX,
        boxShadow: PRODUCTS_CATALOG_FILTER_SECTION_SHADOW,
        padding: 16,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-5"
        aria-expanded={isOpen}
      >
        <span
          className="font-bold uppercase"
          style={{
            fontSize: PRODUCTS_CATALOG_FILTER_TITLE_SIZE_PX,
            letterSpacing: `${PRODUCTS_CATALOG_FILTER_TITLE_LETTER_SPACING_PX}px`,
            lineHeight: '16.5px',
            color: '#1d1c16',
          }}
        >
          {title}
        </span>
        <Image
          src={PRODUCTS_CATALOG_FILTER_CHEVRON_SRC}
          alt=""
          width={14}
          height={14}
          aria-hidden
          className={`shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>

      {isOpen ? <div className="pt-3">{children}</div> : null}
    </section>
  );
}
