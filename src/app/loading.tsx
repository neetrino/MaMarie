import { BRAND_LOADING_SPINNER_CLASS } from '../constants/brand';

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-white" aria-busy="true" aria-label="Loading">
      <div className={`h-10 w-10 ${BRAND_LOADING_SPINNER_CLASS}`} />
    </div>
  );
}
