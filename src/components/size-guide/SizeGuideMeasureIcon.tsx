import type { SizeGuideMeasureKey } from '../../constants/size-guide';

type SizeGuideMeasureIconProps = {
  measure: SizeGuideMeasureKey;
  className?: string;
};

/** Simple line icons matching the size-guide infographic. */
export function SizeGuideMeasureIcon({ measure, className = 'h-8 w-8' }: SizeGuideMeasureIconProps) {
  const stroke = 'currentColor';

  if (measure === 'height') {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M12 6v20M12 6l-2 2M12 6l2 2M12 26l-2-2M12 26l2-2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="9" r="2.5" stroke={stroke} strokeWidth="1.5" />
        <path d="M20 12v8M17 28l3-8 3 8M17 18h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (measure === 'chest') {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M8 12l4-4h8l4 4v12H8V12zM12 8l2 4h4l2-4"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 16h16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (measure === 'waist') {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M10 6h12v8c0 2-2 4-6 4s-6-2-6-4V6z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14h12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M12 18v8M20 18v8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M10 6h12v6c0 3-2 5-6 7-4-2-6-4-6-7V6z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 20c2 3 4 5 6 6 2-1 4-3 6-6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 18h16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}
