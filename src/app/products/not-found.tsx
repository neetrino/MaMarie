'use client';

import { DesktopFluidFrame } from '../../components/DesktopFluidFrame';
import { NotFoundPageContent } from '../../components/not-found/NotFoundPageContent';

/**
 * 404 for /products/* — same clay page as the root not-found.
 * MainContent adds navbar clearance when `.not-found-page` is present.
 */
export default function ProductsNotFound() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DesktopFluidFrame
        className="flex min-h-0 flex-1 flex-col"
        stageClassName="flex min-h-0 flex-1 flex-col"
      >
        <NotFoundPageContent />
      </DesktopFluidFrame>
    </div>
  );
}
