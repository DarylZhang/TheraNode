export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly response?: ApiResponse<unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  // Also persist in cookie so Next.js middleware can read it
  document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`;
}

export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  document.cookie = 'accessToken=; path=/; max-age=0';
}

// Prevent multiple concurrent refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function doRefreshToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return null;
    }
    const json: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();
    saveTokens(json.data.accessToken, json.data.refreshToken);
    onTokenRefreshed(json.data.accessToken);
    return json.data.accessToken;
  } catch {
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && !skipAuth) {
    if (isRefreshing) {
      // Queue up while refresh in-flight
      return new Promise((resolve, reject) => {
        refreshSubscribers.push(async (token) => {
          headers.set('Authorization', `Bearer ${token}`);
          try {
            const retryRes = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
            const json: ApiResponse<T> = await retryRes.json();
            if (json.code >= 400) reject(new ApiError(json.code, json.message, json));
            else resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    isRefreshing = true;
    const newToken = await doRefreshToken();

    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
    } else {
      throw new ApiError(401, 'Unauthorized');
    }
  }

  const json: ApiResponse<T> = await res.json();
  if (json.code >= 400) {
    throw new ApiError(json.code, json.message, json);
  }
  return json;
}
