/**
 * Custom API Error class with proper typing
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(message: string, status: number, statusText: string = '', data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/** Thrown when a request is intentionally cancelled (e.g. superseded catalog filter fetch). */
export class RequestAbortedError extends Error {
  constructor() {
    super('Request aborted');
    this.name = 'RequestAbortedError';
  }
}

/**
 * Request options interface
 */
export interface RequestOptions extends globalThis.RequestInit {
  params?: Record<string, string>;
  skipAuth?: boolean; // Skip automatic token injection
}




