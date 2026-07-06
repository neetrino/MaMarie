import { useState, useEffect } from 'react';
import { apiClient } from '../../../../lib/api-client';
import type { Review } from '../../../../components/ProductReviews/utils';
import { calculateAverageRating } from '../../../../components/ProductReviews/utils';

interface UseProductReviewsProps {
  slug: string;
  productId: string | null;
  initialReviews?: Review[];
}

export function useProductReviews({ slug, productId, initialReviews }: UseProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const hasInitialReviews = initialReviews !== undefined;

  useEffect(() => {
    if (initialReviews !== undefined) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  useEffect(() => {
    if (!productId || !slug) {
      return;
    }

    const loadReviews = async () => {
      try {
        const data = await apiClient.get<Review[]>(`/api/v1/products/${slug}/reviews`);
        setReviews(data || []);
      } catch {
        setReviews([]);
      }
    };

    if (!hasInitialReviews) {
      void loadReviews();
    }

    const handleReviewUpdate = () => {
      void loadReviews();
    };

    window.addEventListener('review-updated', handleReviewUpdate);
    return () => window.removeEventListener('review-updated', handleReviewUpdate);
  }, [productId, slug, hasInitialReviews]);

  const averageRating = calculateAverageRating(reviews);

  return { reviews, averageRating };
}
