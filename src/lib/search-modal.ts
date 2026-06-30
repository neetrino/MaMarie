import { SEARCH_MODAL_CLOSE_EVENT, SEARCH_MODAL_OPEN_EVENT } from '../constants/search-modal';

/** Opens the global product search modal. */
export function openSearchModal(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(SEARCH_MODAL_OPEN_EVENT));
}

/** Closes the global product search modal. */
export function closeSearchModal(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(SEARCH_MODAL_CLOSE_EVENT));
}
