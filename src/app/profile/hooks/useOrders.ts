import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { openCartDrawer } from '../../../lib/cart-drawer';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import {
  REORDER_CART_DRAWER_DELAY_MS,
  REORDER_SUCCESS_ALERT_DELAY_MS,
} from '../../../constants/profile-desktop-page';
import type { OrderDetails, OrderListItem, ProfileTab } from '../types';
import { createOrderDetailsPreview, type OrderDetailsClickPreview } from '../order-details-preview';
import { logger } from "@/lib/utils/logger";

interface OrdersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseOrdersProps {
  isLoggedIn: boolean;
  authLoading: boolean;
  activeTab: ProfileTab;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function useOrders({
  isLoggedIn,
  authLoading,
  activeTab,
  onError,
  onSuccess,
}: UseOrdersProps) {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersMeta, setOrdersMeta] = useState<OrdersMeta | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsError, setOrderDetailsError] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      onError('');
      const response = await apiClient.get<{
        data: OrderListItem[];
        meta: OrdersMeta;
      }>('/api/v1/orders', {
        params: {
          page: ordersPage.toString(),
          limit: '20',
        },
      });
      setOrders(response.data || []);
      setOrdersMeta(response.meta || null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error loading orders:', err);
      onError(errorMessage || t('profile.orders.failedToLoad'));
    } finally {
      setOrdersLoading(false);
    }
  }, [ordersPage, t, onError]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (isLoggedIn && !authLoading && activeTab === 'orders') {
      loadOrders();
    }
  }, [isLoggedIn, authLoading, activeTab, loadOrders]);

  const fetchOrderDetails = async (orderNumber: string) => {
    try {
      const data = await apiClient.get<OrderDetails>(`/api/v1/orders/${orderNumber}`);
      setSelectedOrder(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error loading order details:', err);
      setOrderDetailsError(errorMessage || t('profile.orderDetails.failedToLoad'));
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleOrderClick = (order: OrderDetailsClickPreview, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedOrder(createOrderDetailsPreview(order));
    setOrderDetailsLoading(true);
    setOrderDetailsError(null);
    void fetchOrderDetails(order.number);
  };

  const closeOrderDetails = useCallback(() => {
    setSelectedOrder(null);
    setOrderDetailsLoading(false);
    setOrderDetailsError(null);
  }, []);

  const handleReOrder = async () => {
    if (!selectedOrder || !isLoggedIn) {
      router.push('/login?redirect=/profile?tab=orders');
      return;
    }

    setIsReordering(true);
    try {
      logger.debug('[Profile][ReOrder] Starting re-order for order:', selectedOrder.number);
      
      let addedCount = 0;
      let skippedCount = 0;

      for (const item of selectedOrder.items) {
        try {
          interface VariantDetails {
            id: string;
            productId: string;
            stock: number;
            available: boolean;
          }

          const variantDetails = await apiClient.get<VariantDetails>(`/api/v1/products/variants/${item.variantId}`);
          
          if (!variantDetails.available || variantDetails.stock < item.quantity) {
            console.warn(`[Profile][ReOrder] Item ${item.productTitle} is not available or insufficient stock`);
            skippedCount++;
            continue;
          }

          await apiClient.post('/api/v1/cart/items', {
            productId: variantDetails.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          });
          addedCount++;
          logger.debug('[Profile][ReOrder] Added item to cart:', item.productTitle);
        } catch (error: unknown) {
          console.error('[Profile][ReOrder] Error adding item to cart:', error);
          skippedCount++;
        }
      }

      window.dispatchEvent(new Event('cart-updated'));

      if (addedCount > 0) {
        const skippedText = skippedCount > 0 ? `, ${skippedCount} ${t('profile.orderDetails.skipped')}` : '';
        const successMessage = `${addedCount} ${t('profile.orderDetails.itemsAdded')}${skippedText}`;
        closeOrderDetails();
        window.setTimeout(() => {
          onSuccess(successMessage);
        }, REORDER_SUCCESS_ALERT_DELAY_MS);
        window.setTimeout(() => {
          openCartDrawer();
        }, REORDER_SUCCESS_ALERT_DELAY_MS + REORDER_CART_DRAWER_DELAY_MS);
      } else {
        closeOrderDetails();
        window.setTimeout(() => {
          onError(t('profile.orderDetails.failedToAdd'));
        }, REORDER_SUCCESS_ALERT_DELAY_MS);
      }
    } catch (error: unknown) {
      console.error('[Profile][ReOrder] Error during re-order:', error);
      closeOrderDetails();
      window.setTimeout(() => {
        onError(t('profile.orderDetails.failedToAdd'));
      }, REORDER_SUCCESS_ALERT_DELAY_MS);
    } finally {
      setIsReordering(false);
    }
  };

  return {
    orders,
    ordersLoading,
    ordersPage,
    setOrdersPage,
    ordersMeta,
    selectedOrder,
    orderDetailsLoading,
    orderDetailsError,
    isReordering,
    handleOrderClick,
    closeOrderDetails,
    handleReOrder,
  };
}

