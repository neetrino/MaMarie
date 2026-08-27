'use client';

import { Button } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';

export interface BrandsTableBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  published?: boolean;
}

interface BrandsTableProps {
  brands: BrandsTableBrand[];
  onEdit: (brand: BrandsTableBrand) => void;
  onDelete: (brandId: string, brandName: string) => void;
}

export function BrandsTable({ brands, onEdit, onDelete }: BrandsTableProps) {
  const { t } = useTranslation();

  return (
    <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t('admin.brands.brandName')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t('admin.brands.slug')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t('admin.brands.status')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t('admin.products.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="border-b border-gray-100 bg-gray-50 transition-colors hover:bg-gray-100"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-10 w-10 rounded-md border border-gray-200 object-cover"
                    />
                  ) : null}
                  <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-500">{brand.slug}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-500">
                {brand.published ? t('admin.brands.published') : t('admin.brands.draft')}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(brand)}
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                    aria-label={t('admin.brands.edit')}
                    title={t('admin.brands.edit')}
                  >
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(brand.id, brand.name)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-800"
                    aria-label={t('admin.brands.delete')}
                    title={t('admin.brands.delete')}
                  >
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
