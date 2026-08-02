'use client';

import { Card } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import { ClayDatePicker } from '../../../../components/ClayDatePicker';
import { ClaySelect } from '../../../../components/ClaySelect';
import { formatDate } from '../utils';
import type { AnalyticsData } from '../types';

interface PeriodSelectorProps {
  period: string;
  startDate: string;
  endDate: string;
  analytics: AnalyticsData | null;
  onPeriodChange: (period: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function PeriodSelector({
  period,
  startDate,
  endDate,
  analytics,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
}: PeriodSelectorProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 mb-6 bg-white shadow-sm border border-gray-200 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.analytics.timePeriod')}</h2>
        {analytics && (
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            {formatDate(analytics.dateRange.start)} - {formatDate(analytics.dateRange.end)}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <ClaySelect
            label={t('admin.analytics.period')}
            value={period}
            onChange={(value) => {
              onPeriodChange(value);
              if (value !== 'custom') {
                onStartDateChange('');
                onEndDateChange('');
              }
            }}
            placeholder={t('admin.analytics.today')}
            options={[
              { value: 'day', label: t('admin.analytics.today') },
              { value: 'week', label: t('admin.analytics.last7Days') },
              { value: 'month', label: t('admin.analytics.last30Days') },
              { value: 'year', label: t('admin.analytics.lastYear') },
              { value: 'custom', label: t('admin.analytics.customRange') },
            ]}
          />
        </div>
        {period === 'custom' && (
          <>
            <div className="min-w-[200px] flex-1">
              <ClayDatePicker
                label={t('admin.analytics.startDate')}
                mode="date"
                value={startDate}
                onChange={onStartDateChange}
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <ClayDatePicker
                label={t('admin.analytics.endDate')}
                mode="date"
                value={endDate}
                onChange={onEndDateChange}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}




