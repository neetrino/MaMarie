import { BRAND_LOADING_SPINNER_CLASS } from '../../constants/brand';

export default function StoresLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-white" aria-busy="true" aria-label="Loading stores">
      <div className={`h-10 w-10 ${BRAND_LOADING_SPINNER_CLASS}`} />
    </div>
  );
}
