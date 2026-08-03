'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  CONFIRM_DELETE_MODAL_BACKDROP_IN_CLASS,
  CONFIRM_DELETE_MODAL_BACKDROP_OUT_CLASS,
  CONFIRM_DELETE_MODAL_EXIT_FALLBACK_MS,
  CONFIRM_DELETE_MODAL_PANEL_IN_CLASS,
  CONFIRM_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
  CONFIRM_DELETE_MODAL_PANEL_OUT_CLASS,
} from '../../../constants/confirm-delete-modal';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import { useAnimatedModalDismiss } from '../../../lib/use-animated-modal-dismiss';
import {
  PRODUCT_PDP_IMAGE_ZOOM_CLOSE_BUTTON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_INSET_PX,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_ICON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_PANEL_PADDING_PX,
  PRODUCT_PDP_IMAGE_ZOOM_PANEL_RADIUS_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_Z_INDEX,
} from './constants';

interface ProductImageZoomOverlayProps {
  isOpen: boolean;
  src: string;
  alt: string;
  language: LanguageCode;
  onClose: () => void;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

/** Body-portaled product image modal — same enter/exit motion as delete confirmation. */
export function ProductImageZoomOverlay({
  isOpen,
  src,
  alt,
  language,
  onClose,
  showNavigation = false,
  onPrevious,
  onNext,
}: ProductImageZoomOverlayProps) {
  const onCloseRef = useRef(onClose);
  const onPreviousRef = useRef(onPrevious);
  const onNextRef = useRef(onNext);
  onCloseRef.current = onClose;
  onPreviousRef.current = onPrevious;
  onNextRef.current = onNext;

  const {
    isVisible,
    isExiting,
    handlePanelAnimationEnd,
    backdropMotionClass,
    panelMotionClass,
  } = useAnimatedModalDismiss({
    isOpen,
    panelOutAnimationName: CONFIRM_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME,
    exitFallbackMs: CONFIRM_DELETE_MODAL_EXIT_FALLBACK_MS,
    backdropInClass: CONFIRM_DELETE_MODAL_BACKDROP_IN_CLASS,
    backdropOutClass: CONFIRM_DELETE_MODAL_BACKDROP_OUT_CLASS,
    panelInClass: CONFIRM_DELETE_MODAL_PANEL_IN_CLASS,
    panelOutClass: CONFIRM_DELETE_MODAL_PANEL_OUT_CLASS,
  });

  const [cached, setCached] = useState({ src, alt });

  useEffect(() => {
    if (!isOpen || !src) {
      return;
    }
    setCached({ src, alt });
  }, [isOpen, src, alt]);

  useEffect(() => {
    if (!isVisible || isExiting) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key === 'ArrowLeft') {
        onPreviousRef.current?.();
        return;
      }
      if (event.key === 'ArrowRight') {
        onNextRef.current?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, isExiting]);

  if (!isVisible || typeof document === 'undefined') {
    return null;
  }

  const insetTotalPx = PRODUCT_PDP_IMAGE_ZOOM_INSET_PX * 2;
  const closeLabel = t(language, 'common.buttons.close');

  const shellStyle: CSSProperties = {
    zIndex: PRODUCT_PDP_IMAGE_ZOOM_Z_INDEX,
    padding: PRODUCT_PDP_IMAGE_ZOOM_INSET_PX,
  };

  const panelStyle: CSSProperties = {
    width: `calc(100vw - ${insetTotalPx}px)`,
    height: `calc(100vh - ${insetTotalPx}px)`,
    padding: PRODUCT_PDP_IMAGE_ZOOM_PANEL_PADDING_PX,
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={shellStyle}
      role="presentation"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={closeLabel}
        className={`absolute inset-0 cursor-default rounded-none bg-black/40 ${backdropMotionClass}`}
        disabled={isExiting}
        onClick={() => {
          if (!isExiting) {
            onCloseRef.current();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(language, 'common.ariaLabels.fullscreenImage')}
        className={`relative flex items-center justify-center border border-gray-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] ${PRODUCT_PDP_IMAGE_ZOOM_PANEL_RADIUS_CLASS} ${panelMotionClass}`}
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <button
          type="button"
          className={PRODUCT_PDP_IMAGE_ZOOM_CLOSE_BUTTON_CLASS}
          aria-label={closeLabel}
          disabled={isExiting}
          onClick={() => onCloseRef.current()}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {showNavigation ? (
          <>
            <button
              type="button"
              className={`${PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_CLASS} ${PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_LEFT_CLASS}`}
              aria-label={t(language, 'common.ariaLabels.previousImage')}
              disabled={isExiting}
              onClick={() => onPreviousRef.current?.()}
            >
              <ChevronLeft aria-hidden className={PRODUCT_PDP_IMAGE_ZOOM_NAV_ICON_CLASS} />
            </button>
            <button
              type="button"
              className={`${PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_CLASS} ${PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_RIGHT_CLASS}`}
              aria-label={t(language, 'common.ariaLabels.nextImage')}
              disabled={isExiting}
              onClick={() => onNextRef.current?.()}
            >
              <ChevronRight aria-hidden className={PRODUCT_PDP_IMAGE_ZOOM_NAV_ICON_CLASS} />
            </button>
          </>
        ) : null}

        <img
          src={cached.src}
          alt={cached.alt}
          className="h-full w-full object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
