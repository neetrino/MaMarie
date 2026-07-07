import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import { ensureProductReviewsTable } from "../utils/db-ensure";
import { resolvePublishedProductIdBySlug } from "./products-slug/product-query-builder";
import { logger } from "@/lib/utils/logger";

type ProductReviewWithUser = Prisma.ProductReviewGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;

type ReviewWithRating = { rating: number };

class ReviewsService {
  /**
   * Get all reviews for a product
   * @param productId - Product ID
   * @param options - Query options (published only, sorting, etc.)
   */
  async getProductReviews(productId: string, options?: { publishedOnly?: boolean }) {
    logger.debug('📝 [REVIEWS SERVICE] Getting reviews for product:', productId);

    const where: Prisma.ProductReviewWhereInput = {
      productId,
      ...(options?.publishedOnly !== false ? { published: true } : {}),
    };

    const reviews = await db.productReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.debug(`✅ [REVIEWS SERVICE] Found ${reviews.length} reviews for product ${productId}`);

    // Format response to match frontend expectations
    return reviews.map((review: ProductReviewWithUser) => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.firstName && review.user.lastName
        ? `${review.user.firstName} ${review.user.lastName}`
        : review.user.firstName || review.user.lastName || review.user.email || 'Anonymous',
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt.toISOString(),
      published: review.published,
    }));
  }

  /**
   * Published reviews by storefront slug (light id lookup, safe for parallel SSR with full PDP fetch).
   */
  async getProductReviewsBySlug(
    slug: string,
    options?: { publishedOnly?: boolean },
  ) {
    const productId = await resolvePublishedProductIdBySlug(slug);
    if (!productId) {
      return [];
    }
    return this.getProductReviews(productId, options);
  }

  /**
   * Get user's review for a specific product
   * @param productId - Product ID
   * @param userId - User ID
   * @param includeUnpublished - Whether to include unpublished reviews (default: true)
   */
  async getUserReview(productId: string, userId: string, includeUnpublished: boolean = true) {
    logger.debug('📝 [REVIEWS SERVICE] Getting user review:', { productId, userId });

    const review = await db.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      logger.debug('📝 [REVIEWS SERVICE] No review found for user');
      return null;
    }

    // If includeUnpublished is false, only return published reviews
    if (!includeUnpublished && !review.published) {
      logger.debug('📝 [REVIEWS SERVICE] Review exists but is not published');
      return null;
    }

    logger.debug('✅ [REVIEWS SERVICE] Found user review:', review.id);

    // Format response to match frontend expectations
    return {
      id: review.id,
      userId: review.userId,
      userName: review.user.firstName && review.user.lastName
        ? `${review.user.firstName} ${review.user.lastName}`
        : review.user.firstName || review.user.lastName || review.user.email || 'Anonymous',
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt.toISOString(),
      published: review.published,
    };
  }

  /**
   * Get review statistics for a product
   * @param productId - Product ID
   */
  async getProductReviewStats(productId: string) {
    const reviews = await db.productReview.findMany({
      where: {
        productId,
        published: true,
      },
      select: {
        rating: true,
      },
    });

    const total = reviews.length;
    const average = total > 0
      ? reviews.reduce((sum: number, r: ReviewWithRating) => sum + r.rating, 0) / total
      : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r: ReviewWithRating) => r.rating === star).length,
      percentage: total > 0
        ? (reviews.filter((r: ReviewWithRating) => r.rating === star).length / total) * 100
        : 0,
    }));

    return {
      total,
      average: Number(average.toFixed(1)),
      distribution,
    };
  }

  /**
   * Get published review stats for multiple products in one query.
   */
  async getProductReviewStatsBatch(
    productIds: string[]
  ): Promise<Map<string, { averageRating: number; reviewsCount: number }>> {
    if (productIds.length === 0) {
      return new Map();
    }

    const groups = await db.productReview.groupBy({
      by: ['productId'],
      where: {
        productId: { in: productIds },
        published: true,
      },
      _avg: { rating: true },
      _count: { _all: true },
    });

    const stats = new Map<string, { averageRating: number; reviewsCount: number }>();

    groups.forEach((group) => {
      const average = group._avg.rating ?? 0;
      stats.set(group.productId, {
        averageRating: average > 0 ? Number(average.toFixed(1)) : 0,
        reviewsCount: group._count._all,
      });
    });

    return stats;
  }

  /**
   * Create a new review for a product
   * @param productId - Product ID
   * @param userId - User ID
   * @param data - Review data (rating, comment)
   */
  async createReview(productId: string, userId: string, data: { rating: number; comment?: string }) {
    // Ensure table exists before creating review
    await ensureProductReviewsTable();
    
    logger.debug('📝 [REVIEWS SERVICE] Creating review:', { productId, userId, rating: data.rating });

    // Validate rating
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "Rating must be between 1 and 5",
      };
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Product not found",
        detail: `Product with ID ${productId} does not exist`,
      };
    }

    // Check if user already reviewed this product
    const existingReview = await db.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw {
        status: 409,
        type: "https://api.shop.am/problems/conflict",
        title: "Review already exists",
        detail: "You have already reviewed this product. You can update your existing review.",
      };
    }

    // Create review
    const review = await db.productReview.create({
      data: {
        productId,
        userId,
        rating: data.rating,
        comment: data.comment?.trim() || null,
        published: true,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.debug('✅ [REVIEWS SERVICE] Review created:', review.id);

    // Format response
    return {
      id: review.id,
      userId: review.userId,
      userName: review.user.firstName && review.user.lastName
        ? `${review.user.firstName} ${review.user.lastName}`
        : review.user.firstName || review.user.lastName || review.user.email || 'Anonymous',
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt.toISOString(),
      published: review.published,
    };
  }

  /**
   * Update an existing review
   * @param reviewId - Review ID
   * @param userId - User ID (to verify ownership)
   * @param data - Updated review data
   */
  async updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
    // Ensure table exists before updating
    await ensureProductReviewsTable();
    
    // Find review and verify ownership
    const review = await db.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Review not found",
      };
    }

    if (review.userId !== userId) {
      throw {
        status: 403,
        type: "https://api.shop.am/problems/forbidden",
        title: "Forbidden",
        detail: "You can only update your own reviews",
      };
    }

    // Validate rating if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "Rating must be between 1 and 5",
      };
    }

    // Update review
    const updated = await db.productReview.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment?.trim() || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      userName: updated.user.firstName && updated.user.lastName
        ? `${updated.user.firstName} ${updated.user.lastName}`
        : updated.user.firstName || updated.user.lastName || updated.user.email || 'Anonymous',
      rating: updated.rating,
      comment: updated.comment || '',
      createdAt: updated.createdAt.toISOString(),
      published: updated.published,
    };
  }

  /**
   * Delete a review
   * @param reviewId - Review ID
   * @param userId - User ID (to verify ownership)
   */
  async deleteReview(reviewId: string, userId: string) {
    // Ensure table exists before deleting
    await ensureProductReviewsTable();
    
    // Find review and verify ownership
    const review = await db.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Review not found",
      };
    }

    if (review.userId !== userId) {
      throw {
        status: 403,
        type: "https://api.shop.am/problems/forbidden",
        title: "Forbidden",
        detail: "You can only delete your own reviews",
      };
    }

    await db.productReview.delete({
      where: { id: reviewId },
    });

    return { success: true };
  }
}

export const reviewsService = new ReviewsService();

