'use client';

import type { FormEvent } from 'react';
import { BrandPillButton } from '../BrandPillButton';
import { useTranslation } from '../../lib/i18n-client';
import { ReviewRating } from './ReviewRating';

interface ReviewFormProps {
  rating: number;
  hoveredRating: number;
  comment: string;
  submitting: boolean;
  editingReviewId: string | null;
  onRatingChange: (rating: number) => void;
  onHover: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

/**
 * Review form component
 */
export function ReviewForm({
  rating,
  hoveredRating,
  comment,
  submitting,
  editingReviewId,
  onRatingChange,
  onHover,
  onCommentChange,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {editingReviewId
          ? t('common.reviews.updateYourReview')
          : t('common.reviews.writeReview')}
      </h3>

      {/* Rating Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.reviews.rating')} *
        </label>
        <ReviewRating
          rating={rating}
          hoveredRating={hoveredRating}
          onRatingChange={onRatingChange}
          onHover={onHover}
          size="lg"
          interactive
        />
      </div>

      {/* Comment Textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.reviews.comment')} *
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={5}
          className="w-full rounded-[15px] border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-pink"
          placeholder={t('common.reviews.commentPlaceholder')}
          required
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-3">
        <BrandPillButton
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? t('common.reviews.submitting')
            : editingReviewId
              ? t('common.reviews.updateReview')
              : t('common.reviews.submitReview')}
        </BrandPillButton>
        <BrandPillButton
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          {t('common.buttons.cancel')}
        </BrandPillButton>
      </div>
    </form>
  );
}




