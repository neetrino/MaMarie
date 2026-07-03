export default function CheckoutLoading() {
  return (
    <div
      className="flex items-center justify-center bg-[#f1f1f3] py-24 lg:bg-white"
      aria-busy="true"
      aria-label="Loading checkout"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-pink/30 border-t-brand-pink" />
    </div>
  );
}
