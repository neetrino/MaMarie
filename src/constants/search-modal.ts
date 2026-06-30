/** Custom event dispatched to open the product search modal. */
export const SEARCH_MODAL_OPEN_EVENT = 'search-modal-open';

/** Custom event dispatched to close the product search modal. */
export const SEARCH_MODAL_CLOSE_EVENT = 'search-modal-close';

/** Stacked above header (80), below cart drawer (90). */
export const SEARCH_MODAL_Z_INDEX = 85;

/** Debounce delay for instant search API calls (ms). */
export const SEARCH_DEBOUNCE_MS = 200;

/** Minimum query length before searching. */
export const SEARCH_MIN_QUERY_LENGTH = 1;

/** Default number of instant search results. */
export const SEARCH_MAX_RESULTS = 8;
