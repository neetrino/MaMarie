import { BRAND_LOADING_SPINNER_CLASS } from '../../constants/brand';

export default function ProductsLoading() {
  return (
    <div className="flex items-center justify-center py-24" aria-busy="true" aria-label="Loading products">
      <div className={`h-10 w-10 ${BRAND_LOADING_SPINNER_CLASS}`} />
    </div>
  );
}
