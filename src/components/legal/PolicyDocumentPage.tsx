'use client';

import type { ReactNode } from 'react';
import {
  LEGAL_POLICY_DOCUMENT_BODY_WRAP_CLASS,
  LEGAL_POLICY_DOCUMENT_INNER_CLASS,
  LEGAL_POLICY_DOCUMENT_META_CLASS,
  LEGAL_POLICY_DOCUMENT_SHELL_CLASS,
  LEGAL_POLICY_DOCUMENT_TITLE_CLASS,
} from '../../constants/legal-policy-sheet';

interface PolicyDocumentPageProps {
  title: string;
  lastUpdatedLabel: string;
  children: ReactNode;
}

/** Shared shell for standalone policy routes — matches brand legal hub chrome. */
export function PolicyDocumentPage({
  title,
  lastUpdatedLabel,
  children,
}: PolicyDocumentPageProps) {
  const lastUpdatedDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={LEGAL_POLICY_DOCUMENT_SHELL_CLASS}>
      <div className={LEGAL_POLICY_DOCUMENT_INNER_CLASS}>
        <h1 className={LEGAL_POLICY_DOCUMENT_TITLE_CLASS}>{title}</h1>
        <p className={LEGAL_POLICY_DOCUMENT_META_CLASS}>
          {lastUpdatedLabel} {lastUpdatedDate}
        </p>
        <div className={LEGAL_POLICY_DOCUMENT_BODY_WRAP_CLASS}>{children}</div>
      </div>
    </div>
  );
}
