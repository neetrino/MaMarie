'use client';

import { Button } from '@shop/ui';
import type { ComponentProps, ReactNode } from 'react';
import {
  ADMIN_OUTLINE_BUTTON_CLASS,
  ADMIN_PRIMARY_BUTTON_CLASS,
} from '../../../constants/admin-ui-classes';

type SideSheetButtonProps = ComponentProps<typeof Button>;

export function AdminSideSheetFooter({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-3">{children}</div>;
}

export function AdminSideSheetPrimaryButton({ className = '', ...props }: SideSheetButtonProps) {
  return (
    <Button
      variant="primary"
      className={[ADMIN_PRIMARY_BUTTON_CLASS, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

export function AdminSideSheetCancelButton({ className = '', ...props }: SideSheetButtonProps) {
  return (
    <Button
      variant="outline"
      className={[ADMIN_OUTLINE_BUTTON_CLASS, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
