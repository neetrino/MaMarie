'use client';

import { OrderPageShell } from './OrderPageShell';

export function OrderPageLoadingState() {
  return (
    <OrderPageShell>
      <div className="mx-auto w-full max-w-[328px] animate-pulse">
        <div
          className="mx-auto rounded-3xl bg-white/70"
          style={{ width: 313, height: 302, maxWidth: '100%' }}
        />
        <div className="mx-auto mt-4 h-14 max-w-[284px] rounded-lg bg-white/70" />
        <div className="mx-auto mt-2 h-4 max-w-[200px] rounded bg-white/70" />
        <div className="mx-auto mt-9 h-[50px] max-w-[220px] rounded-full bg-white/70" />
      </div>
    </OrderPageShell>
  );
}
