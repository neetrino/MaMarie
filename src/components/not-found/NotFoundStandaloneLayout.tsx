import { NotFoundPageContent } from './NotFoundPageContent';

/** Full-viewport 404 for routes without the public navbar (admin, etc.). */
export function NotFoundStandaloneLayout() {
  return (
    <div className="not-found-standalone-shell fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-white">
      <NotFoundPageContent layout="standalone" />
    </div>
  );
}
