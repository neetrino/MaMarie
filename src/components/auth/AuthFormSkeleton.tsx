/** Placeholder while auth forms defer mount — avoids mobile autofill hydration mismatches. */
export function AuthFormSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-5" aria-hidden>
      <div className="h-[52px] rounded-full bg-white/80" />
      <div className="h-[52px] rounded-full bg-white/80" />
      <div className="h-14 rounded-full bg-brand-pink/40" />
    </div>
  );
}
