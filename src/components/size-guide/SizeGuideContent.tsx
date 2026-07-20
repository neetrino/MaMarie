import Image from 'next/image';
import {
  SIZE_GUIDE_ILLUSTRATION_HEIGHT_PX,
  SIZE_GUIDE_ILLUSTRATION_SRC,
  SIZE_GUIDE_ILLUSTRATION_WIDTH_PX,
  SIZE_GUIDE_MEASURE_KEYS,
  SIZE_GUIDE_ROWS,
  type SizeGuideMeasureKey,
  type SizeGuideRow,
} from '../../constants/size-guide';
import { t } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';
import { SizeGuideMeasureIcon } from './SizeGuideMeasureIcon';

type SizeGuideContentProps = {
  language: LanguageCode;
};

function formatCm(value: number, language: LanguageCode): string {
  return t(language, 'product.sizeGuide.cmValue').replace('{value}', String(value));
}

function rowValue(row: SizeGuideRow, key: SizeGuideMeasureKey): number {
  if (key === 'height') return row.heightCm;
  if (key === 'chest') return row.chestCm;
  if (key === 'waist') return row.waistCm;
  return row.hipCm;
}

function SizeGuideTable({ language }: SizeGuideContentProps) {
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-[#e8e0d5]">
      <table className="w-full min-w-[280px] border-collapse text-center text-sm">
        <thead>
          <tr className="bg-[#efe8df]">
            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide">
              {t(language, 'product.sizeGuide.table.size')}
            </th>
            {SIZE_GUIDE_MEASURE_KEYS.map((key) => (
              <th key={key} className="px-2 py-2.5 text-[11px] font-bold uppercase tracking-wide">
                {t(language, `product.sizeGuide.measures.${key}.label`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZE_GUIDE_ROWS.map((row) => (
            <tr key={row.sizeLabel} className="border-t border-[#e8e0d5]">
              <td className="px-3 py-2.5 font-semibold">{row.sizeLabel}</td>
              {SIZE_GUIDE_MEASURE_KEYS.map((key) => (
                <td key={key} className="px-2 py-2.5 text-[#6b5e55]">
                  {formatCm(rowValue(row, key), language)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeGuideMeasureTips({ language }: SizeGuideContentProps) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {SIZE_GUIDE_MEASURE_KEYS.map((key) => (
        <li key={key} className="flex flex-col items-start gap-1">
          <span className="text-[#a89888]">
            <SizeGuideMeasureIcon measure={key} className="h-6 w-6" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-wide">
            {t(language, `product.sizeGuide.measures.${key}.label`)}
          </p>
          <p className="text-[11px] leading-snug text-[#6b5e55]">
            {t(language, `product.sizeGuide.measures.${key}.hint`)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Size guide — photo left, chart right (matches size-guide card). */
export function SizeGuideContent({ language }: SizeGuideContentProps) {
  return (
    <div className="flex flex-col gap-5 text-[#57423b]">
      <div className="flex flex-col items-stretch gap-5 min-[520px]:flex-row min-[520px]:items-center">
        <div className="w-full shrink-0 self-start min-[520px]:w-[42%] min-[520px]:max-w-[280px] min-[520px]:self-center">
          <Image
            src={SIZE_GUIDE_ILLUSTRATION_SRC}
            alt={t(language, 'product.sizeGuide.illustrationAlt')}
            width={SIZE_GUIDE_ILLUSTRATION_WIDTH_PX}
            height={SIZE_GUIDE_ILLUSTRATION_HEIGHT_PX}
            className="h-auto w-full object-contain object-left"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <SizeGuideMeasureTips language={language} />
          <SizeGuideTable language={language} />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-[#faf8f5] px-4 py-3">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-pink ring-1 ring-brand-pink/40"
          aria-hidden
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 13.6S2 9.8 2 5.8A3.3 3.3 0 0 1 8 4.2 3.3 3.3 0 0 1 14 5.8C14 9.8 8 13.6 8 13.6z" />
          </svg>
        </span>
        <p className="text-sm leading-relaxed text-[#6b5e55]">{t(language, 'product.sizeGuide.tip')}</p>
      </div>
    </div>
  );
}
