/**
 * API Client
 * 
 * Client for making requests to the backend API
 * 
 * In Next.js, when API routes are in the same app, we use relative paths.
 * If NEXT_PUBLIC_API_URL is set, use it (for external API).
 * Otherwise, use empty string to make relative requests to Next.js API routes.
 */

import { ApiError } from "./api-client/types";
import type { RequestOptions } from "./api-client/types";
import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "./api-client/http-methods";
import { resolveApiBaseUrl } from "./api-client/resolve-api-base-url";

class ApiClient {
  private get baseUrl(): string {
    return resolveApiBaseUrl();
  }

  async get<T>(endpoint: string, options?: RequestOptions, retryCount = 0): Promise<T> {
    return getRequest<T>(this.baseUrl, endpoint, options, retryCount);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return postRequest<T>(this.baseUrl, endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return putRequest<T>(this.baseUrl, endpoint, data, options);
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return patchRequest<T>(this.baseUrl, endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return deleteRequest<T>(this.baseUrl, endpoint, options);
  }
}

export const apiClient = new ApiClient();
export { ApiError, RequestAbortedError } from "./api-client/types";
