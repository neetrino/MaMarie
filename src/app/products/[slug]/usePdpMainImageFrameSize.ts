'use client';

import { useEffect, useState, type RefObject } from 'react';
import { resolveContainedFrameSizePx } from '../../../lib/resolve-contained-frame-size';
import {
  PRODUCT_PDP_MAIN_IMAGE_MAX_HEIGHT_PX,
  PRODUCT_PDP_MAIN_IMAGE_MAX_WIDTH_PX,
  PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_HEIGHT_PX,
  PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_WIDTH_PX,
} from './constants';

interface ContainedImageFrameSize {
  widthPx: number;
  heightPx: number;
  isDesktopViewport: boolean;
}

/** Fits the PDP main photo into the available column without mobile letterboxing. */
export function usePdpMainImageFrameSize(
  wrapperRef: RefObject<HTMLElement | null>,
  imageAspectRatio: number,
): ContainedImageFrameSize {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [availableWidthPx, setAvailableWidthPx] = useState<number | null>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const syncViewport = () => {
      setIsDesktopViewport(desktopQuery.matches);
    };
    syncViewport();
    desktopQuery.addEventListener('change', syncViewport);
    return () => desktopQuery.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const syncWidth = () => {
      const nextWidth = Math.round(wrapper.getBoundingClientRect().width);
      setAvailableWidthPx(nextWidth > 0 ? nextWidth : null);
    };

    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [wrapperRef]);

  const mobileMaxWidthPx =
    availableWidthPx != null
      ? Math.min(PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_WIDTH_PX, availableWidthPx)
      : PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_WIDTH_PX;

  const frameSize = resolveContainedFrameSizePx(
    imageAspectRatio,
    isDesktopViewport ? PRODUCT_PDP_MAIN_IMAGE_MAX_WIDTH_PX : mobileMaxWidthPx,
    isDesktopViewport
      ? PRODUCT_PDP_MAIN_IMAGE_MAX_HEIGHT_PX
      : PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_HEIGHT_PX,
  );

  return {
    widthPx: frameSize.widthPx,
    heightPx: frameSize.heightPx,
    isDesktopViewport,
  };
}
