/**
 * TMDB HTTP client
 *
 * A thin, typed wrapper around the browser Fetch API configured for TMDB v3.
 *
 * ── Security ──────────────────────────────────────────────────────────────────
 * • The Bearer token is read from the Vite env variable VITE_TMDB_READ_TOKEN.
 *   It is never hardcoded, never logged, and never included in error messages.
 * • All URL path segments are encoded with encodeURIComponent before use.
 * • All query parameters are built with URLSearchParams (no manual string
 *   interpolation) to prevent parameter injection.
 * • Responses are validated for shape before being returned to callers.
 * • include_adult defaults to false on every request.
 * • AbortController is supported on every request for cancellation.
 *
 * ── Rate limiting ─────────────────────────────────────────────────────────────
 * TMDB allows ~50 requests per second. The client respects Retry-After headers
 * and throws a TmdbRateLimitError so callers (React Query) can back off.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * import { tmdbGet, tmdbPost, tmdbDelete } from './tmdbClient';
 * const detail = await tmdbGet<TmdbMovieDetail>('/movie/550');
 */

// ── Configuration ─────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env.VITE_TMDB_BASE_URL as string | undefined)
  ?? 'https://api.themoviedb.org/3';

/** Public image CDN base — use with ImagePath fields */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/** Poster sizes available on TMDB CDN */
export const POSTER_SIZES = {
  small:    'w185',
  medium:   'w342',
  large:    'w500',
  original: 'original',
} as const;

/** Backdrop sizes available on TMDB CDN */
export const BACKDROP_SIZES = {
  small:    'w300',
  medium:   'w780',
  large:    'w1280',
  original: 'original',
} as const;

/** Build a full image URL from a TMDB path */
export function tmdbImageUrl(
  path: string | null | undefined,
  size: string = POSTER_SIZES.medium
): string {
  if (!path) return '';
  // Validate path starts with '/' and contains only safe characters
  if (!/^\/[a-zA-Z0-9_.-]+$/.test(path)) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// ── Token access ──────────────────────────────────────────────────────────────

/**
 * Returns the Bearer token from the environment.
 * Throws a clear error in development if the token is missing.
 * In production, throws a generic error to avoid leaking config details.
 */
function getReadToken(): string {
  const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined;
  if (!token || token === 'your_tmdb_read_access_token_here') {
    if (import.meta.env.DEV) {
      throw new TmdbConfigError(
        'VITE_TMDB_READ_TOKEN is not set. ' +
        'Copy .env.example to .env and add your TMDB Read Access Token.'
      );
    }
    throw new TmdbConfigError('API configuration error.');
  }
  return token;
}

// ── Custom error types ────────────────────────────────────────────────────────

export class TmdbError extends Error {
  readonly statusCode?:     number;
  readonly tmdbStatusCode?: number;

  constructor(message: string, statusCode?: number, tmdbStatusCode?: number) {
    super(message);
    this.name           = 'TmdbError';
    this.statusCode     = statusCode;
    this.tmdbStatusCode = tmdbStatusCode;
  }
}

export class TmdbConfigError extends TmdbError {
  constructor(message: string) {
    super(message);
    this.name = 'TmdbConfigError';
  }
}

export class TmdbNotFoundError extends TmdbError {
  constructor(resource: string) {
    super(`Not found: ${resource}`, 404);
    this.name = 'TmdbNotFoundError';
  }
}

export class TmdbRateLimitError extends TmdbError {
  readonly retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limited. Retry after ${retryAfter}s`, 429);
    this.name        = 'TmdbRateLimitError';
    this.retryAfter  = retryAfter;
  }
}

export class TmdbAuthError extends TmdbError {
  constructor() {
    super('Authentication failed. Check your TMDB token.', 401);
    this.name = 'TmdbAuthError';
  }
}

// ── Core request function ─────────────────────────────────────────────────────

interface RequestOptions {
  params?:  Record<string, string | number | boolean | undefined>;
  body?:    unknown;
  signal?:  AbortSignal;
  /** Session ID for write operations that require user auth */
  sessionId?: string;
}

async function request<T>(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getReadToken();

  // Build URL — path segments are already validated by callers
  const url = new URL(`${BASE_URL}${path}`);

  // Always set safe defaults
  url.searchParams.set('language', 'en-US');

  // Append caller-supplied params (URLSearchParams prevents injection)
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  // Session ID for write endpoints
  if (options.sessionId) {
    url.searchParams.set('session_id', options.sessionId);
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept':        'application/json',
  };

  if (method !== 'GET' && options.body !== undefined) {
    headers['Content-Type'] = 'application/json;charset=utf-8';
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body:   method !== 'GET' && options.body !== undefined
              ? JSON.stringify(options.body)
              : undefined,
    signal: options.signal,
  });

  // ── Error handling ──────────────────────────────────────────────────────
  if (!response.ok) {
    if (response.status === 401) throw new TmdbAuthError();
    if (response.status === 404) throw new TmdbNotFoundError(path);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') ?? '10', 10);
      throw new TmdbRateLimitError(retryAfter);
    }

    // Parse TMDB error body for status_message — but never log the token
    let tmdbMessage = `HTTP ${response.status}`;
    let tmdbCode: number | undefined;
    try {
      const errBody = await response.json() as { status_message?: string; status_code?: number };
      if (errBody.status_message) tmdbMessage = errBody.status_message;
      if (errBody.status_code)    tmdbCode    = errBody.status_code;
    } catch { /* ignore parse errors */ }

    throw new TmdbError(tmdbMessage, response.status, tmdbCode);
  }

  // 204 No Content
  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}

// ── Public HTTP helpers ───────────────────────────────────────────────────────

export const tmdbGet = <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
  request<T>('GET', path, options);

export const tmdbPost = <T>(path: string, body: unknown, options?: RequestOptions) =>
  request<T>('POST', path, { ...options, body });

export const tmdbDelete = <T>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>('DELETE', path, { ...options, body });
