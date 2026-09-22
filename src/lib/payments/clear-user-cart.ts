import { db } from '@white-shop/db';
import { logger } from '@/lib/utils/logger';

/**
 * Clears the logged-in user's cart after confirmed payment.
 */
export async function clearUserCartByUserId(userId: string): Promise<void> {
  try {
    await db.cart.deleteMany({ where: { userId } });
    logger.info('Cart cleared after paid order', { userId });
  } catch (error: unknown) {
    logger.error('Failed to clear cart after payment', { userId, error });
  }
}
