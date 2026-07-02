'use client';

import { MobileHomeSearchField } from '../../../../components/home/mobile/MobileHomeSearchField';
import {
  MOBILE_ORDER_DETAILS_SECTION_GAP_PX,
  MOBILE_ORDER_DETAILS_SECTION_ID,
  MOBILE_ORDER_RECEIPT_SECTION_ID,
} from '../../../../constants/mobile-orders';
import type { Order } from '../types';
import { OrderItems } from './OrderItems';
import { OrderPageShell } from './OrderPageShell';
import styles from './OrderPageShell.module.css';
import { OrderReadyHero } from './OrderReadyHero';
import { ShippingAddress } from './ShippingAddress';

interface OrderPageContentProps {
  order: Order;
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
}

export function OrderPageContent({ order, currency }: OrderPageContentProps) {
  return (
    <OrderPageShell>
      <div className="lg:hidden">
        <MobileHomeSearchField />
      </div>
      <div className={styles.heroOffset}>
        <OrderReadyHero order={order} />
      </div>

      <section
        id={MOBILE_ORDER_DETAILS_SECTION_ID}
        className={`flex w-full flex-col ${styles.detailsOffset}`}
        style={{ gap: MOBILE_ORDER_DETAILS_SECTION_GAP_PX }}
      >
        <div id={MOBILE_ORDER_RECEIPT_SECTION_ID} className={styles.receiptScrollTarget}>
          <OrderItems
            items={order.items}
            currency={currency}
            presentation="highlight"
            orderTotals={order.totals}
          />
        </div>
        {order.shippingAddress && <ShippingAddress shippingAddress={order.shippingAddress} />}
      </section>
    </OrderPageShell>
  );
}
