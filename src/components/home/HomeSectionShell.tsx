import type { CSSProperties, ReactNode } from 'react';
import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
} from '../../constants/home-sections';

interface HomeSectionShellProps {
  children: ReactNode;
  offsetTopPx?: number;
  className?: string;
  style?: CSSProperties;
}

/** Outer homepage section wrapper — shared horizontal insets (sale banner reference). */
export function HomeSectionShell({
  children,
  offsetTopPx = 0,
  className = 'w-full bg-white',
  style,
}: HomeSectionShellProps) {
  return (
    <div className={className} style={{ paddingTop: offsetTopPx, ...style }}>
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: HOME_SECTION_MAX_WIDTH_PX,
          paddingLeft: HOME_SECTION_PADDING_LEFT_PX,
          paddingRight: HOME_SECTION_PADDING_RIGHT_PX,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface HomeSectionContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Inner content column — matches sale banner width (`1:105`). */
export function HomeSectionContent({
  children,
  className = 'w-full',
  style,
}: HomeSectionContentProps) {
  return (
    <div className={className} style={{ maxWidth: HOME_SECTION_CONTENT_MAX_WIDTH_PX, ...style }}>
      {children}
    </div>
  );
}

interface HomePageSectionProps {
  children: ReactNode;
  offsetTopPx?: number;
  className?: string;
  style?: CSSProperties;
}

/** One homepage block — shell + 1354px content column. */
export function HomePageSection({
  children,
  offsetTopPx = 0,
  className = 'w-full bg-white',
  style,
}: HomePageSectionProps) {
  return (
    <HomeSectionShell offsetTopPx={offsetTopPx} className={className} style={style}>
      <HomeSectionContent>{children}</HomeSectionContent>
    </HomeSectionShell>
  );
}
