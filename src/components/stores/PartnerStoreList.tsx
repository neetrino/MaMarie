'use client';

import Image from 'next/image';
import type { PartnerStoreItem } from '@/lib/partner-stores/types';
import {
  STORES_CARD_ACTIVE_BG,
  STORES_CARD_ACTIVE_BORDER,
  STORES_CARD_ACTIVE_DOT,
  STORES_PAGE_ASSETS,
} from '@/constants/stores-page';

interface PartnerStoreListProps {
  stores: PartnerStoreItem[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
  title: string;
  hint: string;
}

export function PartnerStoreList({
  stores,
  selectedStoreId,
  onSelectStore,
  title,
  hint,
}: PartnerStoreListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-brand-brown">{title}</h2>
        <p className="mt-2 text-sm text-brand-muted">{hint}</p>
      </div>

      <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
        {stores.map((store) => {
          const isSelected = store.id === selectedStoreId;

          return (
            <li key={store.id}>
              <button
                type="button"
                onClick={() => onSelectStore(store.id)}
                className="relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors"
                style={{
                  backgroundColor: isSelected ? STORES_CARD_ACTIVE_BG : '#ffffff',
                  borderColor: isSelected ? STORES_CARD_ACTIVE_BORDER : '#e5e7eb',
                }}
              >
                {isSelected ? (
                  <span
                    className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STORES_CARD_ACTIVE_DOT }}
                    aria-hidden
                  />
                ) : null}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white">
                  {store.logoUrl ? (
                    <Image
                      src={store.logoUrl}
                      alt={store.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain p-1"
                      unoptimized={store.logoUrl.startsWith('data:')}
                    />
                  ) : (
                    <span className="text-xs font-semibold uppercase text-brand-muted">
                      {store.name.slice(0, 2)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 pr-4">
                  <p className="truncate text-sm font-semibold text-brand-brown">{store.name}</p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-brand-muted">
                    <Image
                      src={STORES_PAGE_ASSETS.iconLocation}
                      alt=""
                      width={14}
                      height={14}
                      className="mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <span className="line-clamp-2">{store.address}</span>
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
