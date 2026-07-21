'use client';

import { NotFoundPageContent } from '../components/not-found/NotFoundPageContent';

/** Custom 404 — clay illustration below the public navbar (white clearance, not under the bar). */
export default function NotFound() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <NotFoundPageContent />
    </div>
  );
}
