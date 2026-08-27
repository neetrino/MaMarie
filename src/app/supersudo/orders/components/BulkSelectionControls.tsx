'use client';

import { useTranslation } from '../../../../lib/i18n-client';
import { Card, Button } from '@shop/ui';

interface BulkSelectionControlsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  bulkDeleting: boolean;
}

export function BulkSelectionControls({
  selectedCount,
  onBulkDelete,
  bulkDeleting,
}: BulkSelectionControlsProps) {
  const { t } = useTranslation();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="mb-6 w-full min-w-0 p-4">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 text-sm text-gray-700">
          {t('admin.orders.selectedOrders').replace('{count}', selectedCount.toString())}
        </div>
        <Button
          variant="outline"
          type="button"
          className="shrink-0 !border-red-600 !bg-red-600 !text-white hover:!bg-red-700 hover:!text-white focus:!ring-red-500"
          onClick={onBulkDelete}
          disabled={bulkDeleting}
        >
          {bulkDeleting ? t('admin.orders.deleting') : t('admin.orders.deleteSelected')}
        </Button>
      </div>
    </Card>
  );
}

