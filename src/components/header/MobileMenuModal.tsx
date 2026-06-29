'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getNavLinkTranslationKey,
  isNavLinkActive,
  MOBILE_MENU_CTA,
  type NavLinkItem,
} from '../../constants/nav-links';
import {
  MOBILE_NAV_DROPDOWN_GAP_PX,
  MOBILE_NAV_DROPDOWN_TOP_PX,
  MOBILE_NAV_MENU_EXIT_ANIMATION_MS,
  MOBILE_NAV_MENU_PANEL_Z_INDEX,
  MOBILE_NAV_MENU_SCRIM_Z_INDEX,
} from '../../constants/header';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/body-scroll-lock';
import { useTranslation } from '../../lib/i18n-client';
import styles from './MobileMenuModal.module.css';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: readonly NavLinkItem[];
  menuId: string;
}

function joinClasses(...classes: ReadonlyArray<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Full-screen mobile nav modal — portal, scrim, rounded panel, exit animation. */
export function MobileMenuModal({ isOpen, onClose, navLinks, menuId }: MobileMenuModalProps) {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openModal = useCallback(() => {
    clearCloseTimer();
    setIsExpanded(false);
    setIsRendered(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsExpanded(true);
      });
    });
  }, [clearCloseTimer]);

  const closeModal = useCallback(() => {
    clearCloseTimer();
    setIsExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      closeTimerRef.current = null;
    }, MOBILE_NAV_MENU_EXIT_ANIMATION_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    setMounted(true);
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  useEffect(() => {
    if (isOpen) {
      openModal();
      return;
    }
    if (isRendered) {
      closeModal();
    }
  }, [closeModal, isOpen, isRendered, openModal]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const panel = panelRef.current;
      if (panel?.contains(target)) {
        return;
      }

      const siteHeader = document.querySelector('[data-site-header]');
      if (siteHeader?.contains(target)) {
        return;
      }

      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockBodyScroll();
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, onClose]);

  if (!mounted || !isRendered) {
    return null;
  }

  return createPortal(
    <div
      className={joinClasses(
        styles.mobileOnly,
        styles.modalRoot,
        isExpanded && styles.modalRootLocked,
      )}
      style={{
        ['--mobile-menu-top' as string]: `${MOBILE_NAV_DROPDOWN_TOP_PX}px`,
        ['--mobile-menu-gap' as string]: `${MOBILE_NAV_DROPDOWN_GAP_PX}px`,
        ['--mobile-menu-scrim-z' as string]: String(MOBILE_NAV_MENU_SCRIM_Z_INDEX),
        ['--mobile-menu-panel-z' as string]: String(MOBILE_NAV_MENU_PANEL_Z_INDEX),
      }}
    >
      <button
        type="button"
        aria-label={t('common.buttons.close')}
        className={joinClasses(styles.scrim, isExpanded && styles.scrimExpanded)}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={t('common.navigation.mainNavigation')}
        className={joinClasses(styles.panel, isExpanded && styles.panelExpanded)}
      >
        <nav aria-label={t('common.navigation.mainNavigation')} className={styles.panelBody}>
          <div className={styles.linkList}>
            {navLinks.map(({ href, labelKey }) => {
              const active = isNavLinkActive(labelKey, pathname);

              return (
                <Link
                  key={labelKey}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={joinClasses(styles.navLink, active && styles.navLinkActive)}
                >
                  {t(getNavLinkTranslationKey(labelKey))}
                </Link>
              );
            })}
          </div>

          <div className={styles.ctaSection}>
            <Link
              href={MOBILE_MENU_CTA.href}
              onClick={onClose}
              className={styles.ctaButton}
            >
              {t(MOBILE_MENU_CTA.translationKey)}
            </Link>
          </div>
        </nav>
      </div>
    </div>,
    document.body,
  );
}
