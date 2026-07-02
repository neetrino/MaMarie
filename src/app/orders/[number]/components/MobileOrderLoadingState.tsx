'use client';

import { MobileHomeSearchField } from '../../../../components/home/mobile/MobileHomeSearchField';
import { MOBILE_ORDER_SEARCH_TO_HERO_GAP_PX } from '../../../../constants/mobile-orders';
import { MobileOrderPageShell } from './MobileOrderPageShell';

export function MobileOrderLoadingState() {
  return (
    <MobileOrderPageShell>
      <MobileHomeSearchField />
      <div className="mx-auto mt-10 w-full max-w-[328px] animate-pulse" style={{ marginTop: MOBILE_ORDER_SEARCH_TO_HERO_GAP_PX }}>
        <div
          className="mx-auto rounded-3xl bg-white/70"
          style={{ width: 313, height: 302, maxWidth: '100%' }}
        />
        <div className="mx-auto mt-4 h-14 max-w-[284px] rounded-lg bg-white/70" />
        <div className="mx-auto mt-2 h-4 max-w-[200px] rounded bg-white/70" />
        <div className="mt-9 h-[50px] w-full rounded-full bg-white/70" />
      </div>
    </MobileOrderPageShell>
  );
}
