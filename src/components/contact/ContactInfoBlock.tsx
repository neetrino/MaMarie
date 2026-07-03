import type { ReactNode } from 'react';
import {
  CONTACT_INFO_HEADING_TO_BODY_GAP_PX,
  CONTACT_INFO_ICON_SIZE_PX,
  CONTACT_INFO_ICON_TO_TITLE_GAP_PX,
  CONTACT_INFO_TITLE_FONT_SIZE_PX,
  CONTACT_INFO_TITLE_LINE_HEIGHT_PX,
} from '../../constants/contact-page';
import { ContactInfoIcon } from './ContactInfoIcon';

interface ContactInfoBlockProps {
  iconSrc: string;
  title: string;
  children: ReactNode;
}

/** Icon + title row; body copy aligns with the title column. */
export function ContactInfoBlock({ iconSrc, title, children }: ContactInfoBlockProps) {
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: `${CONTACT_INFO_ICON_SIZE_PX}px minmax(0, 1fr)`,
        columnGap: CONTACT_INFO_ICON_TO_TITLE_GAP_PX,
        rowGap: CONTACT_INFO_HEADING_TO_BODY_GAP_PX,
      }}
    >
      <ContactInfoIcon src={iconSrc} />
      <h3
        className="self-center font-bold text-brand-pink"
        style={{
          fontSize: CONTACT_INFO_TITLE_FONT_SIZE_PX,
          lineHeight: `${CONTACT_INFO_TITLE_LINE_HEIGHT_PX}px`,
        }}
      >
        {title}
      </h3>
      <div className="col-start-2 min-w-0">{children}</div>
    </div>
  );
}
