'use client';

import { MobileHomeSearchField } from '../../../../components/home/mobile/MobileHomeSearchField';
import {
  MOBILE_ORDER_DETAILS_SECTION_GAP_PX,
  MOBILE_ORDER_DETAILS_SECTION_ID,
  MOBILE_ORDER_SEARCH_TO_HERO_GAP_PX,
} from '../../../../constants/mobile-orders';
import type { Order } from '../types';
import { MobileOrderPageShell } from './MobileOrderPageShell';
import { MobileOrderReadyHero } from './MobileOrderReadyHero';
import { OrderHelpCard } from './OrderHelpCard';
import { OrderItems } from './OrderItems';
import { OrderSuccessFooterActions } from './OrderSuccessFooterActions';
import { ShippingAddress } from './ShippingAddress';

interface MobileOrderPageContentProps {
  order: Order;
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
}

export function MobileOrderPageContent({ order, currency }: MobileOrderPageContentProps) {
  return (
    <MobileOrderPageShell>
      <MobileHomeSearchField />
      <div style={{ marginTop: MOBILE_ORDER_SEARCH_TO_HERO_GAP_PX }}>
        <MobileOrderReadyHero order={order} />
      </div>

      <section
        id={MOBILE_ORDER_DETAILS_SECTION_ID}
        className="flex w-full flex-col scroll-mt-6"
        style={{
          marginTop: MOBILE_ORDER_SEARCH_TO_HERO_GAP_PX,
          gap: MOBILE_ORDER_DETAILS_SECTION_GAP_PX,
        }}
      >
        <OrderItems
          items={order.items}
          currency={currency}
          presentation="highlight"
          orderTotals={order.totals}
        />
        <OrderHelpCard />
        <OrderSuccessFooterActions />
        {order.shippingAddress && <ShippingAddress shippingAddress={order.shippingAddress} />}
      </section>
    </MobileOrderPageShell>
  );
}
