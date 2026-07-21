/** Match Mobee production confirm dialog motion (storefront dialog modal). */
export const ADMIN_DELETE_MODAL_PANEL_OUT_MS = 280;
/** Slightly above out duration so unmount still happens if `animationend` is missed. */
export const ADMIN_DELETE_MODAL_EXIT_FALLBACK_MS = ADMIN_DELETE_MODAL_PANEL_OUT_MS + 40;

export const ADMIN_DELETE_MODAL_Z_INDEX = 100;

export const ADMIN_DELETE_MODAL_BACKDROP_IN_CLASS = 'animate-admin-delete-modal-backdrop-in';
export const ADMIN_DELETE_MODAL_BACKDROP_OUT_CLASS = 'animate-admin-delete-modal-backdrop-out';
export const ADMIN_DELETE_MODAL_PANEL_IN_CLASS = 'animate-admin-delete-modal-panel-in';
export const ADMIN_DELETE_MODAL_PANEL_OUT_CLASS = 'animate-admin-delete-modal-panel-out';

/** Animation name substring used by `onAnimationEnd` to finish exit. */
export const ADMIN_DELETE_MODAL_PANEL_OUT_ANIMATION_NAME = 'admin-delete-modal-panel-out';
