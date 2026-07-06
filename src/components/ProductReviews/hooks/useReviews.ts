'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import type { Review } from '../utils';
import { logger } from "@/lib/utils/logger";

/**
 * Hook for fetching and managing reviews
 */
export function useReviews(
  productId?: string,
  productSlug?: string,
  initialReviews?: Review[],
) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(initialReviews === undefined);
  const hasInitialReviews = initialReviews !== undefined;

  useEffect(() => {
    if (initialReviews !== undefined) {
      setReviews(initialReviews);
      setLoading(false);
    }
  }, [initialReviews]);

  const loadReviews = async () => {
    try {
      const identifier = productSlug || productId;
      if (!identifier) {
        setReviews([]);
        setLoading(false);
        return;
      }

      logger.debug('📝 [PRODUCT REVIEWS] Loading reviews for product:', identifier);
      setLoading(true);
      const data = await apiClient.get<Review[]>(`/api/v1/products/${identifier}/reviews`);
      logger.debug('✅ [PRODUCT REVIEWS] Reviews loaded:', data?.length || 0);
      setReviews(data || []);
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err.status !== 404) {
        logger.warn('Failed to load reviews', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId && !productSlug) {
      return;
    }

    if (!hasInitialReviews) {
      void loadReviews();
    }

    const handleReviewUpdate = () => {
      void loadReviews();
    };

    window.addEventListener('review-updated', handleReviewUpdate);
    return () => window.removeEventListener('review-updated', handleReviewUpdate);
  }, [productId, productSlug, hasInitialReviews]);

  return {
    reviews,
    loading,
    setReviews,
    loadReviews,
  };
}
