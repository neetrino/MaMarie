'use client';

import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
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
  PRODUCT_PDP_IMAGE_ZOOM_CLOSE_ICON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_DESKTOP_MEDIA_QUERY,
  PRODUCT_PDP_IMAGE_ZOOM_INSET_PX,
  PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_X_PX,
  PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_Y_PX,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_NAV_ICON_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_PANEL_PADDING_PX,
  PRODUCT_PDP_IMAGE_ZOOM_PANEL_RADIUS_CLASS,
  PRODUCT_PDP_IMAGE_ZOOM_Z_INDEX,
} from './constants';
import { resolveProductImageZoomSwipeDirection } from './resolve-product-image-zoom-swipe';

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

interface ZoomLayoutInsets {
  insetX: number;
  insetY: number;
}

interface TouchPoint {
  x: number;
  y: number;
}

function getZoomLayoutInsets(isDesktop: boolean): ZoomLayoutInsets {
  if (isDesktop) {
    return {
      insetX: PRODUCT_PDP_IMAGE_ZOOM_INSET_PX,
      insetY: PRODUCT_PDP_IMAGE_ZOOM_INSET_PX,
    };
  }

  return {
    insetX: PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_X_PX,
    insetY: PRODUCT_PDP_IMAGE_ZOOM_MOBILE_INSET_Y_PX,
  };
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
  const showNavigationRef = useRef(showNavigation);
  const touchStartRef = useRef<TouchPoint | null>(null);
  onCloseRef.current = onClose;
  onPreviousRef.current = onPrevious;
  onNextRef.current = onNext;
  showNavigationRef.current = showNavigation;

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
  const [layout, setLayout] = useState<ZoomLayoutInsets>(() =>
    getZoomLayoutInsets(false),
  );

  useEffect(() => {
    if (!isOpen || !src) {
      return;
    }
    setCached({ src, alt });
  }, [isOpen, src, alt]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const mediaQuery = window.matchMedia(PRODUCT_PDP_IMAGE_ZOOM_DESKTOP_MEDIA_QUERY);
    const syncLayout = () => {
      setLayout(getZoomLayoutInsets(mediaQuery.matches));
    };

    syncLayout();
    mediaQuery.addEventListener('change', syncLayout);
    return () => {
      mediaQuery.removeEventListener('change', syncLayout);
    };
  }, [isVisible]);

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

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!showNavigationRef.current || isExiting) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!start || !showNavigationRef.current || isExiting) {
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    const direction = resolveProductImageZoomSwipeDirection(start, {
      x: touch.clientX,
      y: touch.clientY,
    });
    if (direction === 'previous') {
      onPreviousRef.current?.();
      return;
    }
    if (direction === 'next') {
      onNextRef.current?.();
    }
  };

  if (!isVisible || typeof document === 'undefined') {
    return null;
  }

  const closeLabel = t(language, 'common.buttons.close');

  const shellStyle: CSSProperties = {
    zIndex: PRODUCT_PDP_IMAGE_ZOOM_Z_INDEX,
    paddingLeft: layout.insetX,
    paddingRight: layout.insetX,
    paddingTop: layout.insetY,
    paddingBottom: layout.insetY,
  };

  const panelStyle: CSSProperties = {
    width: `calc(100vw - ${layout.insetX * 2}px)`,
    height: `calc(100vh - ${layout.insetY * 2}px)`,
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
        className={`relative flex touch-pan-y items-center justify-center overflow-hidden border border-gray-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] scrollbar-hide ${PRODUCT_PDP_IMAGE_ZOOM_PANEL_RADIUS_CLASS} ${panelMotionClass}`}
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className={PRODUCT_PDP_IMAGE_ZOOM_CLOSE_BUTTON_CLASS}
          aria-label={closeLabel}
          disabled={isExiting}
          onClick={() => onCloseRef.current()}
        >
          <X className={PRODUCT_PDP_IMAGE_ZOOM_CLOSE_ICON_CLASS} aria-hidden />
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
          className="pointer-events-none h-full w-full select-none object-contain"
          draggable={false}
        />
      </div>
    </div>,
    document.body,
  );
}
